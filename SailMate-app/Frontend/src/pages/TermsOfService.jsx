import React from "react";
import { Link } from "react-router-dom";

const BookingConditions = () => {
    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Main content container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                {/* Header with Gradient Accent */}
                <div className="relative mb-12 sm:mb-16">
                    <div className="absolute inset-0 bg-blue-600 opacity-5 rounded-xl"></div>
                    <div className="relative">
                        <div className="flex flex-col items-center text-center space-y-4 py-8">
                            <div className="w-16 h-16 bg-blue-600 bg-opacity-10 rounded-full flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800">Terms of Service</h1>
                            <p className="text-gray-600 max-w-2xl text-sm sm:text-base md:text-lg">
                                Please read these terms carefully before using SailMate's ferry booking services.
                                By using our services, you agree to be bound by these terms.
                            </p>
                            <div className="text-sm text-gray-500 pt-2">Last Updated: March 2025</div>
                        </div>
                    </div>
                </div>
                
                {/* Main Content Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    {/* Content Section */}
                    <div className="p-6 sm:p-8 md:p-10">
                        {/* Introduction */}
                        <div className="prose prose-blue max-w-none mb-12">
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                                This site (the 'Site') compares prices and timetables for ferry and train journeys and allows you to book journeys.
                                The Site is owned and operated by SailMate Limited (referred to in these Terms of Service as 'we', 'us' or the 'Company').
                                These Terms of Service constitute a legally binding agreement between you and SailMate regarding your use of our services.
                            </p>
                        </div>

                        {/* Terms Sections */}
                        <div className="space-y-10">
                            {/* Section 1 */}
                            <section className="relative">
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-full"></div>
                                <div className="pl-6">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                                        1. Application
                                    </h2>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                            These Terms of Service apply to all passenger bookings made for ferry and train journeys, through this Site or our call centers,
                                            and replace all previous conditions. In these Terms:
                                        </p>
                                        <ul className="mt-4 space-y-2 text-gray-700 text-sm sm:text-base pl-5 list-disc">
                                            <li>'You' means the person making the booking;</li>
                                            <li>'Customer' means each of the people for whom the booking is made;</li>
                                            <li>'Services' means the services offered by us, including ferry and train journey searches, price comparisons, and booking services.</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section className="relative">
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-full"></div>
                                <div className="pl-6">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                                        2. Parties
                                    </h2>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                            We do not operate any ferry or train services directly. These services are provided by ferry and train operators ('Operator(s)'). 
                                            We act as a booking platform that enables you to search and book ferry and train journeys provided by Operators.
                                        </p>
                                        <div className="mt-4 flex items-center p-4 bg-blue-50 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-sm text-blue-800">
                                                When you complete a booking, you enter into a contract with the Operator, not with SailMate.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section className="relative">
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-full"></div>
                                <div className="pl-6">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                                        3. Fares and General Information
                                    </h2>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                                            Fares depend on vehicle type, passenger count, routes, and travel dates/times. Space and promotional fares are subject to availability and conditions.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                                                <h3 className="font-semibold text-blue-700 mb-2 text-base">Fare Variations</h3>
                                                <p className="text-gray-600 text-sm">Prices may vary based on demand, seasonality, and promotional periods.</p>
                                            </div>
                                            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                                                <h3 className="font-semibold text-blue-700 mb-2 text-base">Additional Charges</h3>
                                                <p className="text-gray-600 text-sm">Extra fees may apply for special accommodations, changes, or premium services.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section className="relative">
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-full"></div>
                                <div className="pl-6">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                                        4. Departure Schedules
                                    </h2>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                            Departure and arrival times are estimates provided by the Operator and may be subject to change due to weather, operational, or technical reasons.
                                            We will make reasonable efforts to inform you of any significant changes to your booked journey.
                                        </p>
                                        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-yellow-700">
                                                        It is recommended that you check your journey details 24 hours before departure for any schedule changes.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5 */}
                            <section className="relative">
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-full"></div>
                                <div className="pl-6">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                                        5. Animals
                                    </h2>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                            Carriage of animals is only permitted if notified before booking and must comply with legal and Operator requirements. 
                                            Additional fees may apply. Different operators have different policies regarding pets and service animals.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 6 */}
                            <section className="relative">
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-full"></div>
                                <div className="pl-6">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                                        6. Confirmation and Payment
                                    </h2>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                                            Full payment is required at the time of booking unless a credit account has been established. 
                                            Payment can be made via credit or debit card. A confirmation advice note will be issued upon successful booking.
                                        </p>
                                        <div className="flex items-center p-4 bg-green-50 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-sm text-green-800">
                                                Always verify that you have received a booking confirmation before traveling. This serves as proof of your booking.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7 */}
                            <section className="relative">
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-full"></div>
                                <div className="pl-6">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                                        7. Cancellation and Amendments
                                    </h2>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                                            Cancellations and amendments are subject to the Operator's terms. Fees may apply for modifications, and certain bookings may be non-refundable.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                                                <h3 className="font-semibold text-blue-700 mb-2 text-base">Cancellations</h3>
                                                <p className="text-gray-600 text-sm">Cancellation policies vary by operator. Some tickets may be fully refundable, while others may incur fees or be non-refundable.</p>
                                            </div>
                                            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                                                <h3 className="font-semibold text-blue-700 mb-2 text-base">Amendments</h3>
                                                <p className="text-gray-600 text-sm">Changes to bookings may incur administrative fees in addition to any fare differences between your original and new booking.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer and Links */}
                        <div className="mt-12 pt-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-center">
                                <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-0">
                                    By using SailMate, you acknowledge that you have read and understood these Terms of Service.
                                </p>
                                <div className="flex space-x-6">
                                    <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">Privacy</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConditions;
