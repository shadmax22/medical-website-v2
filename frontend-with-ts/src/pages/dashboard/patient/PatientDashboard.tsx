import {
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftEllipsisIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

import React from "react";
import { getPatientDashboardData } from "@/services/patient.service";
import { useEffect, useState } from "react";

interface PatientDashboardData {
  patient: {
    name: string;
    age: number;
    gender: string;
    img: string;
  };
  stats: {
    total_goals: number;
    total_responses: number;
    upcoming_appointments: number;
  };
  upcoming_appointments: {
    doctor: string;
    date: string;
    time: string;
    department: string;
    img: string;
  }[];
  doctor_responses: {
    doctor: string;
    img: string;
    message: string;
    time: string;
  }[];
  goals_from_doctors: {
    doctor: string;
    doctor_img: string;
    goal: string;
    due: string;
    status: string;
  }[];
}

export function PatientDashboard() {
  const [patientData, setPatientData] = useState<PatientDashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPatientDashboardData();
        setPatientData(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="mt-12">Loading...</div>;
  if (!patientData) return <div className="mt-12">Error loading data</div>;

  const patient_data = patientData;

  const statisticsCards = [
    {
      icon: ClipboardDocumentCheckIcon,
      title: "Assigned Goals",
      value: patient_data.stats.total_goals,
    },
    {
      icon: ChatBubbleLeftEllipsisIcon,
      title: "Doctor Responses",
      value: patient_data.stats.total_responses,
    },
    {
      icon: CalendarDaysIcon,
      title: "Upcoming Appointments",
      value: patient_data.stats.upcoming_appointments,
    },
  ];

  // --------------------------------------------------------------------------

  return (
    <div className="mt-12">
      {/* STATISTICS CARDS */}
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
        {/* UPCOMING APPOINTMENTS */}
        <Card className="xl:col-span-1 border border-blue-gray-100 shadow-sm">
          <CardHeader floated={false} shadow={false} className="p-6">
            <Typography variant="h6" color="blue-gray">
              Upcoming Appointments
            </Typography>
            <Typography variant="small" className="text-blue-gray-600">
              Your scheduled visits with doctors
            </Typography>
          </CardHeader>

          <CardBody className="pt-0">
            {patient_data.upcoming_appointments.map(
              ({ doctor, date, time, department, img }, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b border-blue-gray-50 py-3 last:border-none"
                >
                  <Avatar src={img} size="sm" title={doctor} alt={doctor} />
                  <div>
                    <Typography variant="small" color="blue-gray">
                      {doctor}
                    </Typography>
                    <Typography className="text-xs text-blue-gray-500">
                      {department} • {date} • {time}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>

        {/* DOCTOR RESPONSES */}
        <Card className="xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader floated={false} shadow={false} className="p-6">
            <Typography variant="h6" color="blue-gray">
              Doctor Responses
            </Typography>
            <Typography variant="small" className="text-blue-gray-600">
              Messages from your doctors
            </Typography>
          </CardHeader>

          <CardBody className="pt-0">
            {patient_data.doctor_responses.map(
              ({ doctor, message, time, img }, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b border-blue-gray-50 py-3"
                >
                  <Avatar src={img} size="sm" title={doctor} alt={doctor} />
                  <div>
                    <Typography variant="small" color="blue-gray">
                      {doctor}
                    </Typography>
                    <Typography className="text-xs text-blue-gray-500 mb-1">
                      {time}
                    </Typography>
                    <Typography className="text-sm text-blue-gray-700">
                      {message}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div>

      {/* ALL GOALS ASSIGNED BY ALL DOCTORS */}
      <div className="mt-12">
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader floated={false} shadow={false} className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Your Health Goals
            </Typography>
            <Typography variant="small" className="text-blue-gray-600">
              All goals assigned by your doctors
            </Typography>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Doctor", "Goal", "Due Date", "Status"].map((h) => (
                    <th
                      key={h}
                      className="border-b border-blue-gray-50 py-3 px-6 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {h}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {patient_data.goals_from_doctors.map(
                  ({ doctor, doctor_img, goal, due, status }, index) => (
                    <tr key={index}>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-4">
                          <Avatar
                            src={doctor_img}
                            size="sm"
                            title={doctor}
                            alt={doctor}
                          />
                          <Typography color="blue-gray">{doctor}</Typography>
                        </div>
                      </td>

                      <td className="py-3 px-6">{goal}</td>
                      <td className="py-3 px-6">{due}</td>
                      <td className="py-3 px-6 capitalize">
                        {status === "completed" ? (
                          <span className="text-green-600 font-medium">
                            Completed
                          </span>
                        ) : (
                          <span className="text-blue-600 font-medium">
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default PatientDashboard;
