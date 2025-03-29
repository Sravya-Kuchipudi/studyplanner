
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/context/AuthContext";

const DashboardLayout = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
