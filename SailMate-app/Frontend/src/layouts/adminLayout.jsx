import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "../components/adminHeader";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const AdminLayout = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);
  
  // Fallback title update if component doesn't handle it
  useEffect(() => {
    const path = location.pathname;
    
    // Set default title if not set by the specific page component
    // This will be overridden by the more specific titles in AdminHeader
    if (!document.title.includes('SailMate')) {
      document.title = t('pageTitle.admin');
    }
  }, [location.pathname, t]);

  return (
    <>
      <div className="layout">
        <AdminHeader/>
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Outlet/>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLayout;
