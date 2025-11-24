import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db";

export async function getUsers(request: FastifyRequest, reply: FastifyReply) {
    const data = await prisma.user.findMany();
    return { message: "This is a public route", data };
}
