import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import seabus from "../assets/images/seabus.jpg";
import fastFerries from "../assets/images/fast-ferries.jpg";

const FerrySlider = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("voyage-times");
  };
  

  const slides = [
    {
      image: seabus,
      title: t('ferryExplorer.seabus.title', 'Modern Seabus Fleet'),
      description: t('ferryExplorer.seabus.description', 'Enjoy smooth sailing with our eco-friendly Seabus vessels'),
      features: [
        t('ferryExplorer.seabus.feature1', 'Panoramic Views'), 
        t('ferryExplorer.seabus.feature2', 'Onboard Amenities'), 
        t('ferryExplorer.seabus.feature3', 'Family Friendly')
      ],
      tag: t('ferryExplorer.seabus.tag', 'Seabus')
    },
    {
      image: fastFerries,
      title: t('ferryExplorer.fastFerry.title', 'High-Speed Fast Ferries'),
      description: t('ferryExplorer.fastFerry.description', 'Rapid connections between destinations with superior comfort'),
      features: [
        t('ferryExplorer.fastFerry.feature1', '30% Faster Travel'), 
        t('ferryExplorer.fastFerry.feature2', 'Premium Seating'), 
        t('ferryExplorer.fastFerry.feature3', 'LPG Powered')
      ],
      tag: t('ferryExplorer.fastFerry.tag', 'Fast Ferry FC')
    }
  ];

  return (
    <section className="relative w-full h-[80vh]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{ 
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active bg-[#F0C808]",
          bulletClass: "swiper-pagination-bullet bg-white/70 mx-1"
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        loop
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center relative flex items-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Darker overlay for better text readability */}
              <div className="absolute inset-0 bg-black/60"></div>
              
              {/* Content container with SailMate styling */}
              <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col items-start">
                {/* Tag */}
                <div className="bg-[#F0C808] text-[#0D3A73] px-4 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  {slide.tag}
                </div>
                
                {/* Main content */}
                <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg">
                  {slide.title}
                </h2>
                
                <p className="text-lg text-white font-medium max-w-xl mb-6">
                  {slide.description}
                </p>
                
                {/* Features list */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {slide.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center bg-[#0D3A73]/90 px-4 py-2 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#F0C808] mr-2"></div>
                      <span className="text-white font-medium text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <button 
                  onClick={handleClick}
                  className="bg-[#06AED5] hover:bg-[#D1FFD7] hover:text-[#0D3A73] text-white transition-colors duration-300 px-6 py-3 rounded-lg font-medium flex items-center"
                >
                  {t('ferryExplorer.exploreRoutes', 'Explore Routes')}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom navigation arrows */}
      <div className="swiper-button-prev !text-white after:!text-2xl hover:!text-[#F0C808] transition-colors"></div>
      <div className="swiper-button-next !text-white after:!text-2xl hover:!text-[#F0C808] transition-colors"></div>
    </section>
  );
};

export default FerrySlider;