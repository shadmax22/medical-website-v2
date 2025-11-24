import { getRoutesForRole } from "@/services/menu.service";
import { UserState } from "@/state/UserState";
import { DashboardNavbar, Footer } from "@/widgets/layout";
import { Routes } from "react-router-dom";

export function Dashboard() {
  const user_state = UserState();
  const user_state_data = user_state.get();

  // Get routes based on user role
  const userRole = user_state_data?.user_data?.role as
    | "admin"
    | "doctor"
    | "user";
  const roleRoutes = getRoutesForRole(userRole);

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <div className="px-3 py-3 lg:py-[50px] lg:px-[140px] mx-auto  3xl:!max-w-[80vw]">
        <DashboardNavbar />

        <Routes>{roleRoutes}</Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.tsx";

export default Dashboard;
