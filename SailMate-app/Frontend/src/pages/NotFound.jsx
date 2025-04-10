import React, { useState, useEffect } from 'react';
import { Ship, Compass, MapPin, AlertTriangle, Home } from 'lucide-react';
import SailMateLogo from '../assets/images/SailMate_logo.png';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [radarAngle, setRadarAngle] = useState(0);
  const { t } = useTranslation();
  
  useEffect(() => {
    setLoaded(true);
    
    // Rotate radar beam
    const radarInterval = setInterval(() => {
      setRadarAngle(prev => (prev + 3) % 360);
    }, 50);
    
    // Set page title
    document.title = t('pageTitle.notFound');
    
    return () => clearInterval(radarInterval);
  }, [t]);

  return (
    <div className="min-h-screen bg-[#002850] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Deep sea background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001830] to-[#003366] z-0"></div>
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, rgba(0, 150, 255, 0.1) 1px, transparent 1px), radial-gradient(circle, rgba(0, 150, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }}
      ></div>
      

      
      {/* Content container */}
      <div className="relative z-10 max-w-4xl w-full px-6 py-10">
        {/* Logo section */}
        <div 
          className={`flex justify-center mb-8 transition-all duration-1000 transform ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="bg-[#001325]/80 p-4 rounded-xl shadow-lg border border-[#00b4ff]/30">
            {/* Your actual SailMate logo */}
            <img src={SailMateLogo} alt="SailMate Logo" className="h-16" />
          </div>
        </div>

        {/* Main content */}
        <div 
          className={`relative flex flex-col md:flex-row bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-1000 transform shadow-2xl ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          {/* Left side: Radar display */}
          <div className="w-full md:w-2/5 bg-[#001325] p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" 
                style={{ 
                  backgroundImage: 'radial-gradient(circle, rgba(0, 180, 255, 0.5) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              ></div>
            </div>
            
            <div className="relative w-64 h-64 md:w-72 md:h-72">
              {/* Radar circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full border-2 border-[#00b4ff]/60"></div>
                <div className="w-3/4 h-3/4 rounded-full border-2 border-[#00b4ff]/60"></div>
                <div className="w-1/2 h-1/2 rounded-full border-2 border-[#00b4ff]/60"></div>
                <div className="w-1/4 h-1/4 rounded-full border-2 border-[#00b4ff]/60"></div>
                
                {/* Cross lines */}
                <div className="absolute w-full h-[2px] bg-[#00b4ff]/40"></div>
                <div className="absolute w-[2px] h-full bg-[#00b4ff]/40"></div>
                
                {/* Radar sweep beam */}
                <div 
                  className="absolute w-1/2 h-[3px] bg-gradient-to-r from-transparent via-[#00b4ff] to-[#00b4ff]"
                  style={{ 
                    transformOrigin: 'left center',
                    transform: `rotate(${radarAngle}deg)`,
                  }}
                ></div>
                
                {/* Static blips (would be dynamic in real app) */}
                <div className="absolute w-3 h-3 rounded-full bg-[#00b4ff] animate-ping" 
                  style={{ top: '30%', left: '70%', animationDuration: '4s' }}></div>
                <div className="absolute w-2 h-2 rounded-full bg-[#00b4ff] animate-ping" 
                  style={{ top: '60%', left: '25%', animationDuration: '3s' }}></div>
                  
                {/* 404 ship marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-10 h-10 rounded-full bg-[#ff2d55] opacity-30 animate-ping"></div>
                    <div className="absolute w-10 h-10 rounded-full border-2 border-[#ff2d55] animate-pulse"></div>
                    <Ship className="text-[#ff2d55] z-10" size={18} />
                  </div>
                </div>
              </div>
              
              {/* 404 indicator */}
              <div className="absolute -top-3 -right-3 bg-[#ff2d55] text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center shadow-lg">
                <AlertTriangle className="w-4 h-4 mr-1" />
                404
              </div>
            </div>
            
            <div className="mt-6 w-full">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-[#ff2d55] mr-2"></div>
                <p className="text-[#ff2d55] text-sm font-medium">ERROR CODE: 404</p>
              </div>
              <div className="text-white font-mono text-xs bg-[#001020] p-3 rounded border border-[#00b4ff]/30">
                <p className="mb-1">// SYSTEM LOG</p>
                <p>
                  <span className="text-[#00b4ff]">coords:</span> 
                  <span className="text-[#ff2d55]">undefined</span>
                </p>
                <p>
                  <span className="text-[#00b4ff]">status:</span> 
                  <span className="text-[#ff2d55]">vessel_not_found</span>
                </p>
                <p>
                  <span className="text-[#00b4ff]">location:</span> 
                  <span className="text-white opacity-70">uncharted_waters</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side: Content */}
          <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col">
            <div className="mb-2 flex items-center">
              <Compass className="text-[#00b4ff] mr-3 animate-pulse" size={36} />
              <div>
                <h2 className="text-3xl font-bold text-white">NAVIGATION ERROR</h2>
                <p className="text-[#00b4ff]">Destination not found</p>
              </div>
            </div>
            
            <div className="mt-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Captain's Log:</h3>
              <p className="text-white/80 mb-3">
                We seem to have sailed off the edge of our navigation charts. The waters here are uncharted and the requested location does not exist in our maritime maps.
              </p>
              <p className="text-white/80">
                It appears you're trying to visit a page that has been moved, deleted, or never existed. Please check your coordinates and try again.
              </p>
            </div>
            
            <div className="bg-[#001325] p-4 rounded-lg border border-[#00b4ff]/30 mb-8">
              <div className="flex items-center mb-2">
                <MapPin className="text-[#00b4ff] mr-2" size={18} />
                <h3 className="text-white font-medium">Last Known Coordinates</h3>
              </div>
              <div className="flex items-center text-white/70 text-sm font-mono">
                <span>Requested URL:</span>
                <span className="ml-2 bg-[#001020] py-1 px-2 rounded text-[#ff2d55]">
                  {window.location.pathname}
                </span>
              </div>
            </div>
            
            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.location.href = '/'}
                className="flex-1 flex items-center justify-center bg-[#00b4ff] hover:bg-[#0096ff] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
              >
                <Home className="mr-2" size={18} />
                Return to Home Port
              </button>
              <button 
                onClick={() => window.history.back()}
                className="flex-1 flex items-center justify-center bg-[#1d3b53] hover:bg-[#2a4d69] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 border border-[#00b4ff]/30"
              >
                <Ship className="mr-2" size={18} />
                Return to Previous Route
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center text-white/50 text-sm">
          <p>SailMate Navigation System • Coordinates monitored by Maritime Control</p>
        </div>
      </div>
    </div>
  );
};

// Add custom animations
const styleEl = document.createElement('style');
styleEl.textContent = `

  @keyframes ping {
    0% { transform: scale(0.9); opacity: 1; }
    70%, 100% { transform: scale(1.5); opacity: 0; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;
document.head.appendChild(styleEl);

export default NotFoundPage;