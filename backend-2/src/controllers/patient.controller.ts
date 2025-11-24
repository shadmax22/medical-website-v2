import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db";

async function getDoctorForUser(userId: string) {
  return prisma.doctor.findUnique({
    where: { user_id: userId },
    include: { patients: { select: { id: true } } },
  });
}

function formatConversationPayload(conversation: any, patientName: string) {
  const isDoctor = conversation.sender_role === "doctor";
  return {
    id: conversation.id,
    sender: conversation.sender_role,
    name: isDoctor ? conversation.doctor.user.name : patientName,
    avatar: isDoctor ? "/img/team-1.jpeg" : "/img/bruce-mars.jpeg",
    message: conversation.message,
    time: conversation.created_at,
  };
}

export async function assignDoctorsToPatient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { patient_id, doctor_ids } = request.body as {
    patient_id: string;
    doctor_ids: string[];
  };

  if (!patient_id || !doctor_ids || !Array.isArray(doctor_ids)) {
    return reply
      .status(400)
      .send({ message: "Patient ID and doctor IDs array are required" });
  }

  try {
    const patient = await prisma.user.findUnique({ where: { id: patient_id } });
    if (!patient) {
      return reply.status(404).send({ message: "Patient not found" });
    }

    const doctors = await prisma.doctor.findMany({
      where: { id: { in: doctor_ids } },
    });

    if (doctors.length !== doctor_ids.length) {
      return reply
        .status(404)
        .send({ message: "One or more doctors not found" });
    }

    await prisma.user.update({
      where: { id: patient_id },
      data: {
        assigned_doctors: {
          connect: doctor_ids.map((id) => ({ id })),
        },
      },
    });

    return reply.send({
      message: "Doctors assigned successfully",
      assigned_count: doctor_ids.length,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Error assigning doctors",
      error: (error as any).message,
    });
  }
}

export async function getDoctorPatients(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authUser = (request as any).user;

  if (authUser.role !== "doctor") {
    return reply
      .status(403)
      .send({ message: "Only doctors can access patient panel" });
  }

  try {
    const doctor = await getDoctorForUser(authUser.id);
    if (!doctor) {
      return reply.status(404).send({ message: "Doctor profile not found" });
    }

    const patients = doctor.patients.map((patient) => ({
      id: patient.id,
      name: patient.name,
      issue: patient.current_issue || "General Care",
    }));

    return reply.send({ patients });
  } catch (error) {
    return reply.status(500).send({
      message: "Error fetching patients",
      error: (error as any).message,
    });
  }
}

