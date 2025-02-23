import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/privacypolicy.css";

const PrivacyPolicy = () => {
    return (
        <div className="privacy-container">
            <nav className="nav-bar">
                <Link to="/" className="home-link">Back to Home</Link>
            </nav>
            <div className="privacy-content">
                <div className="policy-box">
                    <h2>Privacy Policy</h2>
                    <p>
                        Sail Mate respects the privacy of our visitors and customers and complies with applicable
                        laws for the protection of your privacy.
                    </p>

                    <h3>1. Definitions</h3>
                    <p>
                        Personal Data refers to any information that can identify an individual directly or indirectly.
                        This includes names, email addresses, and any other identifiable data.
                    </p>

                    <h3>2. Why We Collect Data</h3>
                    <p>
                        We collect personal data to provide our services, comply with legal obligations,
                        and improve our user experience. The key reasons include:
                    </p>
                    <ul>
                        <li>Ensuring full functionality of our platform.</li>
                        <li>Complying with legal regulations.</li>
                        <li>Improving user experience through analytics.</li>
                        <li>Processing transactions and payments.</li>
                    </ul>

                    <h3>3. Types of Data We Collect</h3>
                    <p>
                        <strong>Basic Account Data:</strong> We collect usernames, email addresses, and passwords when users register.
                    </p>
                    <p>
                        <strong>Transaction and Payment Data:</strong> Payment details may be collected to process subscriptions and purchases.
                    </p>

                    <h3>4. When Will We Share Your Information?</h3>
                    <p>
                        When you make a booking, we may need to share your personal information with service providers,
                        including ferry operators and third-party service providers necessary for fulfilling your booking.
                    </p>

                    <h3>5. Your Rights</h3>
                    <p>
                        You have the right to access, amend, delete, and restrict the processing of your personal data.
                        You can also opt-out of marketing communications at any time.
                    </p>

                    <h3>6. Security & Retention</h3>
                    <p>
                        Sail Mate ensures that your personal information is stored securely and retained for as long
                        as legally required or necessary for providing our services.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;