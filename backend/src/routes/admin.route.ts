import { FastifyInstance } from "fastify";
import { getAdminDashboardData } from "../controllers/admin.controller";
import { authenticate } from "../middleware/auth.middleware";

export async function adminRoutes(fastify: FastifyInstance) {
    fastify.get("/dashboard-data", { preHandler: authenticate }, getAdminDashboardData);
}
