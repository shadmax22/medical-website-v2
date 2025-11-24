import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db";

export async function createTracking(request: FastifyRequest, reply: FastifyReply) {
    const { value, tracking_type_unit } = request.body as any;
    const user_id = (request as any).user.id;

    if (!value || !tracking_type_unit) {
        return reply.status(400).send({ message: "Value and tracking type unit are required" });
    }

    try {
        const tracking = await prisma.tracking.create({
            data: {
                user_id,
                value: String(value),
                tracking_type_unit,
            },
        });
        return reply.status(201).send({ message: "Tracking created successfully", tracking });
    } catch (error) {
        return reply.status(500).send({ message: "Error creating tracking", error });
    }
}

export async function getTrackings(request: FastifyRequest, reply: FastifyReply) {
    const user_id = (request as any).user.id;
    try {
        const trackings = await prisma.tracking.findMany({
            where: { user_id },
        });
        return reply.send(trackings);
    } catch (error) {
        return reply.status(500).send({ message: "Error fetching trackings", error });
    }
}

export async function updateTracking(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    const { value, tracking_type_unit } = request.body as any;
    const user_id = (request as any).user.id;

    try {
        const tracking = await prisma.tracking.findUnique({ where: { id } });
        if (!tracking || tracking.user_id !== user_id) {
            return reply.status(404).send({ message: "Tracking not found or unauthorized" });
        }

        const updatedTracking = await prisma.tracking.update({
            where: { id },
            data: {
                value: value ? String(value) : undefined,
                tracking_type_unit,
            },
        });
        return reply.send({ message: "Tracking updated successfully", tracking: updatedTracking });
    } catch (error) {
        return reply.status(500).send({ message: "Error updating tracking", error });
    }
}

export async function deleteTracking(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    const user_id = (request as any).user.id;

    try {
        const tracking = await prisma.tracking.findUnique({ where: { id } });
        if (!tracking || tracking.user_id !== user_id) {
            return reply.status(404).send({ message: "Tracking not found or unauthorized" });
        }

        await prisma.tracking.delete({ where: { id } });
        return reply.send({ message: "Tracking deleted successfully" });
    } catch (error) {
        return reply.status(500).send({ message: "Error deleting tracking", error });
    }
}
