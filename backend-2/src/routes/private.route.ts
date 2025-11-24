import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth.middleware";
import { getPrivateData } from "../controllers/private.controller";
import { createTracking, getTrackings, updateTracking, deleteTracking } from "../controllers/tracking.controller";

export async function privateRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", authenticate);

    fastify.get("/private", getPrivateData);

    // Tracking routes
    fastify.post("/tracking", createTracking);
    fastify.get("/tracking", getTrackings);
    fastify.put("/tracking/:id", updateTracking);
    fastify.delete("/tracking/:id", deleteTracking);

}
