import Fastify from "fastify";
import { publicRoutes } from "./routes/public.route";
import { privateRoutes } from "./routes/private.route";
import prisma from "./db";

import { doctorRoutes } from "./routes/doctor.route";

const fastify = Fastify({
  logger: true,
});

// Sample route
fastify.get("/", async () => {
  return { message: "Hello from Fastify + TypeScript!" };
});

fastify.register(publicRoutes);
fastify.register(privateRoutes);
fastify.register(doctorRoutes, { prefix: "/doctors" });
// Start server
async function start() {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server running on http://localhost:3000");

    // Verify database connection
    await prisma.$connect();
    console.log("Connected to database");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();