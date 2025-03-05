import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    
    const navigateToContact = () => {
        navigate("/contact");
    };
    
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-white via-[#D1FFD7]/50 to-[#D1FFD7] py-20">
            {/* Main content container */}
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0D3A73] text-white shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="mb-3 text-5xl font-bold text-[#0D3A73]">Privacy Policy</h1>
                    <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#F0C808]"></div>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        At SailMate, we value your privacy and are committed to protecting your personal information.
                        We only collect what's necessary to provide our ferry ticketing and booking services.
                    </p>
                    <div className="mt-3 text-sm text-gray-500">Last Updated: June 2023</div>
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-2xl p-10 shadow-lg">
                    <div className="mb-12 space-y-10">
                        {/* Introduction */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">Introduction</h2>
                            <p className="text-base text-gray-700 leading-relaxed">
                                This Privacy Policy explains how SailMate collects, uses, and protects information about you when you use our ferry ticketing platform.
                                We respect your privacy and only collect data necessary to facilitate your ferry bookings and provide a seamless travel experience. 
                                We do not store your payment card details on our servers or collect any special categories of personal data beyond what's required for your ferry travel.
                                We may update this Privacy Policy periodically. If we make significant changes, we will notify you by revising the date at the top
                                of the policy and, where appropriate, by email.
                            </p>
                        </div>

                        {/* Information We Collect */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">Information We Collect</h2>
                            
                            <h3 className="mt-6 mb-3 text-xl font-semibold text-[#06AED5]">Information You Provide to Us</h3>
                            <p className="text-base text-gray-700 leading-relaxed mb-4">
                                We collect information you provide directly to us when you book ferry tickets, create an account, 
                                subscribe to notifications, or communicate with us. This may include:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-base text-gray-700 mb-6">
                                <li>Contact information (name, email address, phone number)</li>
                                <li>Profile information (username, password)</li>
                                <li>Passenger information (names, ages, nationality where required by ferry operators)</li>
                                <li>Payment information (processed securely through our payment processors, not stored on our servers)</li>
                                <li>Travel details (routes, dates, times, vehicle information if applicable)</li>
                                <li>Communications you send to our customer support team</li>
                            </ul>
                            
                            <h3 className="mt-6 mb-3 text-xl font-semibold text-[#06AED5]">Information We Collect Automatically</h3>
                            <p className="text-base text-gray-700 leading-relaxed mb-4">
                                When you access or use our ferry booking platform, we may automatically collect:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-base text-gray-700">
                                <li>Log information (IP address, browser type, pages viewed, time spent on site)</li>
                                <li>Device information (device type, operating system, unique device identifiers)</li>
                                <li>Location information (with your consent, to suggest nearby ports or routes)</li>
                                <li>Cookies and similar technologies (to remember your preferences and improve your experience)</li>
                            </ul>
                        </div>

                        {/* How We Use Information */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">How We Use Your Information</h2>
                            <p className="text-base text-gray-700 leading-relaxed mb-4">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-base text-gray-700">
                                <li>Process and confirm your ferry bookings</li>
                                <li>Issue electronic tickets and boarding passes</li>
                                <li>Send booking confirmations, changes, and travel updates</li>
                                <li>Facilitate check-in processes with ferry operators</li>
                                <li>Provide customer support for booking inquiries</li>
                                <li>Notify you about schedule changes, cancellations, or service disruptions</li>
                                <li>Process refunds or booking modifications</li>
                                <li>Improve our ferry route offerings and service</li>
                                <li>Personalize your ferry booking experience</li>
                                <li>Prevent fraudulent transactions and ticket fraud</li>
                                <li>Comply with legal obligations and ferry operator requirements</li>
                            </ul>
                        </div>

                        {/* Sharing of Information */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">Sharing of Information</h2>
                            <p className="text-base text-gray-700 leading-relaxed mb-4">
                                We may share the information we collect as follows:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-base text-gray-700">
                                <li><span className="font-medium text-[#F05D5E]">With ferry operators and port authorities:</span> To process your booking, issue tickets, and fulfill regulatory requirements</li>
                                <li><span className="font-medium text-[#F05D5E]">With payment processors:</span> To complete your ferry ticket payment transactions</li>
                                <li><span className="font-medium text-[#F05D5E]">With service providers:</span> Who help us operate our platform, such as cloud storage, email services, and customer support tools</li>
                                <li><span className="font-medium text-[#F05D5E]">In response to legal process:</span> Such as a court order or subpoena, or to comply with maritime and transport regulations</li>
                                <li><span className="font-medium text-[#F05D5E]">To protect safety:</span> Of passengers, vessels, port facilities, or to respond to emergencies</li>
                                <li><span className="font-medium text-[#F05D5E]">In connection with a business transfer:</span> Such as a merger, acquisition, or sale of our ferry booking business</li>
                            </ul>
                        </div>

                        {/* Security */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">Data Security</h2>
                            <p className="text-base text-gray-700 leading-relaxed">
                                We take reasonable measures to help protect information about you from loss, theft, misuse, 
                                unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable, 
                                and we cannot guarantee the security of our systems or your information.
                            </p>
                        </div>

                        {/* Your Rights */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">Your Rights and Choices</h2>
                            <p className="text-base text-gray-700 leading-relaxed mb-4">
                                You have several rights regarding your personal information:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-base text-gray-700">
                                <li><span className="font-medium text-[#06AED5]">Account Information:</span> You can update your account information by logging into your account settings</li>
                                <li><span className="font-medium text-[#06AED5]">Cookies:</span> Most web browsers accept cookies by default. You can usually set your browser to remove or reject cookies</li>
                                <li><span className="font-medium text-[#06AED5]">Promotional Communications:</span> You can opt out of receiving promotional emails by following the instructions in those emails</li>
                                <li><span className="font-medium text-[#06AED5]">Data Access and Portability:</span> You can request a copy of your personal data we hold</li>
                                <li><span className="font-medium text-[#06AED5]">Data Deletion:</span> You can request that we delete your personal information</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                {/* Contact Information */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600">
                        Have questions about our privacy practices?{" "}
                        <span 
                            onClick={navigateToContact} 
                            className="text-[#0D3A73] font-medium hover:text-[#06AED5] underline cursor-pointer transition-colors duration-300"
                        >
                            Contact our support team
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
