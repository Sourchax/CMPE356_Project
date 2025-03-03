import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium text-[#0D3A73] focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 ${
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
        className={`mt-2 text-gray-600 overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="pb-4">{answer}</p>
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

  return (
    <div className="py-16 bg-gradient-to-b from-white to-[#D1FFD7]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#0D3A73] mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">
            Find answers to the most common questions about SailMate and our ferry booking services.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {faqData.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for?
          </p>
          <button className="bg-[#06AED5] hover:bg-[#0590B0] text-white font-medium py-2 px-6 rounded-md transition-colors">
          <Link to="/contact" className="text-white opacity-80 hover:opacity-100">Contact Support</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;