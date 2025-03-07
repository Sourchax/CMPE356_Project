import React from "react";
import { useNavigate } from "react-router-dom";

const Accessibility = () => {
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 12a2 2 0 110-4 2 2 0 010 4zm7-1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM10 14a2 2 0 110-4 2 2 0 010 4zm7-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-10 3a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="mb-3 text-5xl font-bold text-[#0D3A73]">Accessibility</h1>
                    <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#F0C808]"></div>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        We're committed to making ferry travel accessible to everyone. Learn about our accommodations and how we ensure a comfortable journey for passengers of all abilities.
                    </p>
                    <div className="mt-3 text-sm text-gray-500">Last Updated: March 2025</div>
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-2xl p-10 shadow-lg">
                    <div className="mb-12 space-y-10">
                        {/* Introduction */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">Our Accessibility Commitment</h2>
                            <p className="text-base text-gray-700 leading-relaxed">
                                At SailMate, we believe that the open waters should be accessible to everyone. We're dedicated to providing an inclusive ferry travel experience that accommodates the diverse needs of all our passengers. Our accessibility initiatives span our vessels, terminals, digital platforms, and customer service to ensure that everyone can enjoy comfortable and dignified maritime travel experiences.
                            </p>
                        </div>

                        {/* Vessel Accessibility */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">1. Vessel Accessibility</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    1.1 <span className="font-semibold text-[#06AED5]">Accessible Ferry Design:</span> Our ferries are equipped with accessible entrances, ramps, and elevators between decks on all large vessels to ensure mobility throughout the journey.
                                </p>
                                <p>
                                    1.2 <span className="font-semibold text-[#06AED5]">Dedicated Seating Areas:</span> We provide dedicated accessible seating areas with panoramic views and proximity to amenities, ensuring comfort without compromising the sea experience.
                                </p>
                                <p>
                                    1.3 <span className="font-semibold text-[#06AED5]">Accessible Facilities:</span> All our vessels feature accessible restrooms on every deck, wheelchair-friendly pathways, and accommodations for service animals.
                                </p>
                                <p>
                                    1.4 <span className="font-semibold text-[#06AED5]">Priority Services:</span> We offer priority boarding and disembarkation for passengers with mobility requirements to ensure a smooth embarkation and debarkation process.
                                </p>
                            </div>
                        </div>

                        {/* Terminal Accessibility */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">2. Terminal Accessibility</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    2.1 <span className="font-semibold text-[#06AED5]">Harbor Access:</span> All our ferry terminals feature step-free access throughout customer areas, with accessible paths from parking areas to boarding points.
                                </p>
                                <p>
                                    2.2 <span className="font-semibold text-[#06AED5]">Check-in Services:</span> Wheelchair-accessible check-in counters at a lower height are available at all locations, ensuring comfortable interaction with our staff.
                                </p>
                                <p>
                                    2.3 <span className="font-semibold text-[#06AED5]">Navigation Assistance:</span> Our terminals include tactile paving for visually impaired travelers, along with clear signage and announcement systems in both visual and audio formats.
                                </p>
                                <p>
                                    2.4 <span className="font-semibold text-[#06AED5]">Priority Facilities:</span> Designated accessible parking spaces are available close to terminal entrances, minimizing travel distance to our vessels.
                                </p>
                            </div>
                        </div>

                        {/* Digital Accessibility */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">3. Digital Accessibility</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    3.1 <span className="font-semibold text-[#06AED5]">Website Standards:</span> The SailMate website is designed to WCAG 2.1 AA compliance standards, ensuring that our digital journey is as accessible as our physical one.
                                </p>
                                <p>
                                    3.2 <span className="font-semibold text-[#06AED5]">Booking Accessibility:</span> Our booking engine includes keyboard navigation for all features, screen reader compatibility, and accessible forms with clear labels.
                                </p>
                                <p>
                                    3.3 <span className="font-semibold text-[#06AED5]">Adaptable Interface:</span> Users can adjust text sizing and access high contrast options to customize their digital experience to their visual needs.
                                </p>
                                <p>
                                    3.4 <span className="font-semibold text-[#06AED5]">Simplified Process:</span> We've created a streamlined booking process that allows passengers to indicate accessibility requirements and request specific accommodations during their reservation.
                                </p>
                            </div>
                        </div>

                        {/* Staff Training and Assistance */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">4. Staff Training and Assistance</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    4.1 <span className="font-semibold text-[#06AED5]">Crew Training:</span> All SailMate crew members receive comprehensive training in disability awareness and how to assist passengers with various needs throughout their maritime journey.
                                </p>
                                <p>
                                    4.2 <span className="font-semibold text-[#06AED5]">Embarkation Support:</span> Dedicated staff are available to assist with boarding and disembarkation procedures, including the operation of accessibility equipment.
                                </p>
                                <p>
                                    4.3 <span className="font-semibold text-[#06AED5]">Journey Assistance:</span> Throughout your voyage, crew members are available to provide assistance with accessing facilities, moving between decks, and addressing any accessibility concerns.
                                </p>
                                <p>
                                    4.4 <span className="font-semibold text-[#06AED5]">Communication Support:</span> Staff are trained to communicate effectively with passengers who have hearing impairments, including basic sign language and use of written communication when needed.
                                </p>
                            </div>
                        </div>

                        {/* Special Accommodations */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">5. Special Accommodations</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    SailMate offers the following special accommodations:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-base text-gray-700">
                                    <li>Complimentary tickets for personal care assistants traveling with passengers who require assistance</li>
                                    <li>No additional charges for registered service animals</li>
                                    <li>Priority vehicle loading for vehicles with accessibility equipment</li>
                                    <li>Information available in alternative formats (large print, Braille) upon request</li>
                                    <li>Ability to remain in your vehicle during shorter crossings if mobility challenges make moving to passenger areas difficult</li>
                                    <li>Specialized maritime evacuation procedures for passengers with disabilities</li>
                                </ul>
                            </div>
                        </div>

                        {/* Planning Your Accessible Journey */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">6. Planning Your Accessible Voyage</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p className="font-medium">
                                    We recommend taking the following steps to ensure your maritime journey is as smooth as possible:
                                </p>
                                <p>
                                    <span className="font-semibold text-[#06AED5]">Before Booking:</span> Review our accessibility options or contact our maritime accessibility team at least 48 hours before travel to discuss specific requirements for your voyage.
                                </p>
                                <p>
                                    <span className="font-semibold text-[#06AED5]">During Booking:</span> Select relevant accessibility options during the reservation process and provide details about any special accommodations you may need for your journey at sea.
                                </p>
                                <p>
                                    <span className="font-semibold text-[#06AED5]">Pre-Departure:</span> Arrive at the terminal at least 60 minutes before scheduled departure to allow time for priority boarding and any necessary assistance with embarking the vessel.
                                </p>
                                <p>
                                    <span className="font-semibold text-[#06AED5]">During Your Voyage:</span> Don't hesitate to approach any crew member with questions or requests for assistance – our maritime staff are trained to ensure your journey is comfortable.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Contact Information */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600">
                        Need more information about our accessibility services?{" "}
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

export default Accessibility; 