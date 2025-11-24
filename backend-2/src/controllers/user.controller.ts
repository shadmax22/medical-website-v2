import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db";

export async function getUsers(request: FastifyRequest, reply: FastifyReply) {
    const users = await prisma.user.findMany();
    return reply.send(users);
}

export async function getPatientDashboardData(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;

    try {
        const patient = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                goals: {
                    include: { doctor: { include: { user: true } } }
                },
                assigned_doctors: {
                    include: { user: true }
                }
            }
        });

        if (!patient) {
            return reply.status(404).send({ message: "Patient not found" });
        }

        const upcoming_appointments = [
            {
                doctor: "Dr. Ritesh Sharma",
                date: "25 Nov 2025",
                time: "03:30 PM",
                department: "Cardiology",
                img: "/img/team-1.jpeg",
            },
            {
                doctor: "Dr. Meera Patel",
                date: "28 Nov 2025",
                time: "11:00 AM",
                department: "Dermatology",
                img: "/img/team-2.jpeg",
            }
        ];

        const doctor_responses = [
            {
                doctor: "Dr. Ritesh",
                img: "/img/team-1.jpeg",
                message: "Increase water intake and avoid heavy lifting this week.",
                time: "Yesterday",
            }
        ];

        const goals_from_doctors = patient.goals.map(g => ({
            doctor: g.doctor.user.name,
            doctor_img: "/img/team-1.jpeg",
            goal: `${g.target_type} target: ${g.goal_target_value}`,
            due: "20 Dec 2025", // Placeholder
            status: "active"
        }));

        return reply.send({
            patient: {
                name: patient.name,
                age: new Date().getFullYear() - new Date(patient.dob).getFullYear(),
                gender: "Male", // Placeholder
                img: "/img/bruce-mars.jpeg"
            },
            stats: {
                total_goals: patient.goals.length,
                total_responses: doctor_responses.length,
                upcoming_appointments: upcoming_appointments.length
            },
            upcoming_appointments,
            doctor_responses,
            goals_from_doctors
        });

    } catch (error) {
        return reply.status(500).send({ message: "Error fetching patient dashboard data", error });
    }
}
