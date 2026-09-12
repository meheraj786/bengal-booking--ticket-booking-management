import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

export async function seedSuperAdmin(prisma: PrismaClient) {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME ?? "Super Admin";

  if (!email || !password) {
    throw new Error(
      "SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in the environment before seeding."
    );
  }

  if (password.length < 8) {
    throw new Error("SUPER_ADMIN_PASSWORD must be at least 8 characters.");
  }

  const normalizedEmail = email.toLowerCase();
  const passwordHash = await hash(password, 12);

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    if (existing.role !== "SUPER_ADMIN") {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: "SUPER_ADMIN", isVerified: true, status: "ACTIVE" },
      });
      console.info(`✓ Existing user ${normalizedEmail} promoted to SUPER_ADMIN.`);
    } else {
      console.info(`✓ Super admin ${normalizedEmail} already exists. Skipping.`);
    }
    return;
  }

  const admin = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      role: "SUPER_ADMIN",
      isVerified: true,
      status: "ACTIVE",
    },
  });

  console.info(`✓ Super admin created: ${admin.email} (id: ${admin.id})`);
}