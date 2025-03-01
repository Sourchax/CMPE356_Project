import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
    return (
        <div className="w-4/5 mx-auto p-8">
            <nav className="py-4">
                <Link
                    to="/"
                    className="text-white bg-[#0D3A73] hover:bg-[#0C335D] px-6 py-2 rounded-lg font-semibold text-sm transition duration-300 ease-in-out"
                >
                    Back to Home
                </Link>
            </nav>
            <div className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-lg mt-8 text-left">
                    <h2 className="text-3xl font-semibold text-[#0D3A73] mb-6">
                        Privacy Policy
                    </h2>
                    <p className="text-base leading-relaxed mb-4">
                        Sail Mate respects the privacy of our visitors and customers and complies with applicable
                        laws for the protection of your privacy.
                    </p>

                    <h3 className="text-xl font-semibold text-[#0D3A73] mt-6">
                        1. Definitions
                    </h3>
                    <p className="text-base leading-relaxed mb-4">
                        Personal Data refers to any information that can identify an individual directly or indirectly.
                        This includes names, email addresses, and any other identifiable data.
                    </p>

                    <h3 className="text-xl font-semibold text-[#0D3A73] mt-6">
                        2. Why We Collect Data
                    </h3>
                    <p className="text-base leading-relaxed mb-4">
                        We collect personal data to provide our services, comply with legal obligations,
                        and improve our user experience. The key reasons include:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Ensuring full functionality of our platform.</li>
                        <li>Complying with legal regulations.</li>
                        <li>Improving user experience through analytics.</li>
                        <li>Processing transactions and payments.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-[#0D3A73] mt-6">
                        3. Types of Data We Collect
                    </h3>
                    <p className="text-base leading-relaxed mb-4">
                        <strong>Basic Account Data:</strong> We collect usernames, email addresses, and passwords when users register.
                    </p>
                    <p className="text-base leading-relaxed mb-4">
                        <strong>Transaction and Payment Data:</strong> Payment details may be collected to process subscriptions and purchases.
                    </p>

                    <h3 className="text-xl font-semibold text-[#0D3A73] mt-6">
                        4. When Will We Share Your Information?
                    </h3>
                    <p className="text-base leading-relaxed mb-4">
                        When you make a booking, we may need to share your personal information with service providers,
                        including ferry operators and third-party service providers necessary for fulfilling your booking.
                    </p>

                    <h3 className="text-xl font-semibold text-[#0D3A73] mt-6">
                        5. Your Rights
                    </h3>
                    <p className="text-base leading-relaxed mb-4">
                        You have the right to access, amend, delete, and restrict the processing of your personal data.
                        You can also opt-out of marketing communications at any time.
                    </p>

                    <h3 className="text-xl font-semibold text-[#0D3A73] mt-6">
                        6. Security & Retention
                    </h3>
                    <p className="text-base leading-relaxed mb-4">
                        Sail Mate ensures that your personal information is stored securely and retained for as long
                        as legally required or necessary for providing our services.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
