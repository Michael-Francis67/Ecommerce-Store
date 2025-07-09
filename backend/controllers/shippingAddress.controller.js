import ShippingAddress from "../models/ShippingAddress.model.js";

export const getShippingAddress = async (req, res) => {
    try {
        const userId = req.user._id;

        const address = await ShippingAddress.findOne({user: userId});

        if (!address) {
            return res.status(404).json({message: "No shipping address found"});
        }

        res.status(200).json(address);
    } catch (error) {
        console.error("Error during get shipping address:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};

export const updateShippingAddress = async (req, res) => {
    try {
        const {name, address, phoneNumber} = req.body;
        const userId = req.user._id;

        const addressExists = await ShippingAddress.findOne({user: userId});

        if (addressExists) {
            const updatedAddress = await ShippingAddress.findOneAndUpdate(
                {user: userId},
                {name, address, phoneNumber},
                {new: true}
            );
            res.status(200).json(updatedAddress);
        } else {
            const newAddress = await ShippingAddress.create({user: userId, name, address, phoneNumber});
            res.status(201).json(newAddress);
        }
    } catch (error) {
        console.error("Error during update shipping address:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
};
