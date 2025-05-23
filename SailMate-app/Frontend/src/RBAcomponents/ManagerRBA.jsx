import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRBA = () => {
    const { user, isLoaded } = useUser();
    if (!isLoaded) {
        return null;
    }

    if (user?.publicMetadata?.role !== "manager" && user?.publicMetadata?.role !== "super") {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default AdminRBA;