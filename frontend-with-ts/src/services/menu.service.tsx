import { Route } from "react-router-dom";
import AdminDashboard from "@/pages/dashboard/admin/AdminDashboard";
import DoctorDashboard from "@/pages/dashboard/doctor/DoctorDashboard";
import PatientDashboard from "@/pages/dashboard/patient/PatientDashboard";
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

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
      {
        label: "Doctors",
        path: "/doctors",
        icon: UserGroupIcon,
      },
      {
        label: "Patients",
        path: "/patients",
        icon: UserGroupIcon,
      },

      {
        label: "Settings",
        path: "/dashboard/settings",
        icon: Cog6ToothIcon,
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
      // Add more doctor routes here as needed
    ],
    menu: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: HomeIcon,
      },
      {
        label: "My Patients",
        path: "/dashboard/patients",
        icon: UserGroupIcon,
      },
      {
        label: "Appointments",
        path: "/dashboard/appointments",
        icon: ClipboardDocumentListIcon,
      },
      {
        label: "Goals",
        path: "/dashboard/goals",
        icon: ChartBarIcon,
      },
      {
        label: "Profile",
        path: "/dashboard/profile",
        icon: Cog6ToothIcon,
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
      {
        label: "My Health",
        path: "/dashboard/health",
        icon: HeartIcon,
      },
      {
        label: "Appointments",
        path: "/dashboard/appointments",
        icon: ClipboardDocumentListIcon,
      },
      {
        label: "My Goals",
        path: "/dashboard/goals",
        icon: ChartBarIcon,
      },
      {
        label: "Profile",
        path: "/dashboard/profile",
        icon: Cog6ToothIcon,
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
