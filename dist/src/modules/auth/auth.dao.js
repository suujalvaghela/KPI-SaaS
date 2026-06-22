import { prisma } from "../../lib/prisma.js";
export const googleUserDao = async (data) => {
    let user = await prisma.user.findFirst({
        where: {
            OR: [{ email: data.email }, { googleId: data.googleId }]
        }
    });
    if (!user) {
        const defaultRole = await prisma.role.findFirst({
            where: { name: "USER" }
        });
        if (!defaultRole) {
            throw new Error("Default system role 'User' not found in database.");
        }
        user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                avatar: data.avatar,
                googleId: data.googleId,
                role: defaultRole.id
            }
        });
    }
    else if (!user.googleId) {
        user = await prisma.user.update({
            where: { id: user.id },
            data: {
                googleId: data.googleId,
                avatar: data.avatar,
            }
        });
    }
    else if (user.deletedAt != null) {
        await prisma.user.update({
            where: { id: user.id },
            data: { deletedAt: null }
        });
    }
    return user;
};
