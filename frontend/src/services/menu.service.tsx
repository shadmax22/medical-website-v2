import { PatientsProfiles } from "@/components/patient/PatientsProfiles";
import AdminDashboard from "@/pages/dashboard/admin/AdminDashboard";
import DoctorDashboard from "@/pages/dashboard/doctor/DoctorDashboard";
import PatientDashboard from "@/pages/dashboard/patient/PatientDashboard";
import { HomeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Route } from "react-router-dom";

export interface MenuItem {
  label: string;
  path: string;
  icon?: any;
}

export interface RoleConfig {
  routes: JSX.Element[];
  menu: MenuItem[];
}

type UserRole = "admin" | "doctor" | "user";

const roleConfigs: Record<UserRole, RoleConfig> = {
  admin: {
    routes: [
      <Route
        key="admin-dashboard"
        path="/dashboard"
        element={<AdminDashboard />}
      />,
      // Add more admin routes here as needed
    ],
    menu: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: HomeIcon,
      },
    ],
  },
  doctor: {
    routes: [
      <Route
        key="doctor-dashboard"
        path="/dashboard"
        element={<DoctorDashboard />}
      />,
      <Route
        key="patient-panel"
        path="/patients"
        element={<PatientsProfiles />}
      />,
      // Add more doctor routes here as needed
    ],
    menu: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: HomeIcon,
      },
      {
        label: "Patients Panel",
        path: "/patients",
        icon: UserGroupIcon,
      },
    ],
  },
  user: {
    routes: [
      <Route
        key="patient-dashboard"
        path="/dashboard"
        element={<PatientDashboard />}
      />,

      // Add more patient routes here as needed
    ],
    menu: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: HomeIcon,
      },
    ],
  },
};

/**
 * Get routes for a specific role
 */
export const getRoutesForRole = (role: UserRole): JSX.Element[] => {
  return roleConfigs[role]?.routes || [];
};

/**
 * Get menu items for a specific role
 */
export const getMenuForRole = (role: UserRole): MenuItem[] => {
  return roleConfigs[role]?.menu || [];
};

/**
 * Get both routes and menu for a specific role
 */
export const getRoleConfig = (role: UserRole): RoleConfig => {
  return roleConfigs[role] || { routes: [], menu: [] };
};

export default {
  getRoutesForRole,
  getMenuForRole,
  getRoleConfig,
};
