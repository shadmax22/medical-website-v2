import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth.middleware";
import { getPrivateData } from "../controllers/private.controller";
import { createTracking, getTrackings, updateTracking, deleteTracking } from "../controllers/tracking.controller";
import { getPatientDashboardData } from "../controllers/user.controller";

export async function privateRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", authenticate);

    fastify.get("/user", getPrivateData);
    fastify.get("/patient/dashboard-data", getPatientDashboardData);

    // Tracking routes
    fastify.post("/tracking", createTracking);
    fastify.get("/tracking", getTrackings);
    fastify.put("/tracking/:id", updateTracking);
    fastify.delete("/tracking/:id", deleteTracking);

}
