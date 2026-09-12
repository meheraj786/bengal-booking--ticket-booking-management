import { PrismaClient } from "@prisma/client";

const divisions = [
  { name: "Dhaka Division", slug: "dhaka-division" },
  { name: "Chattogram Division", slug: "chattogram-division" },
  { name: "Khulna Division", slug: "khulna-division" },
  { name: "Rajshahi Division", slug: "rajshahi-division" },
  { name: "Barisal Division", slug: "barisal-division" },
  { name: "Sylhet Division", slug: "sylhet-division" },
  { name: "Rangpur Division", slug: "rangpur-division" },
  { name: "Mymensingh Division", slug: "mymensingh-division" },
];

export async function seedDivisions(prisma: PrismaClient) {
  console.info("Seeding divisions...");

  for (const division of divisions) {
    await prisma.division.upsert({
      where: { slug: division.slug },
      update: {},
      create: division,
    });
  }

  console.info(`✓ ${divisions.length} divisions seeded`);
}