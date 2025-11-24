import { FastifyInstance } from "fastify";
import { signup, login } from "../controllers/auth.controller";
import { getUsers } from "../controllers/user.controller";
import { assignDoctorsToPatient } from "../controllers/patient.controller";

export async function publicRoutes(fastify: FastifyInstance) {
    fastify.get("/public", getUsers);

    fastify.post("/signup", signup);
    fastify.post("/login", login);
    fastify.post("/assign-doctors", assignDoctorsToPatient);
}
