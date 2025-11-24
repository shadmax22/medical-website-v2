import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../db";

export async function getAdminDashboardData(request: FastifyRequest, reply: FastifyReply) {
    try {
        const total_doctors = await prisma.doctor.count();
        const total_patients = await prisma.user.count({ where: { role: 'user' } });

        // Active patients: Updated in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const active_patients = await prisma.user.count({
            where: {
                role: 'user',
                updated_at: { gte: thirtyDaysAgo }
            }
        });

        // Doctors List
        const doctors = await prisma.doctor.findMany({
            include: { user: true },
            take: 5,
            orderBy: { created_at: 'desc' }
        });

        const formattedDoctors = doctors.map(d => ({
            name: d.user.name,
            specialization: d.specialization,
            email: d.user.email_id,
            img: "/img/team-1.jpeg" // Placeholder
        }));

        // Patients List
        const patients = await prisma.user.findMany({
            where: { role: 'user' },
            take: 10,
            orderBy: { created_at: 'desc' }
        });

        const formattedPatients = patients.map(p => ({
            name: p.name,
            issue: p.current_issue || "General Checkup",
            email: p.email_id,
            img: "/img/bruce-mars.jpeg" // Placeholder
        }));

        // Recent Patients (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recent_patients_list = await prisma.user.findMany({
            where: {
                role: 'user',
                created_at: { gte: sevenDaysAgo }
            },
            take: 5,
            orderBy: { created_at: 'desc' }
        });

        const formattedRecentPatients = recent_patients_list.map(p => ({
            name: p.name,
            age: new Date().getFullYear() - new Date(p.dob).getFullYear(),
            img: "/img/team-1.jpeg", // Placeholder
            date: p.created_at.toLocaleDateString()
        }));

        return reply.send({
            stats: {
                total_doctors,
                total_patients,
                active_patients
            },
            doctors: formattedDoctors,
            patients: formattedPatients,
            recent_patients: formattedRecentPatients
        });
    } catch (error) {
        return reply.status(500).send({ message: "Error fetching admin dashboard data", error });
    }
}
