import { FastifyInstance } from "fastify";

export async function publicRoutes(fastify: FastifyInstance) {
    fastify.get("/public", async (request, reply) => {
        return { message: "This is a public route" };
    });
}
