import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { seedSuperAdmin } from "./seeds/superadmin";
import { seedDivisions } from "./seeds/divisions";
import { seedAreas } from "./seeds/areas";
import { seedCategories } from "./seeds/categories";

const prisma = new PrismaClient();

async function main() {
  console.info("🌱 Starting database seeding...");

  try {
    await seedSuperAdmin(prisma);
    await seedDivisions(prisma);
    await seedAreas(prisma);
    await seedCategories(prisma);

    console.info("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
