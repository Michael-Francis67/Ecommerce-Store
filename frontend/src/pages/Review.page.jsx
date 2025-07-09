import {motion} from "framer-motion";
import {useEffect, useState} from "react";
import axios from "../lib/axios";
import {useParams} from "react-router-dom";
import {Star} from "lucide-react";
import {useReviewStore} from "../stores/useReviewStore";

const ReviewPage = () => {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(null);
    const [review, setReview] = useState([]);
    const {createReview, fetchReviews, reviews, product, user} = useReviewStore();
    const {productId} = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        await createReview(productId, rating, review);
        setRating(0);
        setReview("");
    };

    const handleStarClick = (star) => {
        if (rating === star) {
            setRating(0);
        } else {
            setRating(star);
        }
    };
    const handleStarHover = (index) => setHovered(index);
    const handleStarLeave = () => setHovered(null);

    useEffect(() => {
        const fetchData = async () => {
            await fetchReviews(productId);
        };
        fetchData();
    }, [fetchReviews, productId, createReview, reviews, product, user]);
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.2}}
            className="relative h-lvh overflow-hidden"
        >
            <h2 className="text-5xl font-bold text-emerald-400 mb-4 text-center">Reviews Page</h2>

            <div class="flex w-full">
                {" "}
                <div class="w-[40%] h-full">
                    <div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center items-center">
                            <img src={product.image} alt="shoe" className="w-32 h-32 rounded-xl object-cover" />
                            <div className="flex flex-col justify-between items-center gap-3">
                                <p className="text-lg font-bold text-emerald-400">{product.name}</p>
                                <p className="text-gray-300 text-sm">${product.price}</p>
                            </div>
                            <div className="flex space-x-2 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={28}
                                        className={`cursor-pointer transition ${
                                            (hovered || rating) >= star ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                        onClick={() => handleStarClick(star)}
                                        onMouseEnter={() => handleStarHover(star)}
                                        onMouseLeave={handleStarLeave}
                                    />
                                ))}
                            </div>
                            <textarea
                                name="review"
                                id="review"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="w-full h-40 border-2 border-emerald-500 rounded-lg p-2 focus:outline-none focus:border-emerald-600"
                            ></textarea>
                            <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Add Review
                            </button>
                        </form>
                    </div>
                </div>
                <div class="divider divider-horizontal divider-success"></div>
                <div class="w-[60%] h-full">
                    <div className="p-6 w-full h-[100vh] rounded-xl overflow-auto">
                        <h1 className="text-3xl font-bold text-emerald-400 mb-4 text-center">Reviews</h1>
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div className="flex flex-col gap-1 w-full" key={index}>
                                    <p className="text-gray-300 text-sm">{review.comment}</p>
                                    <div className="flex justify-start gap-1 items-center space-x-2">
                                        Ratings:
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={12}
                                                className={`cursor-pointer ${
                                                    review.rating >= star ? "text-yellow-400" : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center flex-row-reverse gap-2 float-end">
                                        <img src={user.profilePic} className="w-8 h-8 rounded-full object-cover" />
                                        <span className="text-gray-300 text-sm">{user.name}</span>
                                    </div>

                                    <hr className="my-4 border-gray-600" />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-300 text-center">No reviews yet, be the first one to add one!</p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewPage;
