import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Typography,
  Chip,
  Button,
  Input,
} from "@material-tailwind/react";

import { ClockIcon } from "@heroicons/react/24/solid";
import {
  BoltIcon,
  HeartIcon as OutlineHeartIcon,
  MoonIcon,
  QueueListIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsChart } from "@/widgets/charts";
import { chartsConfig } from "@/configs";
import { useEffect, useState } from "react";
import type { ApexOptions } from "apexcharts";
import {
  createPatientGoal,
  createPatientPrescription,
  getPatientProfile,
  postPatientConversation,
} from "@/services/patient.service";
import { VModal } from "@/utils/VModal";
import { Controller, useForm } from "react-hook-form";
import { NothingToShow } from "@/components/misc/NothingToShow";
import { Loader } from "@/components/misc/Loader";

interface PatientData {
  patient: {
    id: string;
    name: string;
    avatar: string;
    gender: string;
    age: number;
    blood_group: string;
    doctor: string;
  };
  upcoming_appointment: {
    date: string;
    time: string;
    doctor: string;
    department: string;
  };
  charts: Array<{
    title: string;
    description: string;
    footer: string;
    series: number[];
    color?: string;
    x?: string[];
  }>;
  conversations: Array<{
    id: string;
    sender: string;
    name: string;
    avatar: string;
    message: string;
    time: string;
  }>;
  goals: Array<{
    id: string;
    title: string;
    target?: string;
    status: string;
    due_date: string;
  }>;
  prescriptions: Array<{
    id: string;
    medicine?: string;
    dosage: string;
    days?: string;
    doctor?: string;
    date?: string;
  }>;
}

const formatTimestamp = (value: string) =>
  new Date(value).toLocaleString([], { hour: "2-digit", minute: "2-digit" });

const makeChart = (item: {
  title: string;
  series: number[];
  color?: string;
  x?: string[];
}): {
  type: "line";
  height: number;
  series: Array<{ name: string; data: number[] }>;
  options: ApexOptions;
} => ({
  type: "line" as const,
  height: 220,
  series: [{ name: item.title, data: item.series }],
  options: {
    ...chartsConfig,
    colors: [item.color || "#3b82f6"],
    stroke: { lineCap: "round" as const },
    markers: { size: 5 },
    xaxis: { ...chartsConfig.xaxis, categories: item.x || [] },
  },
});

const goalTypeOptions = [
  { value: "Daily Steps", label: "Daily Steps", icon: ArrowTrendingUpIcon },
  { value: "Sleep Duration", label: "Sleep Duration", icon: MoonIcon },
  { value: "Heart Rate", label: "Heart Rate", icon: OutlineHeartIcon },
  { value: "Blood Count", label: "Blood Count", icon: QueueListIcon },
  { value: "Energy Level", label: "Energy Level", icon: BoltIcon },
];

