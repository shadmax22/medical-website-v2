import { AddDoctorModal } from "@/components/doctor/AddDoctors";
import {
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import React from "react";

import { getAdminDashboardData } from "@/services/admin.service";
import { useEffect, useState } from "react";
import { NothingToShow } from "@/components/misc/NothingToShow";

interface AdminDashboardData {
  stats: {
    total_doctors: number;
    total_patients: number;
    active_patients: number;
  };
  doctors: {
    name: string;
    specialization: string;
    email: string;
    img: string;
  }[];
  patients: {
    name: string;
    issue: string;
    email: string;
    img: string;
  }[];
  recent_patients: {
    name: string;
    age: number;
    img: string;
    date: string;
  }[];
}

export function AdminDashboard() {
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getAdminDashboardData();
      setAdminData(data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="mt-12">Loading...</div>;
  if (!adminData) return <div className="mt-12">Error loading data</div>;

  const admin_data = adminData;

  const statisticsCards = [
    {
      color: "gray",
      icon: UsersIcon,
      title: "Total Doctors",
      value: admin_data.stats.total_doctors,
    },
    {
      color: "gray",
      icon: UserGroupIcon,
      title: "Total Patients",
      value: admin_data.stats.total_patients,
    },
    {
      color: "gray",
      icon: ClipboardDocumentCheckIcon,
      title: "Active Patients",
      value: admin_data.stats.active_patients,
    },
  ];

  // --------------------------------------------------------------------------

  return (
    <div className="mt-12">
      {/* ---------------------------------------------------------------------- */}
      {/* STATISTICS CARDS */}
      {/* ---------------------------------------------------------------------- */}
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsCards.map(({ icon, title, value }) => (
          <Card
            key={title}
            className="border border-blue-gray-100 shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" color="blue-gray">
                  {title}
                </Typography>
                <Typography variant="h4" color="blue-gray" className="mt-2">
                  {value}
                </Typography>
              </div>
              {React.createElement(icon, {
                className: "w-10 h-10 text-blue-500",
              })}
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ---------------------------------------------------------------------- */}
        {/* DOCTORS LIST */}
        {/* ---------------------------------------------------------------------- */}
        <Card className="xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray">
                Doctors List
              </Typography>
              <Typography variant="small" className="text-blue-gray-600">
                Total {admin_data.stats.total_doctors} registered doctors
              </Typography>
            </div>

            <Button
              color="blue"
              size="sm"
              className="flex items-center gap-2"
              onClick={async () => {
                await AddDoctorModal();
                fetchData();
              }}
            >
              <UserPlusIcon className="h-4 w-4" /> Add New Doctor
            </Button>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Doctor", "Specialization", "Email"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-6 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admin_data.doctors.map(
                  ({ name, specialization, email, img }, index) => (
                    <tr key={index}>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-4">
                          <Avatar src={img} alt={name} title={name} size="sm" />
                          <Typography className="font-normal" color="blue-gray">
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className="py-3 px-6">{specialization}</td>
                      <td className="py-3 px-6">{email}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>

        {/* ---------------------------------------------------------------------- */}
        {/* RECENT PATIENTS */}
        {/* ---------------------------------------------------------------------- */}
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader floated={false} shadow={false} className="p-6">
            <Typography variant="h6" color="blue-gray">
              Recent Patients Onboarded
            </Typography>
            <Typography variant="small" className="text-blue-gray-600">
              New patients added this week
            </Typography>
          </CardHeader>

          <CardBody className="pt-0">
            {admin_data.recent_patients.length === 0 ? (
              <NothingToShow />
            ) : (
              <>
                {admin_data.recent_patients.map(
                  ({ name, age, img, date }, index) => (
                    <div key={index}>
                      <Typography variant="small" color="blue-gray">
                        {name}
                      </Typography>
                    </div>
                  )
                )}
              </>
            )}
          </CardBody>
        </Card>
      </div>
      ----------------------------------------------------------------------
      {/* ALL PATIENTS LIST */}
      {/* ---------------------------------------------------------------------- */}
    </div>
  );
}

export default AdminDashboard;
