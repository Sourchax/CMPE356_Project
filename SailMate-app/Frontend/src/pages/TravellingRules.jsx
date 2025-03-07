import React from "react";
import { useNavigate } from "react-router-dom";

const TravellingRules = () => {
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
                                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 15h2v2h-2zm0-10h2v8h-2z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="mb-3 text-5xl font-bold text-[#0D3A73]">Onboard Rules</h1>
                    <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#F0C808]"></div>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        Our vessel rules and regulations are designed to ensure a safe and pleasant maritime experience for all passengers. Please familiarize yourself with these guidelines before embarking on your journey.
                    </p>
                    <div className="mt-3 text-sm text-gray-500">Last Updated: March 2025</div>
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-2xl p-10 shadow-lg">
                    <div className="mb-12 space-y-10">
                        {/* Introduction */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">Maritime Safety and Conduct</h2>
                            <p className="text-base text-gray-700 leading-relaxed">
                                At SailMate, the safety of our passengers and crew is our highest priority. These onboard rules have been established in accordance with maritime regulations and industry best practices. Compliance with these guidelines is mandatory for all passengers to ensure a secure and comfortable voyage for everyone aboard our vessels.
                            </p>
                        </div>

                        {/* Boarding and Embarkation */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">1. Boarding and Embarkation</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    1.1 <span className="font-semibold text-[#06AED5]">Arrival Times:</span> Foot passengers must arrive at the terminal at least 45 minutes before scheduled departure. Passengers with vehicles must arrive 90 minutes prior to allow for proper loading sequences and vessel stability calculations.
                                </p>
                                <p>
                                    1.2 <span className="font-semibold text-[#06AED5]">Documentation:</span> All passengers must present valid identification and boarding documentation at check-in. Electronic tickets displayed on mobile devices are acceptable provided the QR code is clearly visible and scannable.
                                </p>
                                <p>
                                    1.3 <span className="font-semibold text-[#06AED5]">Boarding Procedures:</span> Passengers must follow crew instructions during boarding and disembarkation. Our structured boarding process ensures vessel stability and passenger safety during these critical operations.
                                </p>
                                <p>
                                    1.4 <span className="font-semibold text-[#06AED5]">Late Arrivals:</span> For safety and operational reasons, boarding closes 15 minutes before departure. Late arrivals may be denied boarding without refund as vessels must maintain strict departure schedules to ensure navigational safety.
                                </p>
                            </div>
                        </div>

                        {/* Onboard Safety */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">2. Onboard Safety</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    2.1 <span className="font-semibold text-[#06AED5]">Safety Briefings:</span> All passengers must attend or be aware of safety briefings provided at the beginning of the voyage. These include information on life jacket locations, emergency exits, and muster stations.
                                </p>
                                <p>
                                    2.2 <span className="font-semibold text-[#06AED5]">Movement During Voyage:</span> Passengers should remain seated when the vessel is navigating rough waters. When moving about the vessel, maintain three points of contact on staircases and hold handrails to prevent falls during unexpected wave action.
                                </p>
                                <p>
                                    2.3 <span className="font-semibold text-[#06AED5]">Emergency Procedures:</span> In case of emergency, follow crew instructions immediately and proceed to your designated muster station. Do not return to cabins or vehicle decks to retrieve belongings when emergency alarms are activated.
                                </p>
                                <p>
                                    2.4 <span className="font-semibold text-[#06AED5]">Restricted Areas:</span> Engine rooms, bridge, crew quarters, and operational areas are strictly off-limits to passengers. These restrictions are enforced for both safety and security reasons in accordance with maritime regulations.
                                </p>
                            </div>
                        </div>

                        {/* Prohibited Items */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">3. Prohibited Items</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    The following items are prohibited on SailMate vessels in accordance with maritime safety regulations:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-base text-gray-700">
                                    <li>Hazardous materials including flammable liquids, gases, or solids that may compromise vessel safety</li>
                                    <li>Explosives, fireworks, or pyrotechnic devices of any kind</li>
                                    <li>Weapons including firearms, ammunition, knives with blades exceeding 6cm, or any item designed for causing injury</li>
                                    <li>Compressed gases in cylinders except essential medical equipment or small camping cylinders stored in vehicles</li>
                                    <li>Illegal substances or narcotics</li>
                                    <li>Excessively large or heavy items that may compromise vessel stability or evacuation procedures</li>
                                </ul>
                                <p>
                                    3.1 <span className="font-semibold text-[#06AED5]">Vehicle Restrictions:</span> Vehicles with fuel leaks or other mechanical issues that pose a hazard will not be permitted to board. Electric vehicles must have sufficient charge to disembark without assistance.
                                </p>
                                <p>
                                    3.2 <span className="font-semibold text-[#06AED5]">Confiscation:</span> Prohibited items may be confiscated prior to boarding or during the voyage if discovered. Items may be returned upon disembarkation or surrendered to proper authorities as required by law.
                                </p>
                            </div>
                        </div>

                        {/* Passenger Conduct */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">4. Passenger Conduct</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    4.1 <span className="font-semibold text-[#06AED5]">General Behavior:</span> Passengers must conduct themselves in a manner that does not interfere with the comfort or safety of others. Abusive language, threatening behavior, or actions that disrupt vessel operations are prohibited.
                                </p>
                                <p>
                                    4.2 <span className="font-semibold text-[#06AED5]">Smoking Regulations:</span> Smoking, including e-cigarettes, is permitted only in designated outdoor areas clearly marked on vessel decks. Smoking in cabins, enclosed spaces, or unmarked areas is strictly prohibited and may trigger fire detection systems.
                                </p>
                                <p>
                                    4.3 <span className="font-semibold text-[#06AED5]">Alcohol Consumption:</span> Alcoholic beverages may only be consumed if purchased from onboard facilities. Excessive consumption leading to disruptive behavior will result in beverage service restrictions and possible intervention by security personnel.
                                </p>
                                <p>
                                    4.4 <span className="font-semibold text-[#06AED5]">Child Supervision:</span> Children under 12 must be supervised by an adult at all times. Children are not permitted on open decks without adult supervision regardless of weather conditions due to unpredictable sea states.
                                </p>
                            </div>
                        </div>

                        {/* Luggage and Personal Items */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">5. Luggage and Personal Items</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    5.1 <span className="font-semibold text-[#06AED5]">Luggage Allowance:</span> Each passenger is permitted one carry-on bag not exceeding 10kg and dimensions of 55cm x 40cm x 20cm. Additional luggage must be checked and stowed in designated baggage areas.
                                </p>
                                <p>
                                    5.2 <span className="font-semibold text-[#06AED5]">Baggage Security:</span> Passengers are responsible for their personal belongings at all times. SailMate is not liable for lost, damaged, or stolen items. Unattended items may be collected by crew and may be subject to security inspection.
                                </p>
                                <p>
                                    5.3 <span className="font-semibold text-[#06AED5]">Valuable Items:</span> Valuables should be kept on your person rather than in checked luggage. Safe deposit facilities are available on longer voyages for particularly valuable items.
                                </p>
                                <p>
                                    5.4 <span className="font-semibold text-[#06AED5]">Deck Storage:</span> Personal items must not obstruct aisles, emergency exits, or public walkways. Items found blocking these areas will be relocated by crew members without notification.
                                </p>
                            </div>
                        </div>

                        {/* Environmental Responsibility */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">6. Environmental Responsibility</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    6.1 <span className="font-semibold text-[#06AED5]">Waste Management:</span> All waste must be disposed of in appropriate receptacles. Separate containers are provided for recyclable materials, food waste, and general trash in accordance with maritime environmental regulations.
                                </p>
                                <p>
                                    6.2 <span className="font-semibold text-[#06AED5]">Marine Protection:</span> Disposing of any item overboard is strictly prohibited and may result in significant fines. This includes seemingly harmless items such as food waste, cigarette butts, or paper products.
                                </p>
                                <p>
                                    6.3 <span className="font-semibold text-[#06AED5]">Wildlife Observation:</span> Maintaining appropriate distances from marine wildlife encountered during the voyage is essential. Do not attempt to feed seabirds from outdoor decks as this disrupts natural feeding patterns.
                                </p>
                                <p>
                                    6.4 <span className="font-semibold text-[#06AED5]">Resource Conservation:</span> Passengers are encouraged to conserve water and electricity during the voyage. Please turn off lights when leaving cabins and report any water leaks to crew members promptly.
                                </p>
                            </div>
                        </div>

                        {/* Health and Emergency Procedures */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">7. Health and Emergency Procedures</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p className="font-medium">
                                    Passengers must adhere to the following health and emergency guidelines while aboard:
                                </p>
                                <p>
                                    <span className="font-semibold text-[#06AED5]">Medical Assistance:</span> Report any medical emergencies to crew members immediately. All vessels are equipped with first aid facilities and staff trained in emergency medical response appropriate for maritime environments.
                                </p>
                                <p>
                                    <span className="font-semibold text-[#06AED5]">Seasickness:</span> If you experience motion sickness, remain seated in the center of the vessel where movement is minimized. Anti-seasickness medication is available from the purser's office. Remain hydrated and avoid alcohol if prone to seasickness.
                                </p>
                                <p>
                                    <span className="font-semibold text-[#06AED5]">Evacuation Procedures:</span> In the unlikely event of an evacuation, life jackets will be distributed if not already at your seating position. Proceed calmly to your designated muster station following illuminated pathways and crew instructions.
                                </p>
                                <p>
                                    <span className="font-semibold text-[#06AED5]">Weather Events:</span> During adverse weather, secure loose items and remain seated when advised by crew. Outdoor deck access may be restricted during high winds or heavy seas for passenger safety.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Contact Information */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600">
                        Questions about our onboard rules?{" "}
                        <span 
                            onClick={navigateToContact} 
                            className="text-[#0D3A73] font-medium hover:text-[#06AED5] underline cursor-pointer transition-colors duration-300"
                        >
                            Contact our maritime safety team
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TravellingRules; 