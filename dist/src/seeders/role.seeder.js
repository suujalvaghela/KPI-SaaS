export const seedRoles = async (prisma) => {
    console.log("Seeding roles...");
    const defaultRoles = ["ADMIN", "MANAGER", "USER"];
    for (const roleName of defaultRoles) {
        await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName }
        });
    }
    console.log("Roles seeded.");
};
