import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth.middleware";
import { getPrivateData } from "../controllers/private.controller";

export async function privateRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", authenticate);

    fastify.get("/private", getPrivateData);
}
