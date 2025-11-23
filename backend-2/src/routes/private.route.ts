import { FastifyInstance } from "fastify";

export async function privateRoutes(fastify: FastifyInstance) {
    fastify.get("/private", async (request, reply) => {
        return { message: "This is a private route" };
    });
}
