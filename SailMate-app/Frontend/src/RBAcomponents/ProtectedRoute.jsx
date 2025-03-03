import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";


const ProtectedRoute = ({ element, requiredSource }) => {
  const location = useLocation();
  const navigate = useNavigate();
  

  useEffect(() => {
    const isDirectAccess = !location.state || location.state.from !== requiredSource;
    

    if (isDirectAccess) {
      navigate('/', { replace: true });
    }
    

    const handlePopState = () => {

      navigate('/', { replace: true });
    };
    

    window.addEventListener('popstate', handlePopState);
    

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location.state, requiredSource]);


  return location.state && location.state.from === requiredSource ? element : null;
};

export default ProtectedRoute;