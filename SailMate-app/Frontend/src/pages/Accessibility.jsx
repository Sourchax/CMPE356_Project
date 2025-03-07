import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccessibilityFeature = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0D3A73] text-white">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-[#0D3A73]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const AccessibilityDetail = ({ title, content, isDefaultOpen = false }) => {
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

const Accessibility = () => {
  const navigate = useNavigate();
  
  const navigateToContact = () => {
    navigate("/contact");
  };

  return (
    <div className="bg-gradient-to-br from-white via-[#D1FFD7]/50 to-[#D1FFD7] py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-3 text-5xl font-bold text-[#0D3A73]">Accessibility at SailMate</h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#F0C808]"></div>
          <p className="mt-6 text-lg text-gray-600">
            We're committed to making ferry travel accessible to everyone, regardless of ability.
          </p>
        </div>

        <div className="mb-12 space-y-5">
          <div className="grid gap-6 md:grid-cols-3">
            <AccessibilityFeature 
              title="Accessible Vessels" 
              description="Our ferries are designed with accessibility in mind"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
            
            <AccessibilityFeature 
              title="Website Accessibility" 
              description="WCAG 2.1 AA compliant digital experience"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            
            <AccessibilityFeature 
              title="Trained Staff" 
              description="Crew members trained to assist all passengers"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
          </div>
        </div>

        <div className="mb-12 p-6 bg-white rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-[#0D3A73] mb-6">Our Accessibility Commitment</h2>
          <p className="text-gray-700 mb-4">
            At SailMate, we believe everyone deserves a comfortable and dignified travel experience. We've implemented comprehensive accessibility features across our vessels, terminals, and digital platforms to ensure all passengers can enjoy our services.
          </p>
          <p className="text-gray-700 mb-4">
            Our accessibility program is continually evolving, and we actively seek feedback from passengers with disabilities to help us improve. We work closely with accessibility consultants and disability advocacy organizations to implement best practices throughout our operations.
          </p>
          <p className="text-gray-700">
            If you require any specific accommodations or have questions about accessibility during your journey, please don't hesitate to contact our dedicated accessibility team.
          </p>
        </div>

        <div className="divide-y divide-gray-200 rounded-xl bg-white p-1 shadow-xl">
          <AccessibilityDetail
            title="Vessel Accessibility Features"
            content={
              <div className="space-y-4">
                <p className="text-gray-700">Our ferries are equipped with:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Wheelchair-accessible entrances and ramps</li>
                  <li>Elevators between decks on all large vessels</li>
                  <li>Dedicated accessible seating areas with panoramic views</li>
                  <li>Accessible restrooms on every deck</li>
                  <li>Braille signage and tactile guidance systems</li>
                  <li>Hearing induction loops at information desks and lounges</li>
                  <li>Designated spaces for service animals</li>
                  <li>Priority boarding and disembarkation</li>
                </ul>
              </div>
            }
            isDefaultOpen={true}
          />

          <AccessibilityDetail
            title="Terminal Accessibility"
            content={
              <div className="space-y-4">
                <p className="text-gray-700">Our ferry terminals feature:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Step-free access throughout all customer areas</li>
                  <li>Wheelchair-accessible check-in counters at a lower height</li>
                  <li>Accessible restrooms</li>
                  <li>Visual and audio announcement systems</li>
                  <li>Tactile paving for visually impaired travelers</li>
                  <li>Designated accessible parking spaces close to entrances</li>
                  <li>Assistance from trained staff upon request</li>
                </ul>
              </div>
            }
          />

          <AccessibilityDetail
            title="Digital Accessibility"
            content={
              <div className="space-y-4">
                <p className="text-gray-700">Our website and mobile app are designed to be accessible for all users:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>WCAG 2.1 AA compliant</li>
                  <li>Keyboard navigation for all features</li>
                  <li>Screen reader compatibility</li>
                  <li>Adjustable text sizing and high contrast options</li>
                  <li>Alt text for all images</li>
                  <li>Accessible forms with clear labels and error messages</li>
                  <li>No time-limited features that could disadvantage users</li>
                  <li>Simplified booking process with accessibility options</li>
                </ul>
              </div>
            }
          />

          <AccessibilityDetail
            title="Booking Assistance"
            content={
              <div className="space-y-4">
                <p className="text-gray-700">When booking your journey:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Indicate any accessibility requirements during the booking process</li>
                  <li>Request specific accommodations such as accessible cabins or seating</li>
                  <li>Arrange for assistance with boarding and disembarkation</li>
                  <li>Book priority loading for vehicles with accessibility equipment</li>
                  <li>Request information in alternative formats (large print, Braille)</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Our customer service team is available to assist with any special requirements not covered in our standard booking process.
                </p>
              </div>
            }
          />

          <AccessibilityDetail
            title="Travel Companions and Assistance"
            content={
              <div className="space-y-4">
                <p className="text-gray-700">SailMate offers complimentary tickets for:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Personal care assistants traveling with passengers who require assistance</li>
                  <li>Registered service animals (no pet fee applied)</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Documentation may be required to verify eligibility for these complimentary services. Please contact our customer service team at least 48 hours before travel to arrange these accommodations.
                </p>
              </div>
            }
          />
        </div>

        <div className="mt-12 p-6 bg-white rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-[#0D3A73] mb-6">Planning Your Accessible Journey</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#F0C808] flex items-center justify-center text-white font-bold">1</div>
              <div className="ml-4">
                <h3 className="text-xl font-medium text-[#0D3A73]">Before Booking</h3>
                <p className="mt-1 text-gray-700">Review our accessibility options online or contact our accessibility team to discuss your specific requirements.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#F0C808] flex items-center justify-center text-white font-bold">2</div>
              <div className="ml-4">
                <h3 className="text-xl font-medium text-[#0D3A73]">During Booking</h3>
                <p className="mt-1 text-gray-700">Select accessibility options that match your needs and add any special instructions in the designated field.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#F0C808] flex items-center justify-center text-white font-bold">3</div>
              <div className="ml-4">
                <h3 className="text-xl font-medium text-[#0D3A73]">Pre-Travel</h3>
                <p className="mt-1 text-gray-700">Arrive at least 60 minutes before departure to allow time for priority boarding assistance.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#F0C808] flex items-center justify-center text-white font-bold">4</div>
              <div className="ml-4">
                <h3 className="text-xl font-medium text-[#0D3A73]">During Travel</h3>
                <p className="mt-1 text-gray-700">Crew members are available throughout your journey to provide assistance – just ask any staff member wearing a SailMate uniform.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-[#0D3A73] mb-4">We're Here to Help</h3>
          <p className="text-gray-600 mb-6">
            Have specific accessibility requirements or questions?
          </p>
          <button 
            onClick={navigateToContact}
            className="px-8 py-3 bg-[#0D3A73] text-white font-medium rounded-lg shadow-md hover:bg-[#0D3A73]/90 transition-colors duration-300"
          >
            Contact Our Accessibility Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;