import {
  CalendarDaysIcon,
  ChatBubbleLeftEllipsisIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

import { NothingToShow } from "@/components/misc/NothingToShow";
import { Loader } from "@/components/misc/Loader";
import {
  createGoalTrackingEntry,
  getPatientDashboardData,
} from "@/services/patient.service";
import { VModal } from "@/utils/VModal";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Controller, useForm } from "react-hook-form";

interface GoalProgress {
  goal_id: string;
  title: string;
  target: string;
  frequency: number;
  completed_days: number;
  remaining_days: number;
  completion_percent: number;
  status: string;
  today_completed: boolean;
  due_date: string;
}

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
    completed_goals: number;
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
    goal_id: string;
    doctor: string;
    doctor_img: string;
    goal: string;
    due: string;
    status: string;
  }[];
  goal_progress: GoalProgress[];
}

export function PatientDashboard() {
  const [patientData, setPatientData] = useState<PatientDashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const refreshDashboardData = useCallback(async () => {
    const data = await getPatientDashboardData();
    setPatientData(data);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await refreshDashboardData();
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshDashboardData]);

  if (loading) return <Loader message="Loading patient dashboard..." />;
  if (!patientData)
    return (
      <div className="mt-12">
        <NothingToShow />
        <Typography className="text-center mt-3 text-blue-gray-600">
          Error loading data
        </Typography>
      </div>
    );

  const patient_data = patientData;
  const goalProgress = patient_data.goal_progress || [];

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

  const openGoalTrackingModal = async () => {
    if (!goalProgress.length) return;

    await VModal({
      title: "Log Goal Progress",
      body: (resolver: any) => (
        <GoalTrackingEntryForm
          goals={goalProgress}
          resolver={resolver}
          onSuccess={async () => {
            await refreshDashboardData();
          }}
        />
      ),
      footer: () => <></>,
    });
  };

  // --------------------------------------------------------------------------

  return (
    <div className="mt-12">
      {/* GOAL PROGRESS */}
      <div className="mb-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Typography variant="h6" color="blue-gray">
              Goal Completion Overview
            </Typography>
            <Typography variant="small" className="text-blue-gray-600">
              Daily completion entries vs target frequency
            </Typography>
          </div>
        </div>

        <div className="flex justify-center lg:justify-start">
          {goalProgress.length ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {goalProgress.map((goal) => {
                const completed = goal.completed_days;
                const remaining = Math.max(goal.frequency - completed, 0);
                const totalSlices = completed + remaining;
                const donutSeries =
                  totalSlices === 0 ? [0.0001, 0] : [completed, remaining];

                return (
                  <Card
                    key={goal.goal_id}
                    className="!w-full lg:w-fit border border-blue-gray-100 shadow-sm"
                  >
                    <CardBody>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <Typography variant="h6" color="blue-gray">
                            {goal.title}
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-blue-gray-600"
                          >
                            Target: {goal.target}
                          </Typography>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            goal.status === "completed"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          {goal.status === "completed"
                            ? "Completed"
                            : "In progress"}
                        </span>
                      </div>

                      <Chart
                        type="donut"
                        height={220}
                        series={donutSeries}
                        options={{
                          labels: ["Completed days", "Remaining days"],
                          colors: ["#22c55e", "#94a3b8"],
                          legend: { show: false },
                          dataLabels: {
                            formatter: (val: number) => `${val.toFixed(1)}%`,
                          },
                          plotOptions: {
                            pie: {
                              donut: {
                                size: "65%",
                                labels: {
                                  show: true,
                                  total: {
                                    show: true,
                                    label: "Progress",
                                    formatter: () =>
                                      `${goal.completion_percent}%`,
                                  },
                                },
                              },
                            },
                          },
                        }}
                      />

                      <div className="mt-4 flex items-center justify-between text-sm text-blue-gray-600">
                        <span>
                          {completed}/{goal.frequency} days logged
                        </span>
                        <span>
                          {goal.today_completed
                            ? "Logged today"
                            : "Pending today"}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
              <Card>
                <CardBody
                  className="flex flex-col gap-3 justify-center items-center h-full"
                  onClick={openGoalTrackingModal}
                >
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    className="text-[100px]"
                  />
                  Add Today's Progress
                </CardBody>
              </Card>
            </div>
          ) : (
            <Card className="mt-6 border border-blue-gray-100 shadow-sm">
              <CardBody>
                <NothingToShow />
              </CardBody>
            </Card>
          )}
        </div>
      </div>
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
            {patient_data.upcoming_appointments.length ? (
              patient_data.upcoming_appointments.map(
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
              )
            ) : (
              <NothingToShow />
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
            {patient_data.doctor_responses.length ? (
              patient_data.doctor_responses.map(
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
              )
            ) : (
              <NothingToShow />
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
            <Typography variant="small" className="text-blue-gray-600">
              Completed {patient_data.stats.completed_goals}/
              {patient_data.stats.total_goals}
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
                {patient_data.goals_from_doctors.length ? (
                  patient_data.goals_from_doctors.map(
                    (
                      { goal_id, doctor, doctor_img, goal, due, status },
                      index
                    ) => (
                      <tr key={goal_id || index}>
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
                  )
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <NothingToShow />
                    </td>
                  </tr>
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

interface GoalTrackingEntryFormProps {
  goals: GoalProgress[];
  resolver: any;
  onSuccess: () => Promise<void> | void;
}

function GoalTrackingEntryForm({
  goals,
  resolver,
  onSuccess,
}: GoalTrackingEntryFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ goal_id: string; value: string }>({
    defaultValues: {
      goal_id: goals[0]?.goal_id ?? "",
      value: goals[0]?.target ?? "",
    },
  });

  if (!goals.length) {
    return (
      <div className="w-[320px]">
        <NothingToShow />
        <Typography className="text-center mt-3 text-blue-gray-600">
          No goals available
        </Typography>
      </div>
    );
  }

  const onSubmit = async (values: { goal_id: string; value?: string }) => {
    if (!values.goal_id) {
      return;
    }
    try {
      await createGoalTrackingEntry(values.goal_id, {
        value: values.value?.trim() || undefined,
      });
      alert("Goal progress logged!");
      await onSuccess();
      resolver();
    } catch (error: any) {
      alert(error?.message || "Unable to log goal progress");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="block mb-1 font-medium text-sm text-blue-gray-700">
          Goal
        </label>
        <Controller
          name="goal_id"
          control={control}
          rules={{ required: "Goal is required" }}
          render={({ field }) => (
            <select
              {...field}
              className="w-full border border-blue-gray-100 rounded-lg px-3 py-2"
            >
              <option value="">Select goal</option>
              {goals.map((goal) => (
                <option key={goal.goal_id} value={goal.goal_id}>
                  {goal.title} ({goal.completed_days}/{goal.frequency})
                </option>
              ))}
            </select>
          )}
        />
        {errors.goal_id && (
          <p className="text-red-500 text-sm">
            {String(errors.goal_id.message)}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium text-sm text-blue-gray-700">
          Value (optional)
        </label>
        <Controller
          name="value"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full border border-blue-gray-100 rounded-lg px-3 py-2"
              placeholder="e.g. 9,800 steps"
            />
          )}
        />
      </div>

      <Button
        type="submit"
        color="blue"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Entry"}
      </Button>
    </form>
  );
}
