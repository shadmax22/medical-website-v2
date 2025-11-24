import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db";

export async function getPrivateData(request: FastifyRequest, reply: FastifyReply) {
    return { data: (request as any).user };
}

