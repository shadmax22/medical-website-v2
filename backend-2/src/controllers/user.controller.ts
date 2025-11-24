import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db";

export async function getUsers(request: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.user.findMany();
  return reply.send(users);
}

export async function getPatientDashboardData(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;

  try {
    const patient = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        goals: {
          include: { doctor: { include: { user: true } } },
        },
        assigned_doctors: {
          include: { user: true },
        },
      },
    });

    if (!patient) {
      return reply.status(404).send({ message: "Patient not found" });
    }

    const upcomingAppointments = await prisma.appointment.findMany({
      where: { patient_id: patient.id, appointment_date: { gte: new Date() } },
      orderBy: { appointment_date: "asc" },
      take: 5,
      include: { doctor: { include: { user: true } } },
    });

    const doctorResponses = await prisma.conversation.findMany({
      where: { patient_id: patient.id, sender_role: "doctor" },
      orderBy: { created_at: "desc" },
      take: 5,
      include: { doctor: { include: { user: true } } },
    });

    const goalIds = patient.goals.map((goal) => goal.id);
    const goalTrackings = goalIds.length
      ? await prisma.goalTracking.findMany({
          where: { goal_id: { in: goalIds } },
          select: { goal_id: true, entry_date: true },
        })
      : [];

    const totalMap = new Map<string, number>();
    const todayMap = new Map<string, number>();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    for (const tracking of goalTrackings) {
      totalMap.set(tracking.goal_id, (totalMap.get(tracking.goal_id) ?? 0) + 1);
      if (tracking.entry_date >= todayStart) {
        todayMap.set(
          tracking.goal_id,
          (todayMap.get(tracking.goal_id) ?? 0) + 1
        );
      }
    }

    const goal_progress = patient.goals.map((goal) => {
      const completedDaysRaw = totalMap.get(goal.id) ?? 0;
      const completed_days = Math.min(completedDaysRaw, goal.frequency);
      const remaining_days = Math.max(goal.frequency - completed_days, 0);
      const completion_percent = goal.frequency
        ? Number(((completed_days / goal.frequency) * 100).toFixed(2))
        : 0;
      const dueDate = new Date(goal.created_at);
      dueDate.setDate(dueDate.getDate() + goal.frequency);

      return {
        goal_id: goal.id,
        title: goal.target_type,
        target: goal.goal_target_value,
        frequency: goal.frequency,
        completed_days,
        remaining_days,
        completion_percent,
        status: completed_days >= goal.frequency ? "completed" : "active",
        today_completed: (todayMap.get(goal.id) ?? 0) > 0,
        doctor: goal.doctor.user.name,
        due_date: dueDate.toLocaleDateString(),
      };
    });

    const goals_from_doctors = goal_progress.map((goal) => ({
      goal_id: goal.goal_id,
      doctor: goal.doctor,
      doctor_img: "/img/team-1.jpeg",
      goal: `${goal.title}: ${goal.target}`,
      due: goal.due_date,
      status: goal.status,
    }));

    return reply.send({
      patient: {
        name: patient.name,
        age: new Date().getFullYear() - new Date(patient.dob).getFullYear(),
        gender: "N/A",
        img: "/img/bruce-mars.jpeg",
      },
      stats: {
        total_goals: goal_progress.length,
        total_responses: doctorResponses.length,
        upcoming_appointments: upcomingAppointments.length,
        completed_goals: goal_progress.filter(
          (goal) => goal.status === "completed"
        ).length,
      },
      upcoming_appointments: upcomingAppointments.map((appointment) => ({
        doctor: appointment.doctor.user.name,
        date: appointment.appointment_date.toLocaleDateString(),
        time: appointment.appointment_date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        department: appointment.department,
        img: "/img/team-1.jpeg",
      })),
      doctor_responses: doctorResponses.map((response) => ({
        doctor: response.doctor.user.name,
        img: "/img/team-1.jpeg",
        message: response.message,
        time: response.created_at.toLocaleString(),
      })),
      goals_from_doctors,
      goal_progress,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "Error fetching patient dashboard data", error });
  }
}
