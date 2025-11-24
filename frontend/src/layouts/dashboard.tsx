import { setOpenConfigurator, useMaterialTailwindController } from "@/context";
import { getRoutesForRole } from "@/services/menu.service";
import { UserState } from "@/state/UserState";
import { Configurator, DashboardNavbar, Footer } from "@/widgets/layout";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import { Routes } from "react-router-dom";

export function Dashboard() {
  const user_state = UserState();
  const user_state_data = user_state.get();
  const [, dispatch] = useMaterialTailwindController();

  // Get routes based on user role
  const userRole = user_state_data?.user_data?.role as
    | "admin"
    | "doctor"
    | "user";
  const roleRoutes = getRoutesForRole(userRole);

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <div className="px-3 py-3 lg:py-[50px] lg:px-[140px]">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
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
