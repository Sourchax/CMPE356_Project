import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800">Privacy Policy</h1>
                            <p className="text-gray-600 max-w-2xl text-sm sm:text-base md:text-lg">
                                At SailMate, we value your privacy and are committed to minimal data collection.
                                We only collect what's necessary to provide our ferry booking services.
                            </p>
                            <div className="text-sm text-gray-500 pt-2">Last Updated: March 2023</div>
                            <a href="mailto:privacy@sailmate.com" className="mt-2 text-blue-600 hover:text-blue-800 inline-flex items-center gap-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                Contact our Privacy Team
                            </a>
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
                                This Privacy Policy explains how SailMate collects, uses, and discloses information about you when you use our services.
                                We respect your privacy and only collect minimal data necessary to provide our ferry booking services. 
                                We do not collect passwords or any special categories of personal data.
                                We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top
                                of the policy.
                            </p>
                        </div>

                        {/* Privacy Highlights Box */}
                        <div className="bg-green-50 p-5 rounded-lg mb-10 border-l-4 border-green-500">
                            <h3 className="text-lg font-semibold text-green-800 mb-3">Our Privacy Commitments</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">We collect only the minimum data needed to provide our services</span>
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">We never collect sensitive information or passwords</span>
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">We use secure authentication methods that don't require us to store your password</span>
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">We delete your data when it's no longer needed</span>
                                </li>
                            </ul>
                        </div>

                        {/* Policy Sections */}
                        <div className="space-y-10">
                            {/* Section 1 */}
                            <section className="relative">
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-full"></div>
                                <div className="pl-6">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                                        Information We Collect
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-gray-700 text-sm sm:text-base">We only collect information that's necessary for your ferry bookings:</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gray-50 p-5 rounded-lg">
                                                <h3 className="font-semibold text-blue-700 mb-3 text-base sm:text-lg">Account Information</h3>
                                                <p className="text-gray-600 text-sm sm:text-base">Name, email address, and phone number to identify your booking. We do not store your password.</p>
                                            </div>
                                            <div className="bg-gray-50 p-5 rounded-lg">
                                                <h3 className="font-semibold text-blue-700 mb-3 text-base sm:text-lg">Booking Information</h3>
                                                <p className="text-gray-600 text-sm sm:text-base">Travel dates, routes, and number of passengers needed to complete your booking.</p>
                                            </div>
                                            <div className="bg-gray-50 p-5 rounded-lg">
                                                <h3 className="font-semibold text-blue-700 mb-3 text-base sm:text-lg">Payment Processing</h3>
                                                <p className="text-gray-600 text-sm sm:text-base">We use secure third-party payment processors and do not store your complete payment details on our servers.</p>
                                            </div>
                                            <div className="bg-gray-50 p-5 rounded-lg">
                                                <h3 className="font-semibold text-blue-700 mb-3 text-base sm:text-lg">Basic Device Information</h3>
                                                <p className="text-gray-600 text-sm sm:text-base">Browser type and IP address for security and service improvement purposes.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section className="relative">
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-full"></div>
                                <div className="pl-6">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                                        How We Use Your Information
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-gray-700 text-sm sm:text-base">We use your information only for the following essential purposes:</p>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <li className="flex items-start bg-gray-50 p-4 rounded-lg">
                                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-700 text-sm sm:text-base">Processing and managing your ferry bookings</span>
                                            </li>
                                            <li className="flex items-start bg-gray-50 p-4 rounded-lg">
                                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-700 text-sm sm:text-base">Providing customer support for your bookings</span>
                                            </li>
                                            <li className="flex items-start bg-gray-50 p-4 rounded-lg">
                                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-700 text-sm sm:text-base">Sending essential booking confirmations and trip information</span>
                                            </li>
                                            <li className="flex items-start bg-gray-50 p-4 rounded-lg">
                                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-700 text-sm sm:text-base">Ensuring security and preventing fraud</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section className="relative">
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-full"></div>
                                <div className="pl-6">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                                        Information Sharing
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-gray-700 text-sm sm:text-base">We share your information only when absolutely necessary:</p>
                                        <div className="bg-blue-50 p-6 rounded-lg">
                                            <ul className="space-y-4">
                                                <li className="flex items-start">
                                                    <div className="flex-shrink-0 text-blue-600 font-bold mr-3">•</div>
                                                    <div>
                                                        <span className="font-semibold text-blue-800">Ferry Operators:</span>
                                                        <span className="text-gray-700 text-sm sm:text-base ml-2">Only booking details necessary to provide your ferry service.</span>
                                                    </div>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="flex-shrink-0 text-blue-600 font-bold mr-3">•</div>
                                                    <div>
                                                        <span className="font-semibold text-blue-800">Payment Processors:</span>
                                                        <span className="text-gray-700 text-sm sm:text-base ml-2">For secure payment processing only.</span>
                                                    </div>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="flex-shrink-0 text-blue-600 font-bold mr-3">•</div>
                                                    <div>
                                                        <span className="font-semibold text-blue-800">Service Providers:</span>
                                                        <span className="text-gray-700 text-sm sm:text-base ml-2">Limited data for essential services like customer support.</span>
                                                    </div>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="flex-shrink-0 text-blue-600 font-bold mr-3">•</div>
                                                    <div>
                                                        <span className="font-semibold text-blue-800">Legal Requirements:</span>
                                                        <span className="text-gray-700 text-sm sm:text-base ml-2">Only when legally required, and limited to what is necessary.</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section className="relative">
                                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 rounded-full"></div>
                                <div className="pl-6">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                                        Your Rights
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-gray-700 text-sm sm:text-base">As a SailMate user, you have the right to:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-lg">
                                                <div className="flex items-center mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="font-semibold text-blue-800">Access</h3>
                                                </div>
                                                <p className="text-gray-600 text-sm">Request a copy of your personal information we hold.</p>
                                            </div>
                                            <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-lg">
                                                <div className="flex items-center mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="font-semibold text-blue-800">Correct</h3>
                                                </div>
                                                <p className="text-gray-600 text-sm">Update or correct your information at any time.</p>
                                            </div>
                                            <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-lg">
                                                <div className="flex items-center mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="font-semibold text-blue-800">Delete</h3>
                                                </div>
                                                <p className="text-gray-600 text-sm">Request deletion of your account and data.</p>
                                            </div>
                                            <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-lg">
                                                <div className="flex items-center mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="font-semibold text-blue-800">Opt-out</h3>
                                                </div>
                                                <p className="text-gray-600 text-sm">Unsubscribe from any optional communications.</p>
                                            </div>
                                            <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-lg">
                                                <div className="flex items-center mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="font-semibold text-blue-800">Ask Questions</h3>
                                                </div>
                                                <p className="text-gray-600 text-sm">Contact us about our privacy practices anytime.</p>
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
                                        Data Security
                                    </h2>
                                    <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-lg">
                                        <p className="text-gray-700 text-sm sm:text-base">
                                            We implement strong security measures to protect your personal information. We use secure authentication 
                                            methods that don't require storing your actual password, encryption for data transfer, and regular 
                                            security audits to ensure your data remains safe.
                                        </p>
                                        <div className="mt-4 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-blue-800 font-medium text-sm">Your privacy is our priority</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer and Links */}
                        <div className="mt-12 pt-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-center">
                                <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-0">
                                    By using SailMate, you acknowledge that you have read and understood this Privacy Policy.
                                </p>
                                <div className="flex space-x-6 items-center">
                                    <Link to="/terms" className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">Terms</Link>
                                    <a href="mailto:privacy@sailmate.com" className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        Contact
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
