const Footer = () => {
    return (
        <footer className="bg-[#ededee] text-black py-5 mt-9 border-t border-black-200 font-serif">
            <div className="container mx-auto text-center flex justify-center items-center gap-5">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} Unique Blog. All rights reserved.
                </p>
                <div className="flex justify-center space-x-4 mt-2">
                    <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        Terms of Service
                    </a>
                    <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;