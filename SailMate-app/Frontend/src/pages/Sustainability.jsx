import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SustainabilityFeature = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#06AED5] text-white">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-[#06AED5]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const SustainabilityDetail = ({ title, content, isDefaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
      <button
        className={`flex w-full items-center justify-between px-6 py-4 text-left font-medium transition-all duration-300 ${
          isOpen 
            ? 'bg-[#0D3A73] text-white' 
            : 'bg-white text-[#0D3A73] hover:bg-[#F0C808]/10'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-lg">{title}</span>
        <svg
          className={`h-6 w-6 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`transform overflow-hidden bg-white px-6 transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'max-h-[1000px] opacity-100 py-5' 
            : 'max-h-0 opacity-0 py-0'
        }`}
      >
        {content}
      </div>
    </div>
  );
};

const Sustainability = () => {
  const navigate = useNavigate();
  
  const navigateToContact = () => {
    navigate("/contact");
  };

  return (
    <div className="bg-gradient-to-br from-white via-[#D1FFD7]/50 to-[#D1FFD7] py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-3 text-5xl font-bold text-[#0D3A73]">Our Commitment to Sustainability</h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#F0C808]"></div>
          <p className="mt-6 text-lg text-gray-600">
            SailMate is dedicated to environmentally responsible ferry travel and reducing our carbon footprint.
          </p>
        </div>

        <div className="mb-12 space-y-5">
          <div className="grid gap-6 md:grid-cols-3">
            <SustainabilityFeature 
              title="Eco-Friendly Vessels" 
              description="Lower emissions and fuel-efficient technology"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
              }
            />
            
            <SustainabilityFeature 
              title="Waste Reduction" 
              description="Minimizing plastic and implementing recycling"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            />
            
            <SustainabilityFeature 
              title="Carbon Offset" 
              description="Projects to balance our environmental impact"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
            />
          </div>
        </div>

        <div className="mb-12 p-6 bg-white rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-[#0D3A73] mb-6">Our Vision for Sustainable Ferry Travel</h2>
          <p className="text-gray-700 mb-4">
            As a new company founded in 2025, SailMate was built with sustainability at our core. We recognize the critical importance of protecting our oceans and marine environments while providing essential transportation services.
          </p>
          <p className="text-gray-700 mb-4">
            Our goal is to become the most environmentally responsible ferry service in the industry by 2030, setting new standards for sustainable maritime travel from the very beginning of our operations.
          </p>
          <p className="text-gray-700">
            Rather than retrofitting older vessels or adapting existing systems, we're starting fresh with innovative technologies, sustainable practices, and forward-thinking partnerships that minimize environmental impact while enhancing the travel experience.
          </p>
        </div>

        <div className="divide-y divide-gray-200 rounded-xl bg-white p-1 shadow-xl">
          <SustainabilityDetail
            title="Fleet Sustainability Initiatives"
            content={
              <div className="space-y-4">
                <p className="text-gray-700">Our commitment to eco-friendly vessels includes:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Investing in hybrid-electric propulsion systems that reduce fuel consumption by up to 30%</li>
                  <li>Implementing hull optimization technology to reduce water resistance and improve fuel efficiency</li>
                  <li>Installing exhaust gas cleaning systems (scrubbers) to reduce sulfur emissions</li>
                  <li>Transitioning to low-sulfur marine fuels ahead of regulatory requirements</li>
                  <li>Exploring hydrogen and fully electric vessel options for shorter routes</li>
                  <li>Regular maintenance schedules to ensure optimal engine performance and minimized emissions</li>
                </ul>
                <p className="text-gray-700 mt-2 font-medium">2026 Target: Build our fleet with vessels that produce 30% fewer emissions than industry standards</p>
              </div>
            }
            isDefaultOpen={true}
          />

          <SustainabilityDetail
            title="Waste Management & Recycling"
            content={
              <div className="space-y-4">
                <p className="text-gray-700">We're tackling waste on multiple fronts:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Eliminating single-use plastics throughout our operations</li>
                  <li>Implementing comprehensive onboard recycling programs for passengers and crew</li>
                  <li>Using biodegradable and compostable food packaging in our onboard cafés</li>
                  <li>Reducing paper consumption through digital ticketing and communications</li>
                  <li>Responsibly disposing of all hazardous waste materials</li>
                  <li>Working with suppliers to reduce packaging waste in our supply chain</li>
                </ul>
                <p className="text-gray-700 mt-2 font-medium">2025-2026 Target: Launch with zero single-use plastics and implement 80% waste diversion from landfills</p>
              </div>
            }
          />

          <SustainabilityDetail
            title="Water Conservation & Protection"
            content={
              <div className="space-y-4">
                <p className="text-gray-700">Our commitment to marine ecosystem protection includes:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Advanced wastewater treatment systems on all vessels to protect marine water quality</li>
                  <li>Regular cleaning and maintenance of hulls to prevent invasive species transfer</li>
                  <li>Use of environmentally friendly cleaning products throughout our operations</li>
                  <li>Fresh water conservation measures on all vessels</li>
                  <li>Marine wildlife protection protocols, including reduced speeds in sensitive habitats</li>
                  <li>Partnerships with marine conservation organizations</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  We regularly monitor water quality in our operating areas and participate in coastal cleanup initiatives along our routes.
                </p>
              </div>
            }
          />

          <SustainabilityDetail
            title="Carbon Offset Programs"
            content={
              <div className="space-y-4">
                <p className="text-gray-700">While we work to reduce our direct emissions, we also invest in carbon offset projects:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Reforestation initiatives in coastal areas along our routes</li>
                  <li>Investment in renewable energy projects</li>
                  <li>Support for blue carbon projects that protect and restore mangroves and seagrass beds</li>
                  <li>Partnership with verified carbon offset providers</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Passengers can opt to add a small contribution to their ticket price to support these projects, with SailMate matching every contribution.
                </p>
              </div>
            }
          />

          <SustainabilityDetail
            title="Green Terminal Operations"
            content={
              <div className="space-y-4">
                <p className="text-gray-700">Our sustainability efforts extend to our terminal facilities:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Solar panels installed at major terminals to generate renewable energy</li>
                  <li>Energy-efficient lighting and climate control systems</li>
                  <li>Electric vehicle charging stations in terminal parking areas</li>
                  <li>Shore power capabilities allowing docked vessels to use land-based electricity instead of running engines</li>
                  <li>Rainwater harvesting systems for terminal maintenance and landscaping</li>
                  <li>Green spaces and local native plantings at terminal facilities</li>
                </ul>
              </div>
            }
          />

          <SustainabilityDetail
            title="Sustainable Food & Beverage"
            content={
              <div className="space-y-4">
                <p className="text-gray-700">Our onboard dining options prioritize sustainability:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Partnership with local food producers along our routes</li>
                  <li>Seasonal menu items to reduce food transportation emissions</li>
                  <li>Plant-based menu options with lower environmental impact</li>
                  <li>Sustainably sourced seafood certified by the Marine Stewardship Council</li>
                  <li>Food waste reduction programs including composting where possible</li>
                  <li>Reusable or compostable dining materials</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  We're proud to showcase the flavors of the regions we serve while minimizing our environmental footprint.
                </p>
              </div>
            }
          />
        </div>

        <div className="mt-12 p-6 bg-white rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-[#0D3A73] mb-6">Our Sustainability Roadmap</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-[#F0C808]"></div>
            
            <div className="relative mb-8 pl-16">
              <div className="absolute left-5 w-8 h-8 rounded-full bg-[#F0C808] flex items-center justify-center text-white font-bold transform -translate-x-1/2">1</div>
              <h3 className="text-xl font-medium text-[#0D3A73] mb-2">2025: Launch</h3>
              <p className="text-gray-700">SailMate begins operations with sustainability as a founding principle. Initial fleet equipped with fuel-efficient technology, zero single-use plastics policy, and comprehensive recycling programs from day one.</p>
            </div>
            
            <div className="relative mb-8 pl-16">
              <div className="absolute left-5 w-8 h-8 rounded-full bg-[#06AED5] flex items-center justify-center text-white font-bold transform -translate-x-1/2">2</div>
              <h3 className="text-xl font-medium text-[#0D3A73] mb-2">2026-2027: Expansion</h3>
              <p className="text-gray-700">Growing our fleet with increasingly efficient vessels, implementing shore power connections, expanding renewable energy use at terminals, and enhancing water conservation systems.</p>
            </div>
            
            <div className="relative mb-8 pl-16">
              <div className="absolute left-5 w-8 h-8 rounded-full bg-[#0D3A73] flex items-center justify-center text-white font-bold transform -translate-x-1/2">3</div>
              <h3 className="text-xl font-medium text-[#0D3A73] mb-2">2028-2029: Innovation</h3>
              <p className="text-gray-700">Introduction of hybrid-electric vessels on shorter routes, carbon-neutral terminal operations, and a fully sustainable supply chain from food service to maintenance materials.</p>
            </div>
            
            <div className="relative pl-16">
              <div className="absolute left-5 w-8 h-8 rounded-full bg-[#F0C808] flex items-center justify-center text-white font-bold transform -translate-x-1/2">4</div>
              <h3 className="text-xl font-medium text-[#0D3A73] mb-2">2030: Industry Leadership</h3>
              <p className="text-gray-700">Setting new standards for the ferry industry with our commitment to sustainable operations, significantly lower emissions than competitors, positive contributions to marine ecosystems, and innovative clean energy travel solutions.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-[#0D3A73] rounded-xl shadow-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-2">Join Our Sustainability Journey</h3>
              <p className="mb-4">Help us make a difference by choosing sustainable travel options, participating in our carbon offset program, or sharing your ideas for environmental improvements.</p>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end mt-4 md:mt-0">
              <button 
                onClick={navigateToContact}
                className="px-6 py-3 bg-[#F0C808] text-[#0D3A73] font-medium rounded-lg shadow-md hover:bg-[#F0C808]/90 transition-colors duration-300"
              >
                Share Your Ideas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;