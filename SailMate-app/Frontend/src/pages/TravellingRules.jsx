import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TravellingRules = () => {
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 15h2v2h-2zm0-10h2v8h-2z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="mb-3 text-5xl font-bold text-[#0D3A73]">{t('travellingRulesPage.pageTitle')}</h1>
                    <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#F0C808]"></div>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('travellingRulesPage.pageSubtitle')}
                    </p>
                    <div className="mt-3 text-sm text-gray-500">{t('travellingRulesPage.lastUpdated')}</div>
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-2xl p-10 shadow-lg">
                    <div className="mb-12 space-y-10">
                        {/* Introduction */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">{t('travellingRulesPage.introduction.title')}</h2>
                            <p className="text-base text-gray-700 leading-relaxed">
                                {t('travellingRulesPage.introduction.content')}
                            </p>
                        </div>

                        {/* Boarding and Embarkation */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">{t('travellingRulesPage.sections.0.title')}</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    1.1 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.0.items.0.label')}:</span> {t('travellingRulesPage.sections.0.items.0.content')}
                                </p>
                                <p>
                                    1.2 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.0.items.1.label')}:</span> {t('travellingRulesPage.sections.0.items.1.content')}
                                </p>
                                <p>
                                    1.3 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.0.items.2.label')}:</span> {t('travellingRulesPage.sections.0.items.2.content')}
                                </p>
                                <p>
                                    1.4 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.0.items.3.label')}:</span> {t('travellingRulesPage.sections.0.items.3.content')}
                                </p>
                            </div>
                        </div>

                        {/* Onboard Safety */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">{t('travellingRulesPage.sections.1.title')}</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    2.1 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.1.items.0.label')}:</span> {t('travellingRulesPage.sections.1.items.0.content')}
                                </p>
                                <p>
                                    2.2 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.1.items.1.label')}:</span> {t('travellingRulesPage.sections.1.items.1.content')}
                                </p>
                                <p>
                                    2.3 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.1.items.2.label')}:</span> {t('travellingRulesPage.sections.1.items.2.content')}
                                </p>
                                <p>
                                    2.4 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.1.items.3.label')}:</span> {t('travellingRulesPage.sections.1.items.3.content')}
                                </p>
                            </div>
                        </div>

                        {/* Prohibited Items */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">{t('travellingRulesPage.sections.2.title')}</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    {t('travellingRulesPage.sections.2.intro')}
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-base text-gray-700">
                                    {t('travellingRulesPage.sections.2.items', { returnObjects: true }).map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                                <p>
                                    3.1 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.2.subitems.0.label')}:</span> {t('travellingRulesPage.sections.2.subitems.0.content')}
                                </p>
                                <p>
                                    3.2 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.2.subitems.1.label')}:</span> {t('travellingRulesPage.sections.2.subitems.1.content')}
                                </p>
                            </div>
                        </div>

                        {/* Passenger Conduct */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">{t('travellingRulesPage.sections.3.title')}</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    4.1 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.3.items.0.label')}:</span> {t('travellingRulesPage.sections.3.items.0.content')}
                                </p>
                                <p>
                                    4.2 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.3.items.1.label')}:</span> {t('travellingRulesPage.sections.3.items.1.content')}
                                </p>
                                <p>
                                    4.3 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.3.items.2.label')}:</span> {t('travellingRulesPage.sections.3.items.2.content')}
                                </p>
                                <p>
                                    4.4 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.3.items.3.label')}:</span> {t('travellingRulesPage.sections.3.items.3.content')}
                                </p>
                            </div>
                        </div>

                        {/* Luggage and Personal Items */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">{t('travellingRulesPage.sections.4.title')}</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    5.1 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.4.items.0.label')}:</span> {t('travellingRulesPage.sections.4.items.0.content')}
                                </p>
                                <p>
                                    5.2 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.4.items.1.label')}:</span> {t('travellingRulesPage.sections.4.items.1.content')}
                                </p>
                                <p>
                                    5.3 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.4.items.2.label')}:</span> {t('travellingRulesPage.sections.4.items.2.content')}
                                </p>
                                <p>
                                    5.4 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.4.items.3.label')}:</span> {t('travellingRulesPage.sections.4.items.3.content')}
                                </p>
                            </div>
                        </div>

                        {/* Environmental Responsibility */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">{t('travellingRulesPage.sections.5.title')}</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p>
                                    6.1 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.5.items.0.label')}:</span> {t('travellingRulesPage.sections.5.items.0.content')}
                                </p>
                                <p>
                                    6.2 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.5.items.1.label')}:</span> {t('travellingRulesPage.sections.5.items.1.content')}
                                </p>
                                <p>
                                    6.3 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.5.items.2.label')}:</span> {t('travellingRulesPage.sections.5.items.2.content')}
                                </p>
                                <p>
                                    6.4 <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.5.items.3.label')}:</span> {t('travellingRulesPage.sections.5.items.3.content')}
                                </p>
                            </div>
                        </div>

                        {/* Health and Emergency Procedures */}
                        <div>
                            <h2 className="mb-6 text-2xl font-bold text-[#0D3A73]">{t('travellingRulesPage.sections.6.title')}</h2>
                            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                                <p className="font-medium">
                                    {t('travellingRulesPage.sections.6.intro')}
                                </p>
                                <p>
                                    <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.6.items.0.label')}:</span> {t('travellingRulesPage.sections.6.items.0.content')}
                                </p>
                                <p>
                                    <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.6.items.1.label')}:</span> {t('travellingRulesPage.sections.6.items.1.content')}
                                </p>
                                <p>
                                    <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.6.items.2.label')}:</span> {t('travellingRulesPage.sections.6.items.2.content')}
                                </p>
                                <p>
                                    <span className="font-semibold text-[#06AED5]">{t('travellingRulesPage.sections.6.items.3.label')}:</span> {t('travellingRulesPage.sections.6.items.3.content')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Contact Information */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600">
                        {t('travellingRulesPage.contactInfo.question')}{" "}
                        <span 
                            onClick={navigateToContact} 
                            className="text-[#0D3A73] font-medium hover:text-[#06AED5] underline cursor-pointer transition-colors duration-300"
                        >
                            {t('travellingRulesPage.contactInfo.contact')}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TravellingRules; 