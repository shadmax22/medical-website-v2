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
import { PatientsProfiles } from "@/components/patient/PatientsProfiles";

export interface MenuItem {
  label: string;
  path: string;
  icon?: any;
}

export interface RoleConfig {
  routes: JSX.Element[];
  menu: MenuItem[];
}

type UserRole = "admin" | "doctor" | "patient";

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
  patient: {
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
