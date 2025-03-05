import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const CustomerRBA = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};

export default CustomerRBA;