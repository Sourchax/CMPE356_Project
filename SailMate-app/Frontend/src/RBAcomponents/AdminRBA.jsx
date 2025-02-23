import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRBA = () => {
  const { user, isLoaded } = useUser();
  console.log(user?.publicMetadata?.role);
  if (!isLoaded) {
    return null;
  }

  if (user?.publicMetadata?.role !== "Admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminRBA;