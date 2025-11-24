import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";

export async function signup(request: FastifyRequest, reply: FastifyReply) {
    const { name, email_id, phone_no, dob, password, role } = request.body as any;

    if (!email_id || !password) {
        return reply.status(400).send({ message: "Email and password are required" });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                name,
                email_id,
                phone_no,
                dob: new Date(dob), // Assuming dob is sent as string
                password: hashedPassword,
                stat: "active", // Default status
                role: role || "user",
            },
        });
        const user_data = {
            id: user.id,
            name: user.name,
            email_id: user.email_id,
            phone_no: user.phone_no,
            dob: user.dob,
            role: user.role,
        }
        const token = generateToken(user_data);

        return reply.status(201).send({ message: "User created successfully", token, data: user_data });
    } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ message: "Error creating user", error: (error as any).message });
    }
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
    const { email_id, password } = request.body as any;

    if (!email_id || !password) {
        return reply.status(400).send({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email_id } });

    if (!user) {
        return reply.status(401).send({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        return reply.status(401).send({ message: "Invalid credentials" });
    }

    const user_data = {
        id: user.id,
        name: user.name,
        email_id: user.email_id,
        phone_no: user.phone_no,
        dob: user.dob,
        role: user.role,
    }
    const token = generateToken(user_data);

    return {
        message: "Login successful", token, data: user_data
    };
}
