import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  const navigateToContact = () => {
    navigate("/contact");
  };

  return (
    <div className="bg-gradient-to-br from-white via-[#D1FFD7]/50 to-[#D1FFD7] py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-3 text-5xl font-bold text-[#0D3A73]">{t('sustainabilityPage.pageTitle')}</h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#F0C808]"></div>
          <p className="mt-6 text-lg text-gray-600">
            {t('sustainabilityPage.pageSubtitle')}
          </p>
        </div>

        <div className="mb-12 space-y-5">
          <div className="grid gap-6 md:grid-cols-3">
            <SustainabilityFeature 
              title={t('sustainabilityPage.features.ecoFriendlyVessels.title')}
              description={t('sustainabilityPage.features.ecoFriendlyVessels.description')}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
              }
            />
            
            <SustainabilityFeature 
              title={t('sustainabilityPage.features.wasteReduction.title')}
              description={t('sustainabilityPage.features.wasteReduction.description')}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            />
            
            <SustainabilityFeature 
              title={t('sustainabilityPage.features.carbonOffset.title')}
              description={t('sustainabilityPage.features.carbonOffset.description')}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
            />
          </div>
        </div>

        <div className="mb-12 p-6 bg-white rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-[#0D3A73] mb-6">{t('sustainabilityPage.vision.title')}</h2>
          <p className="text-gray-700 mb-4">
            {t('sustainabilityPage.vision.paragraph1')}
          </p>
          <p className="text-gray-700 mb-4">
            {t('sustainabilityPage.vision.paragraph2')}
          </p>
          <p className="text-gray-700">
            {t('sustainabilityPage.vision.paragraph3')}
          </p>
        </div>

        <div className="divide-y divide-gray-200 rounded-xl bg-white p-1 shadow-xl">
          <SustainabilityDetail
            title={t('sustainabilityPage.initiatives.fleet.title')}
            content={
              <div className="space-y-4">
                <p className="text-gray-700">{t('sustainabilityPage.initiatives.fleet.intro')}</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  {t('sustainabilityPage.initiatives.fleet.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="text-gray-700 mt-2 font-medium">{t('sustainabilityPage.initiatives.fleet.target')}</p>
              </div>
            }
            isDefaultOpen={true}
          />

          <SustainabilityDetail
            title={t('sustainabilityPage.initiatives.waste.title')}
            content={
              <div className="space-y-4">
                <p className="text-gray-700">{t('sustainabilityPage.initiatives.waste.intro')}</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  {t('sustainabilityPage.initiatives.waste.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="text-gray-700 mt-2 font-medium">{t('sustainabilityPage.initiatives.waste.target')}</p>
              </div>
            }
          />

          <SustainabilityDetail
            title={t('sustainabilityPage.initiatives.water.title')}
            content={
              <div className="space-y-4">
                <p className="text-gray-700">{t('sustainabilityPage.initiatives.water.intro')}</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  {t('sustainabilityPage.initiatives.water.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="text-gray-700 mt-4">
                  {t('sustainabilityPage.initiatives.water.outro')}
                </p>
              </div>
            }
          />

          <SustainabilityDetail
            title={t('sustainabilityPage.initiatives.carbon.title')}
            content={
              <div className="space-y-4">
                <p className="text-gray-700">{t('sustainabilityPage.initiatives.carbon.intro')}</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  {t('sustainabilityPage.initiatives.carbon.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="text-gray-700 mt-4">
                  {t('sustainabilityPage.initiatives.carbon.outro')}
                </p>
              </div>
            }
          />

          <SustainabilityDetail
            title={t('sustainabilityPage.initiatives.terminal.title')}
            content={
              <div className="space-y-4">
                <p className="text-gray-700">{t('sustainabilityPage.initiatives.terminal.intro')}</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  {t('sustainabilityPage.initiatives.terminal.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            }
          />

          <SustainabilityDetail
            title={t('sustainabilityPage.initiatives.food.title')}
            content={
              <div className="space-y-4">
                <p className="text-gray-700">{t('sustainabilityPage.initiatives.food.intro')}</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  {t('sustainabilityPage.initiatives.food.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="text-gray-700 mt-4">
                  {t('sustainabilityPage.initiatives.food.outro')}
                </p>
              </div>
            }
          />
        </div>

        <div className="mt-12 p-6 bg-white rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-[#0D3A73] mb-6">{t('sustainabilityPage.roadmap.title')}</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-[#F0C808]"></div>
            
            <div className="relative mb-8 pl-16">
              <div className="absolute left-5 w-8 h-8 rounded-full bg-[#F0C808] flex items-center justify-center text-white font-bold transform -translate-x-1/2">1</div>
              <h3 className="text-xl font-medium text-[#0D3A73] mb-2">{t('sustainabilityPage.roadmap.phases.launch.title')}</h3>
              <p className="text-gray-700">{t('sustainabilityPage.roadmap.phases.launch.description')}</p>
            </div>
            
            <div className="relative mb-8 pl-16">
              <div className="absolute left-5 w-8 h-8 rounded-full bg-[#06AED5] flex items-center justify-center text-white font-bold transform -translate-x-1/2">2</div>
              <h3 className="text-xl font-medium text-[#0D3A73] mb-2">{t('sustainabilityPage.roadmap.phases.expansion.title')}</h3>
              <p className="text-gray-700">{t('sustainabilityPage.roadmap.phases.expansion.description')}</p>
            </div>
            
            <div className="relative mb-8 pl-16">
              <div className="absolute left-5 w-8 h-8 rounded-full bg-[#0D3A73] flex items-center justify-center text-white font-bold transform -translate-x-1/2">3</div>
              <h3 className="text-xl font-medium text-[#0D3A73] mb-2">{t('sustainabilityPage.roadmap.phases.innovation.title')}</h3>
              <p className="text-gray-700">{t('sustainabilityPage.roadmap.phases.innovation.description')}</p>
            </div>
            
            <div className="relative pl-16">
              <div className="absolute left-5 w-8 h-8 rounded-full bg-[#F0C808] flex items-center justify-center text-white font-bold transform -translate-x-1/2">4</div>
              <h3 className="text-xl font-medium text-[#0D3A73] mb-2">{t('sustainabilityPage.roadmap.phases.leadership.title')}</h3>
              <p className="text-gray-700">{t('sustainabilityPage.roadmap.phases.leadership.description')}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-[#0D3A73] rounded-xl shadow-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-2">{t('sustainabilityPage.joinUs.title')}</h3>
              <p className="mb-4">{t('sustainabilityPage.joinUs.description')}</p>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end mt-4 md:mt-0">
              <button 
                onClick={navigateToContact}
                className="px-6 py-3 bg-[#F0C808] text-[#0D3A73] font-medium rounded-lg shadow-md hover:bg-[#F0C808]/90 transition-colors duration-300"
              >
                {t('sustainabilityPage.joinUs.button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;