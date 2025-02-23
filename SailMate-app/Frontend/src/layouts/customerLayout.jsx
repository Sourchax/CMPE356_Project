import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const CustomerLayout = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <motion.div
          key={location.pathname} // Ensures proper animation on route change
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Outlet />
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default CustomerLayout;
