import { Notifications } from "@/pages/dashboard";
import {
  HomeIcon,
  InformationCircleIcon,
  UserCircleIcon
} from "@heroicons/react/24/solid";
import { PatientsProfiles } from "./components/Patients/PatientsProfiles";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import DoctorDashboard from "./pages/dashboard/doctor/DoctorDashboard";
import PatientDashboard from "./pages/dashboard/patient/PatientDashboard";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [

      {
        icon: <HomeIcon {...icon} />,
        name: "Admin dashboard",
        path: "/home",
        element: <AdminDashboard />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Doctor Dashboard",
        path: "/doctor",
        element: <DoctorDashboard />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Patients Dashboard",
        path: "/patients_dashboard",
        element: <PatientDashboard />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Patients Management",
        path: "/patients_profile",
        element: <PatientsProfiles />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },

    ],
  }
];

export default routes;