export function PatientPrescription({ patientId }: { patientId?: string }) {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [doctorMessage, setDoctorMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async (id: string) => {
    try {
      setLoading(true);
      const data = await getPatientProfile(id);
      setPatientData(data);
      setError(null);
      setDoctorMessage("");
    } catch (err: any) {
      setError(err.message || "Unable to load patient data");
      setPatientData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!patientId) {
      setPatientData(null);
      setLoading(false);
      return;
    }
    loadProfile(patientId);
  }, [patientId]);

  const sendDoctorMessage = async () => {
    if (!doctorMessage.trim() || !patientId) return;
    try {
      setSendingMessage(true);
      const response = await postPatientConversation(patientId, {
        message: doctorMessage.trim(),
      });
      if (response?.conversation) {
        setPatientData((prev) =>
          prev
            ? {
                ...prev,
                conversations: [...prev.conversations, response.conversation],
              }
            : prev
        );
      }
      setDoctorMessage("");
    } catch (err) {
      console.error("Failed to send message", err);
      alert("Unable to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const openGoalModal = async () => {
    if (!patientId) return;
    await VModal({
      title: "Assign Goal",
      body: (resolver) => (
        <GoalForm
          patientId={patientId}
          resolver={resolver}
          onCreated={() => loadProfile(patientId)}
        />
      ),
      footer: () => <></>,
    });
  };

  const openPrescriptionModal = async () => {
    if (!patientId) return;
    await VModal({
      title: "Add Prescription",
      body: (resolver) => (
        <PrescriptionForm
          patientId={patientId}
          resolver={resolver}
          onCreated={() => loadProfile(patientId)}
        />
      ),
      footer: () => <></>,
    });
  };

  if (loading) {
    return <Loader message="Loading patient profile..." />;
  }

  if (error) {
    return (
      <Card className="mb-6 border border-red-200 bg-red-50">
        <CardBody>
          <Typography color="red">{error}</Typography>
        </CardBody>
      </Card>
    );
  }

  if (!patientData) {
    return (
      <div className="mt-6">
        <NothingToShow />
        <Typography className="text-center text-blue-gray-600 mt-3">
          Select a patient to view their profile.
        </Typography>
      </div>
    );
  }

  return (
    <>
      <Card className="mb-6 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={patientData.patient.avatar}
                alt={patientData.patient.name}
                title={patientData.patient.name}
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {patientData.patient.name}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {patientData.patient.gender} • {patientData.patient.age} yrs •
                  Blood {patientData.patient.blood_group}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  Consulting: {patientData.patient.doctor}
                </Typography>
              </div>
            </div>
          </div>

          <Card className="mb-10 bg-blue-gray-50 shadow-sm">
            <CardBody>
              <Typography variant="h6" className="mb-2 text-blue-gray-800">
                Upcoming Appointment
              </Typography>

              <div className="flex flex-col gap-2">
                <Typography variant="small">
                  <b>Date:</b> {patientData.upcoming_appointment.date}
                </Typography>

                <Typography variant="small">
                  <b>Time:</b> {patientData.upcoming_appointment.time}
                </Typography>

                <Typography variant="small">
                  <b>Doctor:</b> {patientData.upcoming_appointment.doctor}
                </Typography>

                <Typography variant="small">
                  <b>Department:</b>{" "}
                  {patientData.upcoming_appointment.department}
                </Typography>
              </div>
            </CardBody>
          </Card>

          <div className="mb-12 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Typography variant="h6" color="blue-gray">
                Health Monitor
              </Typography>
            </div>

            {patientData.charts.length ? (
              <div className="grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
                {patientData.charts.map((chart, index) => (
                  <StatisticsChart
                    key={chart.title + index}
                    color="white"
                    title={chart.title}
                    description={chart.description}
                    footer={
                      <Typography
                        variant="small"
                        className="flex items-center font-normal text-blue-gray-600"
                      >
                        <ClockIcon className="h-4 w-4 text-blue-gray-400" />
                        &nbsp;{chart.footer}
                      </Typography>
                    }
                    chart={makeChart(chart)}
                  />
                ))}
              </div>
            ) : (
              <Typography variant="small" color="blue-gray">
                No tracking data available yet.
              </Typography>
            )}
          </div>

          <Card className="mb-12">
            <CardHeader variant="gradient" color="blue" className="p-6">
              <Typography variant="h6" color="white">
                Conversation
              </Typography>
            </CardHeader>

            <CardBody className="px-4">
              <div className="flex flex-col gap-6 mb-6">
                {patientData.conversations.length ? (
                  patientData.conversations.map((msg, i: number) => (
                    <div
                      key={`${msg.id}-${i}`}
                      className={`flex gap-3 ${
                        msg.sender === "doctor"
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <Avatar
                        src={msg.avatar}
                        size="sm"
                        title={msg.name}
                        alt={msg.sender}
                      />

                      <div className="bg-blue-gray-50 p-3 rounded-lg max-w-sm shadow-sm">
                        <Typography className="text-blue-gray-800 text-sm">
                          {msg.message}
                        </Typography>
                        <Typography
                          variant="small"
                          className="text-blue-gray-500 mt-1 text-xs"
                        >
                          {formatTimestamp(msg.time)}
                        </Typography>
                      </div>
                    </div>
                  ))
                ) : (
                  <NothingToShow />
                )}
              </div>

              <div className="flex gap-3 items-center">
                <Input
                  value={doctorMessage}
                  onChange={(e) => setDoctorMessage(e.target.value)}
                  label="Doctor Message"
                  className="flex-1"
                  disabled={sendingMessage}
                  crossOrigin={undefined}
                />

                <Button
                  color="blue"
                  onClick={sendDoctorMessage}
                  disabled={sendingMessage || !doctorMessage.trim()}
                >
                  {sendingMessage ? "Sending..." : "Send"}
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="mb-12">
            <CardHeader
              variant="gradient"
              color="gray"
              className="mb-8 p-6 flex items-center justify-between"
            >
              <Typography variant="h6" color="white">
                Goals
              </Typography>
              <Button
                size="sm"
                color="white"
                variant="text"
                onClick={openGoalModal}
              >
                + Assign Goal
              </Button>
            </CardHeader>

            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Goal", "Target", "Status", "Due Date"].map((h) => (
                      <th
                        key={h}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {h}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {patientData.goals.length ? (
                    patientData.goals.map((g) => (
                      <tr key={g.id}>
                        <td className="py-3 px-5">{g.title}</td>
                        <td className="py-3 px-5">{g.target}</td>
                        <td className="py-3 px-5">
                          <Chip
                            variant="gradient"
                            color={g.status === "completed" ? "green" : "blue"}
                            value={g.status}
                          />
                        </td>
                        <td className="py-3 px-5">{g.due_date}</td>
                      </tr>
                    ))
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

          <Card>
            <CardHeader
              variant="gradient"
              color="gray"
              className="mb-8 p-6 flex items-center justify-between"
            >
              <Typography variant="h6" color="white">
                Prescriptions
              </Typography>
              <Button
                size="sm"
                color="white"
                variant="text"
                onClick={openPrescriptionModal}
              >
                + Add Prescription
              </Button>
            </CardHeader>

            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Medicine", "Dosage", "Days", "Doctor", "Date"].map(
                      (h) => (
                        <th
                          key={h}
                          className="border-b border-blue-gray-50 py-3 px-5 text-left"
                        >
                          <Typography
                            variant="small"
                            className="text-[11px] font-bold uppercase text-blue-gray-400"
                          >
                            {h}
                          </Typography>
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {patientData.prescriptions.length ? (
                    patientData.prescriptions.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 px-5">{p.medicine}</td>
                        <td className="py-3 px-5">{p.dosage}</td>
                        <td className="py-3 px-5">{p.days}</td>
                        <td className="py-3 px-5">{p.doctor}</td>
                        <td className="py-3 px-5">{p.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <NothingToShow />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </>
  );
}

type GoalFormValues = {
  target_type: string;
  goal_target_value: string;
  frequency: number;
};

function GoalForm({
  patientId,
  resolver,
  onCreated,
}: {
  patientId: string;
  resolver: any;
  onCreated: () => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    defaultValues: {
      target_type: "",
      goal_target_value: "",
      frequency: 30,
    },
  });

  const onSubmit = async (values: GoalFormValues) => {
    try {
      await createPatientGoal(patientId, {
        target_type: values.target_type,
        goal_target_value: values.goal_target_value,
        frequency: Number(values.frequency),
      });
      alert("Goal created successfully");
      onCreated();
      resolver();
    } catch (error: any) {
      alert(error.message || "Unable to create goal");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div>
        <label className="block mb-1 font-medium">Goal Type</label>
        <Controller
          name="target_type"
          control={control}
          rules={{ required: "Goal type is required" }}
          render={({ field }) => (
            <>
              <input type="hidden" {...field} />
              <div className="grid grid-cols-2 gap-3">
                {goalTypeOptions.map((option) => {
                  const Icon = option.icon;
                  const selected = field.value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      disabled={isSubmitting}
                      className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
                        selected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-blue-gray-100 hover:border-blue-300"
                      } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        />
        {errors.target_type && (
          <p className="text-red-500 text-sm">
            {String(errors.target_type.message)}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Target</label>
        <Controller
          name="goal_target_value"
          control={control}
          rules={{ required: "Target is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              disabled={isSubmitting}
              className="w-full border px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="e.g. 10,000 steps"
            />
          )}
        />
        {errors.goal_target_value && (
          <p className="text-red-500 text-sm">
            {String(errors.goal_target_value.message)}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Duration (days)</label>
        <Controller
          name="frequency"
          control={control}
          rules={{ required: "Duration is required", min: 1 }}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              min={1}
              disabled={isSubmitting}
              className="w-full border px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            />
          )}
        />
        {errors.frequency && (
          <p className="text-red-500 text-sm">
            {String(errors.frequency.message)}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg mt-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Assigning Goal...
          </>
        ) : (
          "Assign Goal"
        )}
      </button>
    </form>
  );
}

type PrescriptionFormValues = {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
};

function PrescriptionForm({
  patientId,
  resolver,
  onCreated,
}: {
  patientId: string;
  resolver: any;
  onCreated: () => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PrescriptionFormValues>({
    defaultValues: {
      medicine: "",
      dosage: "",
      frequency: "",
      duration: "",
      notes: "",
    },
  });

  const onSubmit = async (values: PrescriptionFormValues) => {
    try {
      await createPatientPrescription(patientId, values);
      alert("Prescription added successfully");
      onCreated();
      resolver();
    } catch (error: any) {
      alert(error.message || "Unable to add prescription");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-h-[300px] overflow-y-auto"
    >
      <div>
        <label className="block mb-1 font-medium">Medicine</label>
        <Controller
          name="medicine"
          control={control}
          rules={{ required: "Medicine is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              disabled={isSubmitting}
              className="w-full border px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="e.g. Metformin 500mg"
            />
          )}
        />
        {errors.medicine && (
          <p className="text-red-500 text-sm">{errors.medicine.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Dosage</label>
        <Controller
          name="dosage"
          control={control}
          rules={{ required: "Dosage is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              disabled={isSubmitting}
              className="w-full border px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="1 tablet"
            />
          )}
        />
        {errors.dosage && (
          <p className="text-red-500 text-sm">{errors.dosage.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Frequency</label>
        <Controller
          name="frequency"
          control={control}
          rules={{ required: "Frequency is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              disabled={isSubmitting}
              className="w-full border px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Twice daily"
            />
          )}
        />
        {errors.frequency && (
          <p className="text-red-500 text-sm">{errors.frequency.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Duration</label>
        <Controller
          name="duration"
          control={control}
          rules={{ required: "Duration is required" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              disabled={isSubmitting}
              className="w-full border px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="30 days"
            />
          )}
        />
        {errors.duration && (
          <p className="text-red-500 text-sm">{errors.duration.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Notes (optional)</label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              disabled={isSubmitting}
              className="w-full border px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              rows={3}
              placeholder="Any instructions for the patient"
            />
          )}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg sticky bottom-0 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Saving Prescription...
          </>
        ) : (
          "Save Prescription"
        )}
      </Button>
    </form>
  );
}
