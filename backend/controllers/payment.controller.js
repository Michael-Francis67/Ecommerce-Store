import {stripe} from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.models.js";
import ShippingAddress from "../models/ShippingAddress.model.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const {products, couponCode} = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({message: "Invalid or empty products array"});
        }

        // Calculate the total amount
        let totalAmount = 0;
        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100); // Convert to cents
            totalAmount += amount * product.quantity; // Total amount in cents
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image], // Assuming product has an image URL
                    },
                    unit_amount: amount, // Price in cents
                },
                quantity: product.quantity || 1,
            };
        });

        // If a coupon code is provided, apply the discount
        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({code: couponCode, userId: req.user._id, isActive: true});
            if (coupon) {
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100); // Apply discount
            }
        }

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            discounts: coupon
                ? [
                      {
                          coupon: await createStripeCoupon(coupon.discountPercentage),
                      },
                  ]
                : [],
            metadata: {
                userId: req.user._id.toString(), // Store user ID in metadata
                couponCode: couponCode || null,
                products: JSON.stringify(
                    products.map((product) => ({
                        id: product._id,
                        quantity: product.quantity,
                        price: product.price,
                    }))
                ),
            },
        });

        if (totalAmount >= 20000) {
            // Create a new coupon for the user if they spend more than $200
            await createNewCoupon(req.user._id);
        }

        res.status(200).json({
            id: session.id,
            totalAmount: totalAmount / 100, // Convert back to dollars for response
        });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const checkoutSuccess = async (req, res) => {
    try {
        const {sessionId} = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            await Coupon.findOneAndUpdate(
                {code: session.metadata.couponCode, userId: session.metadata.userId},
                {
                    isActive: false, // Mark coupon as inactive if payment failed
                }
            );
        }

        const address = await ShippingAddress.findOne({user: session.metadata.userId});

        if (!address) {
            return res.status(404).json({message: "No shipping address found"});
        }

        // If payment was successful, you can perform additional actions here
        const products = JSON.parse(session.metadata.products);
        const newOrder = new Order({
            user: session.metadata.userId,
            products: products.map((product) => ({
                product: product.id,
                quantity: product.quantity,
                price: product.price,
            })),
            totalAmount: session.amount_total / 100, // Convert cents to dollars
            stripeSessionId: sessionId,
            shippingAddress: address,
        });

        await newOrder.save();

        const user = await User.findById(session.metadata.userId);
        user.cartItems = [];
        await user.save();

        res.status(200).json({
            success: true,
            message: "Payment successful and order created, coupon deactivated if used.",
            orderId: newOrder._id,
        });
    } catch (error) {
        console.error("Error in checkout success:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const transactions = async (req, res) => {
    try {
        const userId = req.user._id;

        const transactions = await Order.find({user: userId}).populate("products.product").sort({createdAt: -1});

        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getSpecificTransactions = async (req, res) => {
    try {
        const userId = req.user._id;
        const orderId = req.params.orderId;

        const transactions = await Order.find({user: userId, _id: orderId})
        .populate("products.product")
        .sort({createdAt: -1});

        res.status(200).json(transactions);
        console.log(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getOrdersByItsId = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const order = await Order.findById(orderId)
        .populate("products.product")
        .populate("shippingAddress", "name address phoneNumber")
        .populate("user", "-password")
        .sort({createdAt: -1});

        res.status(200).json(order);
    } catch (error) {}
};

// Helper function to create a Stripe coupon
async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    });

    return coupon.id; // Return the Stripe coupon ID
}

async function createNewCoupon(userId) {
    await Coupon.findOneAndDelete({userId});

    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10, // Example discount percentage
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Valid for 30 days
        userId: userId,
    });

    await newCoupon.save();
    return newCoupon;
}
