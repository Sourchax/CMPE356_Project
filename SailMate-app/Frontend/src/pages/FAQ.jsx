import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

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
        <span className="text-lg">{question}</span>
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
        <p className="text-gray-700 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqData = [
    {
      question: "How do I book a ferry ticket with SailMate?",
      answer: "Booking with SailMate is simple! Visit our homepage and use the booking form to enter your departure and arrival locations, preferred dates, and number of passengers. After signing in to your account, you'll be able to select your preferred voyage time, choose any add-ons, and complete your payment securely. Once confirmed, your e-ticket will be sent to your email and will also be available in your account dashboard."
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can cancel or modify your booking up to 24 hours before departure. To do so, visit the 'Ticket Check' or 'Ticket Cancel' sections of our website and enter your booking reference number. For cancellations, refunds are processed according to our policy: full refund if canceled 7+ days before departure, 75% refund for 3-6 days, and 50% refund for 1-2 days before departure. Modifications are subject to availability and may incur additional fees if the new fare is higher."
    },
    {
      question: "How early should I arrive before departure?",
      answer: "We recommend arriving at least 45 minutes before scheduled departure for foot passengers and at least 90 minutes for passengers with vehicles. This allows sufficient time for check-in, security procedures, and boarding. During peak season (June-August) or holidays, please consider arriving 30 minutes earlier than the recommended times to avoid any delays."
    },
    {
      question: "Do I need to print my ticket or can I use a mobile ticket?",
      answer: "SailMate supports both printed and mobile tickets. For most routes, you can simply show your e-ticket on your smartphone or tablet at check-in. The QR code on your ticket will be scanned for verification. If you prefer a printed ticket, you can print the PDF attachment from your confirmation email. We recommend having a digital backup available even if you bring a printed copy."
    },
    {
      question: "What happens in case of bad weather or cancellations?",
      answer: "In the event of cancellations due to severe weather or technical issues, we'll notify you via email and SMS as soon as possible. You'll be offered the choice of rebooking on the next available sailing at no extra cost, or receiving a full refund regardless of your ticket type. For significant delays (over 2 hours), we provide complimentary refreshments at our terminals. We recommend checking our website or contacting our customer service for real-time updates during adverse weather conditions."
    },
    {
      question: "Is there Wi-Fi available on board?",
      answer: "Yes, complimentary Wi-Fi is available on all our ferries. The connection quality may vary depending on your location at sea. Premium high-speed Wi-Fi is available for purchase on board for passengers who require faster connections for work or streaming. Most vessels also feature charging stations in common areas for your devices. Please note that during peak travel times, bandwidth may be limited due to high usage."
    }
  ];

  const navigate = useNavigate();
  
  const navigateToContact = () => {
    navigate("/contact");
  };

  return (
    <div className="bg-gradient-to-br from-white via-[#D1FFD7]/50 to-[#D1FFD7] py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-3 text-5xl font-bold text-[#0D3A73]">Frequently Asked Questions</h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#F0C808]"></div>
          <p className="mt-6 text-lg text-gray-600">
            Find answers to the most common questions about SailMate's ferry booking services.
          </p>
        </div>

        <div className="mb-12 space-y-5">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0D3A73] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#0D3A73]">Quick Booking</h3>
              <p className="text-gray-600">Book ferry tickets in under 2 minutes</p>
            </div>
            
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#06AED5] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#06AED5]">Secure Payments</h3>
              <p className="text-gray-600">100% secure payment processing</p>
            </div>
            
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0C808] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#F0C808]">24/7 Support</h3>
              <p className="text-gray-600">Customer service around the clock</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200 rounded-xl bg-white p-1 shadow-xl">
          {faqData.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>

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

export default FAQ;