export async function getPatientProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { patientId } = request.params as { patientId: string };
  const authUser = (request as any).user;

  try {
    const patient = await prisma.user.findUnique({
      where: { id: patientId },
      include: {
        assigned_doctors: {
          include: { user: true },
        },
        goals: {
          include: {
            doctor: {
              include: { user: true },
            },
          },
        },
      },
    });

    if (!patient) {
      return reply.status(404).send({ message: "Patient not found" });
    }

    if (authUser.role === "doctor") {
      const doctor = await getDoctorForUser(authUser.id);
      if (!doctor) {
        return reply.status(403).send({ message: "Doctor profile missing" });
      }

      const isAssigned = doctor.patients.some(
        (assigned) => assigned.id === patientId
      );
      if (!isAssigned) {
        return reply
          .status(403)
          .send({ message: "You are not assigned to this patient" });
      }
    } else if (authUser.role === "user" && authUser.id !== patientId) {
      return reply
        .status(403)
        .send({ message: "Unauthorized to view this patient" });
    }

    const upcomingAppointment = await prisma.appointment.findFirst({
      where: { patient_id: patientId, appointment_date: { gte: new Date() } },
      orderBy: { appointment_date: "asc" },
      include: { doctor: { include: { user: true } } },
    });

    const conversations = await prisma.conversation.findMany({
      where: { patient_id: patientId },
      orderBy: { created_at: "asc" },
      include: { doctor: { include: { user: true } } },
    });

    const prescriptions = await prisma.prescription.findMany({
      where: { patient_id: patientId },
      orderBy: { created_at: "desc" },
      include: { doctor: { include: { user: true } } },
    });

    const trackingEntries = await prisma.tracking.findMany({
      where: { user_id: patientId },
      orderBy: { created_at: "asc" },
    });

    const chartPalette = ["#0288d1", "#ef5350", "#26a69a", "#ab47bc"];
    const chartMap = new Map<
      string,
      { title: string; entries: typeof trackingEntries }
    >();

    for (const entry of trackingEntries) {
      const [title = entry.tracking_type_unit] =
        entry.tracking_type_unit.split("|");
      if (!chartMap.has(title)) {
        chartMap.set(title, { title, entries: [] });
      }
      chartMap.get(title)!.entries.push(entry);
    }

    const charts = Array.from(chartMap.values()).map((chart, index) => ({
      title: chart.title,
      description: `Last ${chart.entries.length} records`,
      footer: chart.entries.length
        ? `Updated on ${chart.entries[
            chart.entries.length - 1
          ].created_at.toLocaleDateString()}`
        : "No data",
      series: chart.entries.map((entry) => Number(entry.value)),
      x: chart.entries.map((entry) =>
        entry.created_at.toLocaleDateString("en-US", { weekday: "short" })
      ),
      color: chartPalette[index % chartPalette.length],
    }));

    const formattedConversations = conversations.map((conversation) =>
      formatConversationPayload(conversation, patient.name)
    );

    const formattedPrescriptions = prescriptions.map((prescription) => ({
      id: prescription.id,
      medicine: prescription.medicine,
      dosage: `${prescription.dosage} • ${prescription.frequency}`,
      days: prescription.duration,
      doctor: prescription.doctor.user.name,
      date: prescription.created_at.toLocaleDateString(),
    }));

    const goals = patient.goals.map((goal) => {
      const dueDate = new Date(goal.created_at);
      dueDate.setDate(dueDate.getDate() + goal.frequency);
      return {
        id: goal.id,
        title: goal.target_type,
        target: goal.goal_target_value,
        status: "active",
        due_date: dueDate.toLocaleDateString(),
      };
    });

    const primaryDoctor = patient.assigned_doctors[0];

    return reply.send({
      patient: {
        id: patient.id,
        name: patient.name,
        avatar: "/img/bruce-mars.jpeg",
        gender: "N/A",
        age: new Date().getFullYear() - new Date(patient.dob).getFullYear(),
        blood_group: "N/A",
        doctor: primaryDoctor ? primaryDoctor.user.name : "Not assigned",
      },
      upcoming_appointment: upcomingAppointment
        ? {
            date: upcomingAppointment.appointment_date.toLocaleDateString(),
            time: upcomingAppointment.appointment_date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            doctor: upcomingAppointment.doctor.user.name,
            department: upcomingAppointment.department,
          }
        : {
            date: "Not scheduled",
            time: "-",
            doctor: "Not assigned",
            department: "-",
          },
      charts,
      conversations: formattedConversations,
      goals,
      prescriptions: formattedPrescriptions,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Error fetching patient profile",
      error: (error as any).message,
    });
  }
}

export async function getPatientConversations(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { patientId } = request.params as { patientId: string };
  const authUser = (request as any).user;

  try {
    const patient = await prisma.user.findUnique({ where: { id: patientId } });
    if (!patient) {
      return reply.status(404).send({ message: "Patient not found" });
    }

    if (authUser.role === "doctor") {
      const doctor = await getDoctorForUser(authUser.id);
      if (!doctor) {
        return reply.status(403).send({ message: "Doctor profile missing" });
      }

      const isAssigned = doctor.patients.some(
        (assigned) => assigned.id === patientId
      );
      if (!isAssigned) {
        return reply
          .status(403)
          .send({ message: "You are not assigned to this patient" });
      }
    } else if (authUser.role === "user" && authUser.id !== patientId) {
      return reply
        .status(403)
        .send({ message: "Unauthorized to view this patient" });
    }

    const conversations = await prisma.conversation.findMany({
      where: { patient_id: patientId },
      orderBy: { created_at: "asc" },
      include: { doctor: { include: { user: true } } },
    });

    return reply.send({
      conversations: conversations.map((conversation) =>
        formatConversationPayload(conversation, patient.name)
      ),
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Error fetching conversations",
      error: (error as any).message,
    });
  }
}

export async function createPatientConversation(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { patientId } = request.params as { patientId: string };
  const { message } = request.body as { message: string };
  const authUser = (request as any).user;

  if (!message || !message.trim()) {
    return reply.status(400).send({ message: "Message is required" });
  }

  if (authUser.role !== "doctor") {
    return reply
      .status(403)
      .send({ message: "Only doctors can start conversations for now" });
  }

  try {
    const doctor = await getDoctorForUser(authUser.id);
    if (!doctor) {
      return reply.status(403).send({ message: "Doctor profile missing" });
    }

    const isAssigned = doctor.patients.some(
      (assigned) => assigned.id === patientId
    );
    if (!isAssigned) {
      return reply
        .status(403)
        .send({ message: "You are not assigned to this patient" });
    }

    const conversation = await prisma.conversation.create({
      data: {
        patient_id: patientId,
        doctor_id: doctor.id,
        sender_role: "doctor",
        message: message.trim(),
      },
      include: { doctor: { include: { user: true } }, patient: true },
    });

    return reply.status(201).send({
      conversation: formatConversationPayload(
        conversation,
        conversation.patient.name
      ),
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Error creating conversation",
      error: (error as any).message,
    });
  }
}

