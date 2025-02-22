import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./pages/homepage";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import VoyageTimes from "./pages/VoyageTimes";
import TicketCancel from "./pages/TicketCancel";
import TicketCheck from "./pages/TicketCheck";
import StationCard from "./components/stationCard";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import "./App.css";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/*" element={<Homepage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/stations" element={<StationCard />}/>
          <Route path="/contact" element={<Contact />} />
          <Route path="/voyage-times" element={<VoyageTimes />} />
          <Route path="/ticket-cancel" element={<TicketCancel />} />
          <Route path="/ticket-check" element={<TicketCheck />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const AppLayout = ({ children }) => {
  return (
    <>
      <title>SailMate</title>
      <div className="app-wrapper">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <AnimatedRoutes />
      </AppLayout>
    </Router>
  );
}

export default App;
