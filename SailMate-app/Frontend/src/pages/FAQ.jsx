import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const navigateToContact = () => {
    navigate("/contact");
  };

  return (
    <div className="bg-gradient-to-br from-white via-[#D1FFD7]/50 to-[#D1FFD7] py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-3 text-5xl font-bold text-[#0D3A73]">{t('faqPage.pageTitle')}</h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#F0C808]"></div>
          <p className="mt-6 text-lg text-gray-600">
            {t('faqPage.pageSubtitle')}
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
              <h3 className="mb-2 text-lg font-semibold text-[#0D3A73]">{t('faqPage.features.quickBooking.title')}</h3>
              <p className="text-gray-600">{t('faqPage.features.quickBooking.description')}</p>
            </div>
            
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#06AED5] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#06AED5]">{t('faqPage.features.securePayments.title')}</h3>
              <p className="text-gray-600">{t('faqPage.features.securePayments.description')}</p>
            </div>
            
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0C808] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#F0C808]">{t('faqPage.features.support.title')}</h3>
              <p className="text-gray-600">{t('faqPage.features.support.description')}</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200 rounded-xl bg-white p-1 shadow-xl">
          {t('faqPage.questions', { returnObjects: true }).map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600">
            {t('faqPage.stillHaveQuestions')}{" "}
            <span 
              onClick={navigateToContact} 
              className="text-[#0D3A73] font-medium hover:text-[#06AED5] underline cursor-pointer transition-colors duration-300"
            >
              {t('faqPage.contactSupport')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;