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
        name: "dashboard",
        path: "/home",
        element: <AdminDashboard />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/doctore/home",
        element: <DoctorDashboard />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/patients/home",
        element: <PatientDashboard />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "patients",
        path: "/patients",
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
