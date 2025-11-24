import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db";
import { hashPassword, generateToken } from "../utils/auth";

export async function registerDoctor(request: FastifyRequest, reply: FastifyReply) {
    const { name, email_id, phone_no, dob, password, specialization, medical_license, education, experience_years, bio, portfolio_url } = request.body as any;

    if (!email_id || !password || !name) {
        return reply.status(400).send({ message: "Name, Email and password are required" });
    }

    try {
        const hashedPassword = await hashPassword(password);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email_id,
                    phone_no,
                    dob: new Date(dob),
                    password: hashedPassword,
                    stat: "active",
                    role: "doctor",
                },
            });

            const doctor = await tx.doctor.create({
                data: {
                    user_id: user.id,
                    specialization,
                    medical_license,
                    education,
                    experience_years: Number(experience_years),
                    bio,
                    portfolio_url,
                },
            });

            return { user, doctor };
        });

        const user_data = {
            id: result.user.id,
            name: result.user.name,
            email_id: result.user.email_id,
            role: result.user.role,
            doctor_id: result.doctor.id
        };
        const token = generateToken(user_data);

        return reply.status(201).send({ message: "Doctor registered successfully", token, data: { ...result.user, doctor: result.doctor } });
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ message: "Error registering doctor", error: (error as any).message });
    }
}

export async function getDoctors(request: FastifyRequest, reply: FastifyReply) {
    try {
        const doctors = await prisma.doctor.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email_id: true,
                        phone_no: true,
                        dob: true,
                        stat: true,
                        role: true,
                    }
                }
            }
        });
        return reply.send(doctors);
    } catch (error) {
        return reply.status(500).send({ message: "Error fetching doctors", error });
    }
}

export async function getDoctorById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    try {
        const doctor = await prisma.doctor.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email_id: true,
                        phone_no: true,
                        dob: true,
                        stat: true,
                        role: true,
                    }
                }
            }
        });

        if (!doctor) {
            return reply.status(404).send({ message: "Doctor not found" });
        }

        return reply.send(doctor);
    } catch (error) {
        return reply.status(500).send({ message: "Error fetching doctor", error });
    }
}

export async function updateDoctor(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    const data = request.body as any;

    try {
        // Separate user data and doctor data if needed, or just update doctor fields
        // For simplicity, assuming we update doctor fields here. If user fields need update, we should handle that too.
        // Let's assume mixed body for now, but primarily doctor fields.

        const doctorData: any = {};
        if (data.specialization) doctorData.specialization = data.specialization;
        if (data.medical_license) doctorData.medical_license = data.medical_license;
        if (data.education) doctorData.education = data.education;
        if (data.experience_years) doctorData.experience_years = Number(data.experience_years);
        if (data.bio) doctorData.bio = data.bio;
        if (data.portfolio_url) doctorData.portfolio_url = data.portfolio_url;

        const doctor = await prisma.doctor.update({
            where: { id },
            data: doctorData,
        });

        return reply.send({ message: "Doctor updated successfully", doctor });
    } catch (error) {
        return reply.status(500).send({ message: "Error updating doctor", error });
    }
}

export async function deleteDoctor(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    try {
        // Delete doctor and associated user?
        // Let's find the doctor first to get user_id
        const doctor = await prisma.doctor.findUnique({ where: { id } });
        if (!doctor) {
            return reply.status(404).send({ message: "Doctor not found" });
        }

        await prisma.$transaction([
            prisma.doctor.delete({ where: { id } }),
            prisma.user.delete({ where: { id: doctor.user_id } })
        ]);

        return reply.send({ message: "Doctor and associated user deleted successfully" });
    } catch (error) {
        return reply.status(500).send({ message: "Error deleting doctor", error });
    }
}

