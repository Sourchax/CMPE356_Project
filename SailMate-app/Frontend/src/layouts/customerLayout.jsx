import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect } from "react";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const CustomerLayout = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);
  
  // Update document title based on current route
  useEffect(() => {
    const path = location.pathname;
    let title = "SailMate";
    
    // Map routes to page titles
    const routeTitles = {
      "/": "Homepage | SailMate",
      "/about": "About Us | SailMate",
      "/contact": "Contact | SailMate",
      "/voyage-times": "Voyage Times | SailMate",
      "/ticket-cancel": "Cancel Ticket | SailMate",
      "/ticket-check": "Check Ticket | SailMate",
      "/my-tickets": "My Tickets | SailMate",
      "/stations": "Stations | SailMate",
      "/faq": "FAQ | SailMate",
      "/ferry-ticket-form": "Book Tickets | SailMate",
      "/privacy-policy": "Privacy Policy | SailMate",
      "/terms-of-service": "Terms of Service | SailMate",
      "/travelling-rules": "Travelling Rules | SailMate",
      "/accessibility": "Accessibility | SailMate",
      "/sustainability": "Sustainability | SailMate",
      "/sign-in": "Sign In | SailMate",
      "/sign-up": "Sign Up | SailMate",
    };
    
    // Set the title based on current path
    if (routeTitles[path]) {
      title = routeTitles[path];
    }
    
    document.title = title;
  }, [location.pathname]);

  return (
    <>
      <div className="layout">
        <Header/>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet/>
          </motion.div>
        <Footer/>
      </div>
    </>
  );
};

export default CustomerLayout;
