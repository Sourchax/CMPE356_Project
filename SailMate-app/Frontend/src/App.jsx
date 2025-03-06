import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Homepage from "./pages/homepage";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import VoyageTimes from "./pages/VoyageTimes";
import TicketCancel from "./pages/TicketCancel";
import TicketCheck from "./pages/TicketCheck";
import MyTickets from "./pages/MyTickets";
import StationList from "./pages/StationsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import UnauthorizedAccess from "./pages/UnauthorizedAccess";
import CustomerLayout from "./layouts/customerLayout";
import CustomSignIn from "./pages/customSignIn";
import CustomSignUp from "./pages/customSignUp";
import AdminRBA from "./RBAcomponents/AdminRBA";
import AdminLayout from "./layouts/adminLayout";
import AdminStations from "./pages/Admin/adminStations";
import AdminAnnounce from "./pages/Admin/adminAnnounce";
import FerryTicketForm from "./pages/FerryTicketForm";
import FAQ from "./pages/FAQ";
import ManagerRBA from "./RBAcomponents/ManagerRBA";
import ManagerLayout from "./layouts/managerLayout";
import ManagerLogs from "./pages/Manager/managerLogs";
import ManagerUsers from "./pages/Manager/managerUsers";
import ManagerComplaints from "./pages/Manager/managerComplaints";
import ManagerFinance from "./pages/Manager/managerFinance";
import AdminVoyage from "./pages/Admin/adminVoyage";
import ProtectedRoute from "./RBAcomponents/ProtectedRoute";
import CustomerRBA from "./RBAcomponents/customerRBA";
import NotFoundPage from "./pages/NotFound";
import "./App.css";


const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/stations" element={<StationList />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/voyage-times" element={<VoyageTimes />} />
          <Route path="/ticket-cancel" element={<TicketCancel />} />
          <Route path="/ticket-check" element={<TicketCheck />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route 
            path="/ferry-ticket-form" 
            element={<ProtectedRoute element={<FerryTicketForm />} requiredSource="homepage" />} 
          />
          <Route path="/sign-in/*" element={<CustomSignIn />} />
          <Route path="/sign-up/*" element={<CustomSignUp />} />
        </Route>

        <Route element={<AdminRBA />}>
          <Route element={<AdminLayout />}>
            <Route path="/adminStations" element={<AdminStations />} />
            <Route path="/adminAnnounce" element={<AdminAnnounce />} />
            <Route path="/adminVoyage" element={<AdminVoyage />} />
          </Route>
        </Route>

        <Route element={<ManagerRBA />}>
            <Route element={<ManagerLayout />}>
                <Route path="/managerLogs" element={<ManagerLogs />} />
                <Route path="/managerUsers" element={<ManagerUsers />} />
                <Route path="/managerComplaints" element={<ManagerComplaints />} />
                <Route path="/managerFinance" element={<ManagerFinance />} />
            </Route>
        </Route>

      <Route element={<CustomerRBA/>}>
        <Route element={<CustomerLayout/>}>
            <Route path="/my-tickets" element={<MyTickets />} />
        </Route>
      </Route>

        <Route path="/unauthorized" element={<UnauthorizedAccess />} />
        <Route path="/*" element={<NotFoundPage/>} />
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
