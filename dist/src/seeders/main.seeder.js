import { prisma } from '../lib/prisma.js';
import { seedRoles } from './role.seeder.js';
async function main() {
    console.log("Starting master database seeding process...");
    await seedRoles(prisma);
    console.log("Master seeding cycle completed successfully.");
}
main()
    .catch((error) => {
    console.error("Master seeding failed with error:", error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
