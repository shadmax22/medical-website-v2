import { FastifyInstance } from "fastify";
import { registerDoctor, getDoctors, getDoctorById, updateDoctor, deleteDoctor, createGoal, assignPatient } from "../controllers/doctor.controller";

import { authenticate } from "../middleware/auth.middleware";

export async function doctorRoutes(fastify: FastifyInstance) {
    fastify.post("/register", registerDoctor);
    fastify.get("/", getDoctors);
    fastify.get("/:id", getDoctorById);
    fastify.put("/:id", { preHandler: authenticate }, updateDoctor);
    fastify.delete("/:id", { preHandler: authenticate }, deleteDoctor);

    // Goal routes
    fastify.post("/goals", { preHandler: authenticate }, createGoal);

    // Assignment routes
    fastify.post("/assign-patient", { preHandler: authenticate }, assignPatient);
}