export async function createGoal(request: FastifyRequest, reply: FastifyReply) {
    const { user_id, goal_target_value, target_type, frequency } = request.body as any;
    // Assuming the logged in user is a doctor and we have their doctor_id
    // We need to fetch doctor_id based on user.id from session if not directly available
    const doctorUser = (request as any).user;

    if (!user_id || !goal_target_value || !target_type || !frequency) {
        return reply.status(400).send({ message: "All fields are required" });
    }

    try {
        // Find doctor profile for the logged in user
        const doctor = await prisma.doctor.findUnique({ where: { user_id: doctorUser.id } });
        if (!doctor) {
            return reply.status(403).send({ message: "Only doctors can create goals" });
        }

        const goal = await prisma.goal.create({
            data: {
                user_id,
                doctor_id: doctor.id,
                goal_target_value: String(goal_target_value),
                target_type,
                frequency: Number(frequency),
            },
        });
        return reply.status(201).send({ message: "Goal created successfully", goal });
    } catch (error) {
        return reply.status(500).send({ message: "Error creating goal", error });
    }
}

export async function assignPatient(request: FastifyRequest, reply: FastifyReply) {
    const { patient_id } = request.body as any;
    const doctorUser = (request as any).user;

    if (!patient_id) {
        return reply.status(400).send({ message: "Patient ID is required" });
    }

    try {
        const doctor = await prisma.doctor.findUnique({ where: { user_id: doctorUser.id } });
        if (!doctor) {
            return reply.status(403).send({ message: "Only doctors can assign patients" });
        }

        // Check if patient exists
        const patient = await prisma.user.findUnique({ where: { id: patient_id } });
        if (!patient) {
            return reply.status(404).send({ message: "Patient not found" });
        }

        await prisma.doctor.update({
            where: { id: doctor.id },
            data: {
                patients: {
                    connect: { id: patient_id }
                }
            }
        });

        return reply.send({ message: "Patient assigned successfully" });
    } catch (error) {
        return reply.status(500).send({ message: "Error assigning patient", error });
    }
}

export async function getDoctorDashboardData(request: FastifyRequest, reply: FastifyReply) {
    const doctorUser = (request as any).user;

    try {
        const doctor = await prisma.doctor.findUnique({
            where: { user_id: doctorUser.id },
            include: {
                user: true,
                patients: true
            }
        });

        if (!doctor) {
            return reply.status(404).send({ message: "Doctor not found" });
        }

        const total_patients = await prisma.user.count({ where: { role: 'user' } });

        // Active patients (assigned and updated recently)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const active_patients_count = await prisma.user.count({
            where: {
                role: 'user',
                updated_at: { gte: thirtyDaysAgo }
            }
        });

        const assigned_patients = doctor.patients.map(p => ({
            name: p.name,
            age: new Date().getFullYear() - new Date(p.dob).getFullYear(),
            issue: p.current_issue || "General Checkup",
            img: "/img/bruce-mars.jpeg",
            last_visit: p.updated_at.toLocaleDateString()
        }));

        const active_patients_list = doctor.patients
            .filter(p => p.updated_at >= thirtyDaysAgo)
            .map(p => ({
                name: p.name,
                issue: p.current_issue || "General Checkup",
                time: "Recently Updated",
                img: "/img/team-4.jpeg"
            }));

        const all_patients = await prisma.user.findMany({
            where: { role: 'user' },
            take: 10
        });

        const formattedAllPatients = all_patients.map(p => ({
            name: p.name,
            issue: p.current_issue || "General Checkup",
            email: p.email_id,
            img: "/img/team-1.jpeg"
        }));

        return reply.send({
            doctor: {
                name: doctor.user.name,
                specialization: doctor.specialization,
                email: doctor.user.email_id,
                img: "/img/team-1.jpeg"
            },
            stats: {
                assigned_patients: doctor.patients.length,
                total_patients,
                active_patients: active_patients_count
            },
            assigned_patients,
            active_patients: active_patients_list,
            all_patients: formattedAllPatients
        });

    } catch (error) {
        return reply.status(500).send({ message: "Error fetching doctor dashboard data", error });
    }
}
