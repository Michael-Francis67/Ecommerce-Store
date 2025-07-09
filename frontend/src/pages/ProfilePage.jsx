import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import logo from "../logo.png";
import {Loader} from "lucide-react";
import {useOrdersStore} from "../stores/useOrdersStore";

export default function ProfilePage() {
    const {fetchUser, name, email, profilePic, loading, uploadProfilePic} = useOrdersStore();

    // Replace with actual ID (auth, state, etc.)

    const handleFileChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];

        if (file) {
            await uploadProfilePic(file);
        }

        e.target.value = null;
    };

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <motion.div
            className="flex items-start justify-center min-h-screen"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.2}}
        >
            <div className="max-w-lg w-full mx-auto mt-12 bg-gray-800 rounded-xl shadow-xl p-8">
                <h2 className="text-center text-3xl font-extrabold text-emerald-400 mb-4">Profile</h2>
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-32 h-32">
                        <img
                            src={profilePic ? profilePic : logo}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-md"
                        />
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    handleFileChange(e);
                                }}
                                className="hidden"
                            />
                            📷
                        </label>
                    </div>

                    {loading && (
                        <p className="text-blue-600 text-sm text-center">
                            <Loader className="animate-spin" /> Uploading...
                        </p>
                    )}

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-300">Name</label>
                        <input
                            name="name"
                            value={name}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring text-black focus:ring-blue-300 disabled:bg-gray-200 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="w-full mt-4">
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            name="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring text-black focus:ring-blue-300 disabled:bg-gray-200 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
