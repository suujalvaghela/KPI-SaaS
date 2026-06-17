import { Server } from 'socket.io';
import { getMemberByIdsDto } from '../modules/membership/membership.dao.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
let io;
export const initSocet = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*'
        }
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        if (!token) {
            return next(new Error("Authentication Required!"));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.data.user = decoded;
            next();
        }
        catch (error) {
            next(new Error("Invalid Token"));
        }
    });
    io.on("connection", (socket) => {
        console.log(`Authenticated user ${socket.data.user.id} connected`);
        socket.on("join-workspace", async (workspace) => {
            try {
                const member = await getMemberByIdsDto({ user: socket.data.user.id, workspace });
                if (!member) {
                    socket.emit("error", "You are not a part of this workspace!");
                    return;
                }
                socket.join(`workspace_${workspace}`);
            }
            catch (error) {
                socket.emit("error", "Invalid workspace");
            }
        });
        socket.on("leave-workspace", (workspace) => {
            socket.leave(`workspace_${workspace}`);
        });
        socket.on("disconnect", () => {
            console.log(`client ${socket.id} disconnected!`);
        });
    });
    return io;
};
export const getIO = () => {
    if (!io) {
        throw new Error('socket.io not initialized!');
    }
    return io;
};
