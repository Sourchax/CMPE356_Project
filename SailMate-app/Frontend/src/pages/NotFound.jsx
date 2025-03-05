import React from 'react';
import { Anchor, Map, Ship, Compass, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#06AED5] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative map grid lines */}
      <div className="absolute inset-0 opacity-10" 
        style={{ 
          backgroundImage: 'linear-gradient(#F0C808 1px, transparent 1px), linear-gradient(90deg, #F0C808 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Map edge decorative elements */}
      <div className="absolute top-0 left-0 w-full h-16 border-b border-[#F0C808] opacity-20 flex">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="flex-1 border-r border-[#F0C808] h-full flex items-end justify-center pb-2">
            <div className="w-1 h-3 bg-[#F0C808]"></div>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-16 border-t border-[#F0C808] opacity-20 flex">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="flex-1 border-r border-[#F0C808] h-full flex items-start justify-center pt-2">
            <div className="w-1 h-3 bg-[#F0C808]"></div>
          </div>
        ))}
      </div>
      
      {/* Header/Logo */}
      <div className="flex items-center mb-10 z-10">
        <div className="bg-[#F0C808] p-2 rounded-full">
          <Anchor className="w-6 h-6 text-[#0D3A73]" />
        </div>
        <h1 className="text-xl font-semibold text-white ml-3">SailMate</h1>
      </div>
      
      {/* Main Content */}
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden z-10">
        <div className="bg-[#F0C808] p-6 text-center relative">
          <div className="absolute top-0 right-0 m-4">
            <Compass className="w-8 h-8 text-[#0D3A73]" />
          </div>
          <h2 className="text-5xl font-bold text-[#0D3A73]">OFF THE CHART</h2>
          <p className="text-[#0D3A73] mt-2 font-medium">You've sailed beyond our mapped waters</p>
        </div>
        
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Map className="w-20 h-20 text-[#0D3A73] opacity-20" />
              <Ship className="w-10 h-10 text-[#06AED5] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-0 right-0 text-xs font-bold text-[#F0C808] bg-[#0D3A73] px-2 py-1 rounded-full">404</div>
              <div className="w-20 h-20 border-2 border-dashed border-[#F0C808] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
            </div>
          </div>
          
          <div className="mb-8 p-5 bg-blue-50 rounded-md border border-blue-100">
            <h3 className="font-semibold text-[#0D3A73] mb-2">Navigator's Log:</h3>
            <p className="text-gray-700">
              These coordinates (404) are beyond the boundaries of our navigation charts. This route doesn't exist in our maritime maps or may have drifted into uncharted territory.
            </p>
          </div>
          
          <div className="flex justify-center">
            <button 
              className="flex items-center bg-[#06AED5] hover:bg-[#0596B7] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Chartered Waters
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Sea Monster */}
      <div className="absolute bottom-10 right-10 opacity-10 hidden md:block">
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20,40 C30,20 40,60 60,40 C80,20 90,60 100,40" stroke="#F0C808" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="110" cy="40" r="8" fill="#F0C808"/>
          <circle cx="114" cy="37" r="2" fill="#0D3A73"/>
        </svg>
      </div>
      
      {/* Here be dragons text */}
      <div className="absolute bottom-5 left-10 text-[#F0C808] opacity-20 font-serif italic hidden md:block">
        Here be dragons...
      </div>
    </div>
  );
};

export default NotFoundPage;