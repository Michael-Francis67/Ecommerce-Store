import {useEffect, useRef, useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";

export default function ImageSlider({products}) {
    const [current, setCurrent] = useState(0);
    const autoplayRef = useRef(null);
    const pauseTimeoutRef = useRef(null);

    const startAutoplay = () => {
        autoplayRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % products.length);
        }, 5000);
    };

    const resetAutoplay = () => {
        clearInterval(autoplayRef.current);
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = setTimeout(() => {
            startAutoplay();
        }, 5000); // Wait 5 seconds after manual interaction
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % products.length);
        resetAutoplay();
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? products.length - 1 : prev - 1));
        resetAutoplay();
    };

    useEffect(() => {
        startAutoplay();
        return () => {
            clearInterval(autoplayRef.current);
            clearTimeout(pauseTimeoutRef.current);
        };
    }, []);

    const handleClick = (product) => {
        window.location.href = `/category/${product.category}`;
    };

    return (
        <div className="relative w-[700px] lg:h-[300px] md:h-[500px] mb-8 overflow-hidden rounded-2xl shadow-md">
            {products.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
                        index === current ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <img src={slide.image} className="w-fit h-full bg-emerald-600 object-auto" alt={slide.name} />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-8 text-white">
                        <h2 className="text-2xl md:text-4xl font-bold mb-2">{slide.name}</h2>
                        <p className="text-md md:text-lg">{slide.description}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-xl transition hover:cursor-pointer"
                            onClick={() => {
                                handleClick(products[current]);
                            }}
                        >
                            Shop Now
                        </button>
                    </div>
                </div>
            ))}

            {/* Prev/Next Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
            >
                <ChevronLeft />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
            >
                <ChevronRight />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {products.map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i === current ? "bg-white" : "bg-gray-400"}`}></div>
                ))}
            </div>
        </div>
    );
}
