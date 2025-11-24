import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth.middleware";
import { getPrivateData } from "../controllers/private.controller";
import {
  createTracking,
  getTrackings,
  updateTracking,
  deleteTracking,
} from "../controllers/tracking.controller";
import { getPatientDashboardData } from "../controllers/user.controller";
import {
  getDoctorPatients,
  getPatientProfile,
  getPatientConversations,
  createPatientConversation,
  createPatientGoal,
  createPatientPrescription,
  createGoalTrackingEntry,
} from "../controllers/patient.controller";

export async function privateRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/user", getPrivateData);
  fastify.get("/patient/dashboard-data", getPatientDashboardData);
  fastify.get("/doctor/patients", getDoctorPatients);
  fastify.get("/patient/:patientId/profile", getPatientProfile);
  fastify.get("/patient/:patientId/conversations", getPatientConversations);
  fastify.post("/patient/:patientId/conversations", createPatientConversation);
  fastify.post("/patient/:patientId/goals", createPatientGoal);
  fastify.post("/patient/:patientId/prescriptions", createPatientPrescription);
  fastify.post("/patient/goals/:goalId/track", createGoalTrackingEntry);

  // Tracking routes
  fastify.post("/tracking", createTracking);
  fastify.get("/tracking", getTrackings);
  fastify.put("/tracking/:id", updateTracking);
  fastify.delete("/tracking/:id", deleteTracking);
}
