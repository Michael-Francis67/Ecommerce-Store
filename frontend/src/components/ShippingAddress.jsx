import {Link} from "react-router-dom";
import {motion} from "framer-motion";
import {useState} from "react";
import axios from "../lib/axios";

const ShippingAddress = () => {
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [checked, setChecked] = useState(false);

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleCheckedChange = async (e) => {
        setChecked(e.target.checked);

        if (e.target.checked) {
            const res = await axios.get("/shipping-address");
            console.log(res.data);

            setName(res.data.name);
            setAddress(res.data.address);
            setPhoneNumber("0" + res.data.phoneNumber);
        } else {
            setName("");
            setAddress("");
            setPhoneNumber("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        const res = await axios.put("/shipping-address", {name, address, phoneNumber});
        console.log(res.data);
        setAddress("");
        setName("");
        setPhoneNumber("");
    };

    return (
        <motion.div
            className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <p className="text-xl font-semibold text-emerald-400">Shipping Address</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full rounded-md border-gray-700 bg-gray-700 px-3 py-2 placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-800 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Address"
                    className="w-full rounded-md border-gray-700 bg-gray-700 px-3 py-2 placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-800 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Phone Number"
                    className="w-full rounded-md border-gray-700 bg-gray-700 px-3 py-2 placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-800 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <div className="flex items-center justify-center">
                    <input
                        type="checkbox"
                        id="default-checkbox"
                        value={checked}
                        onChange={handleCheckedChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 
                        dark:border-gray-600 cursor-pointer"
                    />
                    <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-300">
                        Use my previous address
                    </label>
                </div>

                <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                >
                    Add Shipping Address
                </button>
            </form>
        </motion.div>
    );
};

export default ShippingAddress;
