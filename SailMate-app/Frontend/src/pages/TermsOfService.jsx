import React from "react";
import { Link } from "react-router-dom";

const BookingConditions = () => {
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
                        Sail Mate Terms of Service
                    </h2>
                    <p className="text-base leading-relaxed mb-4">
                        This site (the 'Site') compares prices and timetables for ferry and train journeys and allows you to book journeys.
                        The Site is owned and operated by Sail Mate Limited (referred to in these Booking Conditions as 'we', 'us' or the 'Company').
                    </p>

                    <h3 className="text-xl font-semibold text-[#0D3A73] mt-6">
                        1. Application
                    </h3>
                    <p className="text-base leading-relaxed mb-4">
                        These Booking Conditions apply to all passenger bookings made for ferry and train journeys, through this Site or our call centres,
                        and replace all previous conditions. In these Booking Conditions: 'You' means the person making the booking; 'Customer' means each of the
                        people for whom the booking is made; 'Services' means the services offered by us, including ferry and train journey searches, price comparisons, and booking services.
                    </p>

                    <h3 className="text-xl font-semibold text-[#0D3A73] mt-6">
                        2. Parties
                    </h3>
                    <p className="text-base leading-relaxed mb-4">
                        We do not operate any ferry or train services directly. These services are provided by ferry and train operators ('Operator(s)'). We act as a booking platform that enables you to search and book ferry and train journeys provided by Operators.
                    </p>

                    <h3 className="text-xl font-semibold text-[#0D3A73] mt-6">
                        3. Fares and General Information
                    </h3>
                    <p className="text-base leading-relaxed mb-4">
                        Fares depend on vehicle type, passenger count, routes, and travel dates/times. Space and promotional fares are subject to availability and conditions. Additional charges may apply for special accommodations or changes to bookings.
                    </p>

                    <h3 className="text-xl font-semibold text-[#0D3A73] mt-6">
                        4. Departure Schedules
                    </h3>
                    <p className="text-base leading-relaxed mb-4">
                        Departure/arrival times are estimates provided by the Operator and may be subject to change due to weather, operational, or technical reasons.
                    </p>

                    <h3 className="text-xl font-semibold text-[#0D3A73] mt-6">
                        5. Animals
                    </h3>
                    <p className="text-base leading-relaxed mb-4">
                        Carriage of animals is only permitted if notified before booking and must comply with legal and Operator requirements. Additional fees may apply.
                    </p>

                    <h3 className="text-xl font-semibold text-[#0D3A73] mt-6">
                        6. Confirmation and Payment
                    </h3>
                    <p className="text-base leading-relaxed mb-4">
                        Full payment is required at the time of booking unless a credit account has been established. Payment can be made via credit or debit card. A confirmation advice note will be issued upon successful booking.
                    </p>

                    <h3 className="text-xl font-semibold text-[#0D3A73] mt-6">
                        7. Cancellation and Amendments
                    </h3>
                    <p className="text-base leading-relaxed mb-4">
                        Cancellations and amendments are subject to the Operator's terms. Fees may apply for modifications, and certain bookings may be non-refundable.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingConditions;
