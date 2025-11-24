import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '../utils/auth';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return reply.status(401).send({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return reply.status(401).send({ message: 'Unauthorized: Invalid token format' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return reply.status(401).send({ message: 'Unauthorized: Invalid token' });
    }

    // Attach user to request (need to extend FastifyRequest type if strict, but for now just assigning)
    (request as any).user = decoded;
}
