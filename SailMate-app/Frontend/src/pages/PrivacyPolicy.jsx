import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
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
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="mb-3 text-5xl font-bold text-[#0D3A73]">{t('privacyPolicyPage.pageTitle')}</h1>
                    <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#F0C808]"></div>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('privacyPolicyPage.pageSubtitle')}
                    </p>
                    <div className="mt-3 text-sm text-gray-500">{t('privacyPolicyPage.lastUpdated')}</div>
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-2xl p-10 shadow-lg">
                    <div className="mb-12 space-y-10">
                        {/* Introduction */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">{t('privacyPolicyPage.introduction.title')}</h2>
                            <p className="text-base text-gray-700 leading-relaxed">
                                {t('privacyPolicyPage.introduction.content')}
                            </p>
                        </div>

                        {/* Information We Collect */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">{t('privacyPolicyPage.informationWeCollect.title')}</h2>
                            
                            <h3 className="mt-6 mb-3 text-xl font-semibold text-[#06AED5]">{t('privacyPolicyPage.informationWeCollect.providedInfo.title')}</h3>
                            <p className="text-base text-gray-700 leading-relaxed mb-4">
                                {t('privacyPolicyPage.informationWeCollect.providedInfo.intro')}
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-base text-gray-700 mb-6">
                                {t('privacyPolicyPage.informationWeCollect.providedInfo.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            
                            <h3 className="mt-6 mb-3 text-xl font-semibold text-[#06AED5]">{t('privacyPolicyPage.informationWeCollect.automaticInfo.title')}</h3>
                            <p className="text-base text-gray-700 leading-relaxed mb-4">
                                {t('privacyPolicyPage.informationWeCollect.automaticInfo.intro')}
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-base text-gray-700">
                                {t('privacyPolicyPage.informationWeCollect.automaticInfo.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* How We Use Information */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">{t('privacyPolicyPage.howWeUse.title')}</h2>
                            <p className="text-base text-gray-700 leading-relaxed mb-4">
                                {t('privacyPolicyPage.howWeUse.intro')}
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-base text-gray-700">
                                {t('privacyPolicyPage.howWeUse.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Sharing of Information */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">{t('privacyPolicyPage.sharingInfo.title')}</h2>
                            <p className="text-base text-gray-700 leading-relaxed mb-4">
                                {t('privacyPolicyPage.sharingInfo.intro')}
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-base text-gray-700">
                                {t('privacyPolicyPage.sharingInfo.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>
                                        <span className="font-medium text-[#F05D5E]">{item.label}:</span> {item.content}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Security */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">{t('privacyPolicyPage.security.title')}</h2>
                            <p className="text-base text-gray-700 leading-relaxed">
                                {t('privacyPolicyPage.security.content')}
                            </p>
                        </div>

                        {/* Your Rights */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-[#0D3A73]">{t('privacyPolicyPage.yourRights.title')}</h2>
                            <p className="text-base text-gray-700 leading-relaxed mb-4">
                                {t('privacyPolicyPage.yourRights.intro')}
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-base text-gray-700">
                                {t('privacyPolicyPage.yourRights.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>
                                        <span className="font-medium text-[#06AED5]">{item.label}:</span> {item.content}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                
                {/* Contact Information */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600">
                        {t('privacyPolicyPage.contactInfo.question')}{" "}
                        <span 
                            onClick={navigateToContact} 
                            className="text-[#0D3A73] font-medium hover:text-[#06AED5] underline cursor-pointer transition-colors duration-300"
                        >
                            {t('privacyPolicyPage.contactInfo.contact')}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
