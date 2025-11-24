import { FastifyReply, FastifyRequest } from "fastify";

export async function getPrivateData(request: FastifyRequest, reply: FastifyReply) {
    return { message: "This is a private route", user: (request as any).user };
}