export async function createPatientGoal(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { patientId } = request.params as { patientId: string };
  const { target_type, goal_target_value, frequency } = request.body as {
    target_type: string;
    goal_target_value: string;
    frequency: number;
  };
  const authUser = (request as any).user;

  if (!target_type || !goal_target_value || !frequency) {
    return reply.status(400).send({
      message: "target_type, goal_target_value and frequency are required",
    });
  }

  if (authUser.role !== "doctor") {
    return reply.status(403).send({ message: "Only doctors can create goals" });
  }

  try {
    const doctor = await getDoctorForUser(authUser.id);
    if (!doctor) {
      return reply.status(403).send({ message: "Doctor profile missing" });
    }

    const isAssigned = doctor.patients.some(
      (assigned) => assigned.id === patientId
    );
    if (!isAssigned) {
      return reply
        .status(403)
        .send({ message: "You are not assigned to this patient" });
    }

    const goal = await prisma.goal.create({
      data: {
        user_id: patientId,
        doctor_id: doctor.id,
        goal_target_value,
        target_type,
        frequency: Number(frequency),
      },
    });

    return reply.status(201).send({ goal });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Error creating goal", error: (error as any).message });
  }
}

export async function createPatientPrescription(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { patientId } = request.params as { patientId: string };
  const { medicine, dosage, frequency, duration, notes } = request.body as {
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  };
  const authUser = (request as any).user;

  if (!medicine || !dosage || !frequency || !duration) {
    return reply.status(400).send({
      message: "medicine, dosage, frequency and duration are required",
    });
  }

  if (authUser.role !== "doctor") {
    return reply
      .status(403)
      .send({ message: "Only doctors can add prescriptions" });
  }

  try {
    const doctor = await getDoctorForUser(authUser.id);
    if (!doctor) {
      return reply.status(403).send({ message: "Doctor profile missing" });
    }

    const isAssigned = doctor.patients.some(
      (assigned) => assigned.id === patientId
    );
    if (!isAssigned) {
      return reply
        .status(403)
        .send({ message: "You are not assigned to this patient" });
    }

    const prescription = await prisma.prescription.create({
      data: {
        patient_id: patientId,
        doctor_id: doctor.id,
        medicine,
        dosage,
        frequency,
        duration,
        notes,
      },
      include: { doctor: { include: { user: true } } },
    });

    return reply.status(201).send({
      prescription: {
        id: prescription.id,
        medicine: prescription.medicine,
        dosage: `${prescription.dosage} • ${prescription.frequency}`,
        days: prescription.duration,
        doctor: prescription.doctor.user.name,
        date: prescription.created_at.toLocaleDateString(),
      },
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Error creating prescription",
      error: (error as any).message,
    });
  }
}

export async function createGoalTrackingEntry(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { goalId } = request.params as { goalId: string };
  const { value } = request.body as { value?: string };
  const authUser = (request as any).user;

  if (authUser.role !== "patient") {
    return reply
      .status(403)
      .send({ message: "Only patients can log goal progress" });
  }

  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      return reply.status(404).send({ message: "Goal not found" });
    }

    if (goal.user_id !== authUser.id) {
      return reply
        .status(403)
        .send({ message: "You cannot update someone else's goal" });
    }

    const existingCount = await prisma.goalTracking.count({
      where: { goal_id: goalId },
    });
    if (existingCount >= goal.frequency) {
      return reply.status(400).send({ message: "Goal already completed" });
    }

    const entry = await prisma.goalTracking.create({
      data: {
        goal_id: goalId,
        user_id: authUser.id,
        value: value ?? goal.goal_target_value,
      },
    });

    const completedDays = existingCount + 1;
    const remainingDays = Math.max(goal.frequency - completedDays, 0);
    const status = completedDays >= goal.frequency ? "completed" : "active";

    return reply.status(201).send({
      entry,
      progress: {
        completed_days: completedDays,
        remaining_days: remainingDays,
        status,
      },
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Error logging goal progress",
      error: (error as any).message,
    });
  }
}
