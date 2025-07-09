import toast from "react-hot-toast";
import {ShoppingCart} from "lucide-react";
import {useUserStore} from "../stores/userUserStore";
import {useCartStore} from "../stores/useCartStore";
import {Link} from "react-router-dom";

const ProductCard = ({product}) => {
    const {user} = useUserStore();
    const {addToCart} = useCartStore();
    const handleAddToCart = async () => {
        if (!user) {
            toast.error("Please login to add to cart", {id: "login"});
            return;
        } else {
            addToCart(product);
        }
    };

    return (
        <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
            <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
                <img className="h-full w-full object-cover z-10" src={product.image} alt="product image" />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
            </div>

            <div className="mt-4 px-5 pb-5">
                <h5 className="text-xl font-semibold tracking-tight text-white">{product.name}</h5>
                <div className="mt-2 mb-5 flex items-center justify-between">
                    <p>
                        <span className="text-3xl font-bold text-emerald-400">${product.price.toFixed(2)}</span>
                    </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <button
                        className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 whitespace-nowrap"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={22} className="mr-2" />
                        Add to cart
                    </button>

                    <Link
                        to={`/products/${product._id}/reviews`}
                        className="px-2 py-2.5 text-center rounded-lg transition duration-300 ease-in-out text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 whitespace-nowrap focus:ring-gray-300"
                    >
                        Add Review
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;
