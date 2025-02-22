import React from "react";
import "../assets/styles/termsofservice.css";

const BookingConditions = () => {
    return (
        <div className="privacy-container">
            <nav className="nav-bar">
                <a href="/" className="home-link">Back to Home</a>
            </nav>
            <div className="privacy-content">
                <div className="policy-box">
                    <h2>Sail Mate Terms of Service</h2>
                    <p>
                        This site (the 'Site') compares prices and timetables for ferry and train journeys and allows you to book journeys.
                        The Site is owned and operated by Sail Mate Limited (referred to in these Booking Conditions as 'we', 'us' or the 'Company').
                    </p>

                    <h3>1. Application</h3>
                    <p>
                        These Booking Conditions apply to all passenger bookings made for ferry and train journeys, through this Site or our call centres,
                        and replace all previous conditions. In these Booking Conditions: 'You' means the person making the booking; 'Customer' means each of the
                        people for whom the booking is made; 'Services' means the services offered by us, including ferry and train journey searches, price comparisons, and booking services.
                    </p>

                    <h3>2. Parties</h3>
                    <p>
                        We do not operate any ferry or train services directly. These services are provided by ferry and train operators ('Operator(s)').
                        We act as a booking platform that enables you to search and book ferry and train journeys provided by Operators.
                    </p>

                    <h3>3. Fares and General Information</h3>
                    <p>
                        Fares depend on vehicle type, passenger count, routes, and travel dates/times. Space and promotional fares are subject to availability and conditions.
                        Additional charges may apply for special accommodations or changes to bookings.
                    </p>

                    <h3>4. Departure Schedules</h3>
                    <p>
                        Departure/arrival times are estimates provided by the Operator and may be subject to change due to weather, operational, or technical reasons.
                    </p>

                    <h3>5. Animals</h3>
                    <p>
                        Carriage of animals is only permitted if notified before booking and must comply with legal and Operator requirements. Additional fees may apply.
                    </p>

                    <h3>6. Confirmation and Payment</h3>
                    <p>
                        Full payment is required at the time of booking unless a credit account has been established. Payment can be made via credit or debit card.
                        A confirmation advice note will be issued upon successful booking.
                    </p>

                    <h3>7. Cancellation and Amendments</h3>
                    <p>
                        Cancellations and amendments are subject to the Operator's terms. Fees may apply for modifications, and certain bookings may be non-refundable.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingConditions;
