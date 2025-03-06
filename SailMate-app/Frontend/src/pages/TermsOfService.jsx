import React from "react";
import { Link, useNavigate } from "react-router-dom";

const BookingConditions = () => {
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
                                <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="mb-3 text-5xl font-bold text-[#0D3A73]">Terms of Service</h1>
                    <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#F0C808]"></div>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        Please read these terms carefully before using SailMate's ferry ticketing platform.
                        By using our services, you agree to these terms and conditions for booking ferry travel.
                    </p>
                    <div className="mt-3 text-sm text-gray-500">Last Updated: March 2025</div>
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-2xl p-10 shadow-lg">
                    <div className="mb-12 space-y-10">
                        {/* Introduction */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">Introduction</h2>
                            <p className="text-base text-gray-700 leading-relaxed">
                                SailMate (the 'Platform') is a ferry ticketing service that allows you to search, compare, and book ferry tickets
                                across multiple operators and routes. The Platform is owned and operated by SailMate Ltd (referred to in these Terms of Service as 'we', 'us' or 'SailMate').
                                These Terms of Service constitute a legally binding agreement between you and SailMate regarding your use of our ferry booking services.
                            </p>
                        </div>

                        {/* Application */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">1. Application</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    1.1 These Terms of Service apply to your access to and use of the SailMate ferry booking platform. By accessing or using our Platform, you agree to be bound by these Terms of Service.
                                </p>
                                <p>
                                    1.2 We may modify these Terms of Service to reflect changes in ferry operator policies, legal requirements, or our booking services. If we do so, we will notify you by updating the date at the top of these Terms of Service.
                                </p>
                                <p>
                                    1.3 If you do not agree to these Terms of Service, you may not access or use the Platform to book ferry tickets.
                                </p>
                            </div>
                        </div>

                        {/* Account Registration */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">2. Account Registration</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    2.1 To book ferry tickets through our Platform, you may be required to create a SailMate account and provide certain personal and travel information.
                                </p>
                                <p>
                                    2.2 You agree to provide accurate, current, and complete information during the registration and booking process. Inaccurate information may result in booking errors or denied boarding by ferry operators.
                                </p>
                                <p>
                                    2.3 You are responsible for safeguarding your SailMate account credentials and for all ferry bookings and activities that occur under your account.
                                </p>
                            </div>
                        </div>

                        {/* Booking Conditions */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">3. Ferry Booking Conditions</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    3.1 <span className="font-semibold text-[#06AED5]">Ferry Ticketing Process:</span> When you book ferry tickets through SailMate, you are entering into a transportation agreement with the ferry operator. SailMate acts as an intermediary platform facilitating the ticket sale.
                                </p>
                                <p>
                                    3.2 <span className="font-semibold text-[#06AED5]">Ferry Ticket Confirmation:</span> Once your ferry booking is confirmed, you will receive an electronic ticket or booking confirmation by email. You must present this at check-in along with required identification documents.
                                </p>
                                <p>
                                    3.3 <span className="font-semibold text-[#06AED5]">Ferry Pricing and Payments:</span> All ferry ticket prices are displayed in the currency specified during the booking process and may include booking fees. Full payment is required to confirm your ferry reservation.
                                </p>
                                <p>
                                    3.4 <span className="font-semibold text-[#06AED5]">Schedule Changes and Cancellations:</span> Ferry schedules may change due to weather conditions, technical issues, or other circumstances. Cancellation and refund policies vary by ferry operator and are specified during the booking process.
                                </p>
                                <p>
                                    3.5 <span className="font-semibold text-[#06AED5]">Check-in Requirements:</span> You must arrive at the ferry terminal for check-in at the time specified by the ferry operator, typically 30-90 minutes before departure. Late arrival may result in denied boarding with no refund.
                                </p>
                            </div>
                        </div>

                        {/* User Conduct */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">4. User Conduct</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    When using our ferry booking platform, you agree not to:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-base text-gray-700">
                                    <li>Book ferry tickets for illegal purposes or in violation of maritime or immigration laws</li>
                                    <li>Use fraudulent payment methods or falsify passenger information</li>
                                    <li>Attempt to manipulate pricing, availability, or booking systems</li>
                                    <li>Resell ferry tickets without authorization from the ferry operator</li>
                                    <li>Make multiple speculative bookings that you do not intend to use</li>
                                    <li>Interfere with other users' ability to access our ferry booking services</li>
                                </ul>
                            </div>
                        </div>

                        {/* Limitation of Liability */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">5. Limitation of Liability</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    5.1 SailMate is a ticketing platform and is not liable for the actions, omissions, or service quality of ferry operators, including delays, cancellations, accidents, or personal injury during ferry travel.
                                </p>
                                <p>
                                    5.2 We strive to provide accurate ferry information but cannot guarantee the complete accuracy of all schedules, amenities, or services described on our platform, as these are provided by the ferry operators.
                                </p>
                                <p>
                                    5.3 Our total liability for any booking issue within our direct control (such as payment processing errors) shall not exceed the booking fee paid to SailMate for the affected ferry ticket.
                                </p>
                            </div>
                        </div>

                        {/* Disclaimer of Warranties */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">6. Disclaimer of Warranties</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p className="font-medium">
                                    THE SAILMATE FERRY BOOKING PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, REGARDING THE ACCURACY OF FERRY INFORMATION, TICKET AVAILABILITY, OR PLATFORM FUNCTIONALITY.
                                </p>
                                <p>
                                    We do not guarantee that our ferry booking platform will be uninterrupted, error-free, or that all ferry services will operate exactly as described. Weather conditions, technical issues, or operational decisions by ferry companies may affect your booked journey. Always check with the ferry operator directly before travel for the most current information.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Contact Information */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600">
                        Still have questions?{" "}
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

export default BookingConditions;
