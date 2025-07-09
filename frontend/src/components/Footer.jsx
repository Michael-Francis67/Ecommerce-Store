import React from "react";
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 px-4 mt-16">
            <h2 className="text-lg font-semibold mb-2 text-center">Contact Information</h2>

            <div className="flex flex-row-reverse justify-between items-center gap-6 p-6">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <p className="mb-1">
                            <Link to="https://wa.me/+2349045383414" target="_blank">
                                <img
                                    src="https://img.icons8.com/color/48/000000/whatsapp.png"
                                    alt="whatsapp logo"
                                    className="inline-block mr-2 w-4 h-4"
                                />{" "}
                                <span className="text-blue-400">WhatsApp: +234 904 538 3414</span>
                            </Link>
                        </p>
                        <p className="mb-1">
                            📧{" "}
                            <a href="mailto:michaelrancis23@gmail.com" className="text-blue-400 hover:underline">
                                michaelrancis23@gmail.com
                            </a>
                        </p>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                        <Link to={"https://wa.me/+2349045383414"} target="_blank">
                            <img src="https://img.icons8.com/color/48/000000/whatsapp.png" alt="whatsapp logo" />
                        </Link>
                        <Link to={"https://www.facebook.com"} target="_blank">
                            <img src="https://img.icons8.com/color/48/000000/facebook.png" alt="facebook logo" />
                        </Link>
                        <Link to={"https://www.linkedin.com/in"} target="_blank">
                            <img src="https://img.icons8.com/color/48/000000/linkedin.png" alt="linkedin logo" />
                        </Link>
                        <Link to={"https://twitter.com"} target="_blank">
                            <img src="https://img.icons8.com/color/48/000000/twitter.png" alt="twitter logo" />
                        </Link>
                        <Link to={"https://www.instagram.com"} target="_blank">
                            <img src="https://img.icons8.com/color/48/000000/instagram-new.png" alt="instagram logo" />
                        </Link>
                    </div>

                    <div>
                        <p className="mb-1">
                            📍 <span className="text-gray-300">No. 55b Ziks Avenue, Amikwo, Awka</span>
                        </p>
                        <p className="mb-1">
                            📞 <span className="text-gray-300">+234 904 538 3414</span>
                        </p>
                        <div className="sm:col-span-2 lg:col-span-3 flex items-end justify-end">
                            <p className="text-gray-500 text-sm text-right">
                                &copy; {new Date().getFullYear()} Michael Francis. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <p className="text-emerald-500 text-center text-sm">Developed by Michael Francis</p>
            </div>
        </footer>
    );
};

export default Footer;
