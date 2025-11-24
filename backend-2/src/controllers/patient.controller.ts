import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db";

export async function assignDoctorsToPatient(request: FastifyRequest, reply: FastifyReply) {
    const { patient_id, doctor_ids } = request.body as { patient_id: string; doctor_ids: string[] };

    if (!patient_id || !doctor_ids || !Array.isArray(doctor_ids)) {
        return reply.status(400).send({ message: "Patient ID and doctor IDs array are required" });
    }

    try {
        // Verify patient exists
        const patient = await prisma.user.findUnique({ where: { id: patient_id } });
        if (!patient) {
            return reply.status(404).send({ message: "Patient not found" });
        }

        // Verify all doctors exist
        const doctors = await prisma.doctor.findMany({
            where: { id: { in: doctor_ids } }
        });

        if (doctors.length !== doctor_ids.length) {
            return reply.status(404).send({ message: "One or more doctors not found" });
        }

        // Assign doctors to patient
        await prisma.user.update({
            where: { id: patient_id },
            data: {
                assigned_doctors: {
                    connect: doctor_ids.map(id => ({ id }))
                }
            }
        });

        return reply.send({
            message: "Doctors assigned successfully",
            assigned_count: doctor_ids.length
        });
    } catch (error) {
        return reply.status(500).send({ message: "Error assigning doctors", error: (error as any).message });
    }
}
