import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Homepage from "./pages/homepage";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VoyageTimes from "./pages/VoyageTimes";
import TicketCancel from "./pages/TicketCancel";
import TicketCheck from "./pages/TicketCheck";
import StationCard from "./components/stationCard";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import UnauthorizedAccess from "./pages/UnauthorizedAccess";
import CustomerLayout from "./layouts/customerLayout";
import CustomSignIn from "./pages/customSignIn";
import CustomSignUp from "./pages/customSignUp";
import JourneyCatagory from "./components/PlanningPhase/JourneyCatagory";
import "./App.css";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/stations" element={<StationCard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/voyage-times" element={<VoyageTimes />} />
          <Route path="/ticket-cancel" element={<TicketCancel />} />
          <Route path="/ticket-check" element={<TicketCheck />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/sign-in" element={<CustomSignIn />} />
          <Route path="/sign-up" element={<CustomSignUp />} />
        </Route>
        <Route path="/unauthorized" element={<UnauthorizedAccess />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
