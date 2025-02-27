import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "../components/adminHeader";
import { useEffect } from "react";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const AdminLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);

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
