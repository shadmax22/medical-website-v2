import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db";

export async function getPrivateData(request: FastifyRequest, reply: FastifyReply) {
    return { message: "This is private data", user: (request as any).user };
}

