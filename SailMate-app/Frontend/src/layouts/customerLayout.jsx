import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const CustomerLayout = () => {
  const location = useLocation();
  const { t } = useTranslation();

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
    
    // Map routes to page titles using i18n translations
    const routeTitles = {
      "/": t('pageTitle.home'),
      "/about": t('pageTitle.about'),
      "/contact": t('pageTitle.contact'),
      "/voyage-times": t('pageTitle.voyageTimes'),
      "/ticket-cancel": t('pageTitle.ticketCancel'),
      "/ticket-check": t('pageTitle.ticketCheck'),
      "/my-tickets": t('pageTitle.myTickets'),
      "/stations": t('pageTitle.stations'),
      "/faq": t('pageTitle.faq', 'FAQ | SailMate'),
      "/ferry-ticket-form": t('pageTitle.ticketPurchase'),
      "/privacy-policy": t('pageTitle.privacyPolicy', 'Privacy Policy | SailMate'),
      "/terms-of-service": t('pageTitle.termsOfService', 'Terms of Service | SailMate'),
      "/travelling-rules": t('pageTitle.travellingRules', 'Travelling Rules | SailMate'),
      "/accessibility": t('pageTitle.accessibility', 'Accessibility | SailMate'),
      "/sustainability": t('pageTitle.sustainability', 'Sustainability | SailMate'),
      "/sign-in": t('pageTitle.login'),
      "/sign-up": t('pageTitle.signup'),
    };
    
    // Set the title based on current path
    if (routeTitles[path]) {
      title = routeTitles[path];
    }
    
    document.title = title;
  }, [location.pathname, t]);

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
