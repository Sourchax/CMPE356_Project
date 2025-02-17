import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./pages/homepage";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import VoyageTimes from "./pages/VoyageTimes";
import TicketCancel from "./pages/TicketCancel";
import TicketCheck from "./pages/TicketCheck";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  out: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeIn" } },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        style={{
          position: "relative",  /* Absolute yerine relative yaptık */
          width: "100%",
          minHeight: "calc(100vh - 80px)", /* Footer’ın yukarı kaymasını engelle */
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Routes location={location}>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/voyage-times" element={<VoyageTimes />} />
          <Route path="/ticket-cancel" element={<TicketCancel />} />
          <Route path="/ticket-check" element={<TicketCheck />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <AnimatedRoutes />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
