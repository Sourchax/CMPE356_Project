import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BookingConditions = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="mb-3 text-5xl font-bold text-[#0D3A73]">{t('termsOfServicePage.pageTitle')}</h1>
                    <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#F0C808]"></div>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('termsOfServicePage.pageSubtitle')}
                    </p>
                    <div className="mt-3 text-sm text-gray-500">{t('termsOfServicePage.lastUpdated')}</div>
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-2xl p-10 shadow-lg">
                    <div className="mb-12 space-y-10">
                        {/* Introduction */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">{t('termsOfServicePage.introduction.title')}</h2>
                            <p className="text-base text-gray-700 leading-relaxed">
                                {t('termsOfServicePage.introduction.content')}
                            </p>
                        </div>

                        {/* Application */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">{t('termsOfServicePage.sections.0.title')}</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    1.1 {t('termsOfServicePage.sections.0.items.0')}
                                </p>
                                <p>
                                    1.2 {t('termsOfServicePage.sections.0.items.1')}
                                </p>
                                <p>
                                    1.3 {t('termsOfServicePage.sections.0.items.2')}
                                </p>
                            </div>
                        </div>

                        {/* Account Registration */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">{t('termsOfServicePage.sections.1.title')}</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    2.1 {t('termsOfServicePage.sections.1.items.0')}
                                </p>
                                <p>
                                    2.2 {t('termsOfServicePage.sections.1.items.1')}
                                </p>
                                <p>
                                    2.3 {t('termsOfServicePage.sections.1.items.2')}
                                </p>
                            </div>
                        </div>

                        {/* Booking Conditions */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">{t('termsOfServicePage.sections.2.title')}</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    3.1 <span className="font-semibold text-[#06AED5]">{t('termsOfServicePage.sections.2.items.0.label')}:</span> {t('termsOfServicePage.sections.2.items.0.content')}
                                </p>
                                <p>
                                    3.2 <span className="font-semibold text-[#06AED5]">{t('termsOfServicePage.sections.2.items.1.label')}:</span> {t('termsOfServicePage.sections.2.items.1.content')}
                                </p>
                                <p>
                                    3.3 <span className="font-semibold text-[#06AED5]">{t('termsOfServicePage.sections.2.items.2.label')}:</span> {t('termsOfServicePage.sections.2.items.2.content')}
                                </p>
                                <p>
                                    3.4 <span className="font-semibold text-[#06AED5]">{t('termsOfServicePage.sections.2.items.3.label')}:</span> {t('termsOfServicePage.sections.2.items.3.content')}
                                </p>
                                <p>
                                    3.5 <span className="font-semibold text-[#06AED5]">{t('termsOfServicePage.sections.2.items.4.label')}:</span> {t('termsOfServicePage.sections.2.items.4.content')}
                                </p>
                            </div>
                        </div>

                        {/* User Conduct */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">{t('termsOfServicePage.sections.3.title')}</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    {t('termsOfServicePage.sections.3.intro')}
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-base text-gray-700">
                                    {t('termsOfServicePage.sections.3.items', { returnObjects: true }).map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Limitation of Liability */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">{t('termsOfServicePage.sections.4.title')}</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    5.1 {t('termsOfServicePage.sections.4.items.0')}
                                </p>
                                <p>
                                    5.2 {t('termsOfServicePage.sections.4.items.1')}
                                </p>
                                <p>
                                    5.3 {t('termsOfServicePage.sections.4.items.2')}
                                </p>
                            </div>
                        </div>

                        {/* Disclaimer of Warranties */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">{t('termsOfServicePage.sections.5.title')}</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p className="font-medium">
                                    {t('termsOfServicePage.sections.5.intro')}
                                </p>
                                <p>
                                    {t('termsOfServicePage.sections.5.content')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Contact Information */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600">
                        {t('termsOfServicePage.contactInfo.question')}{" "}
                        <span 
                            onClick={navigateToContact} 
                            className="text-[#0D3A73] font-medium hover:text-[#06AED5] underline cursor-pointer transition-colors duration-300"
                        >
                            {t('termsOfServicePage.contactInfo.contact')}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingConditions;
