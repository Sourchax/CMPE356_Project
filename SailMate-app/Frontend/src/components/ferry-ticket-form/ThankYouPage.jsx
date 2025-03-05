import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const [progress, setProgress] = useState(100);
  const [showMessage, setShowMessage] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Start with full progress bar
    setProgress(100);
    
    // Start countdown after a short delay
    const countdownStart = setTimeout(() => {
      // Smoothly decrease progress over 3 seconds
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 30); // Update roughly 33 times per second for smooth animation
      
      // Redirect after 3 seconds

      setTimeout(() => {
        setShowMessage(false);
        // Add a small delay before redirecting for a smoother transition
        setTimeout(() => {
          navigate('/');  // Navigate to the homepage
        }, 300);
      }, 3000);
      
      return () => {
        clearInterval(interval);
      };
    }, 1000); // Short delay before starting countdown
    
    return () => {
      clearTimeout(countdownStart);
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div 
        className={`transform transition-all duration-300 ${
          showMessage ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle size={36} className="text-blue-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800">Thank You for Your Purchase!</h1>
            
            <p className="text-gray-600">
              Your SailMate application has been successfully delivered. We appreciate your business!
            </p>
            
            <div className="w-full mt-4 mb-2">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Redirecting to homepage in {Math.ceil(progress/33)} seconds...
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-100 w-full">
              <p className="text-sm text-gray-500">
                Have questions? Contact our support at sailmatesup@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;