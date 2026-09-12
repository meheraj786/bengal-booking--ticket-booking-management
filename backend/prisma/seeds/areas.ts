import { PrismaClient } from "@prisma/client";

const areasData = [
  // Dhaka Division
  {
    divisionSlug: "dhaka-division",
    areas: [
      { name: "Dhaka City", slug: "dhaka-city" },
      { name: "Gazipur", slug: "gazipur" },
      { name: "Narayanganj", slug: "narayanganj" },
      { name: "Tangail", slug: "tangail" },
      { name: "Munshiganj", slug: "munshiganj" },
      { name: "Manikganj", slug: "manikganj" },
      { name: "Shariatpur", slug: "shariatpur" },
      { name: "Rajbari", slug: "rajbari" },
    ],
  },
  // Chattogram Division
  {
    divisionSlug: "chattogram-division",
    areas: [
      { name: "Chattogram City", slug: "chattogram-city" },
      { name: "Cox's Bazar", slug: "coxs-bazar" },
      { name: "Khagrachhari", slug: "khagrachhari" },
      { name: "Rangamati", slug: "rangamati" },
      { name: "Noakhali", slug: "noakhali" },
      { name: "Feni", slug: "feni" },
      { name: "Cumilla", slug: "cumilla" },
      { name: "Chandpur", slug: "chandpur" },
    ],
  },
  // Khulna Division
  {
    divisionSlug: "khulna-division",
    areas: [
      { name: "Khulna City", slug: "khulna-city" },
      { name: "Barisal", slug: "barisal" },
      { name: "Jhalokati", slug: "jhalokati" },
      { name: "Patuakhali", slug: "patuakhali" },
      { name: "Pirojpur", slug: "pirojpur" },
      { name: "Satkhira", slug: "satkhira" },
      { name: "Jessore", slug: "jessore" },
      { name: "Magura", slug: "magura" },
    ],
  },
  // Rajshahi Division
  {
    divisionSlug: "rajshahi-division",
    areas: [
      { name: "Rajshahi City", slug: "rajshahi-city" },
      { name: "Naogaon", slug: "naogaon" },
      { name: "Natore", slug: "natore" },
      { name: "Chapainawabganj", slug: "chapainawabganj" },
      { name: "Pabna", slug: "pabna" },
      { name: "Bogra", slug: "bogra" },
      { name: "Sirajganj", slug: "sirajganj" },
    ],
  },
  // Barisal Division
  {
    divisionSlug: "barisal-division",
    areas: [
      { name: "Barisal City", slug: "barisal-city" },
      { name: "Bhola", slug: "bhola" },
      { name: "Barguna", slug: "barguna" },
      { name: "Jhalokati", slug: "jhalokati" },
      { name: "Patuakhali", slug: "patuakhali" },
      { name: "Pirojpur", slug: "pirojpur" },
    ],
  },
  // Sylhet Division
  {
    divisionSlug: "sylhet-division",
    areas: [
      { name: "Sylhet City", slug: "sylhet-city" },
      { name: "Moulvibazar", slug: "moulvibazar" },
      { name: "Habiganj", slug: "habiganj" },
      { name: "Sunamganj", slug: "sunamganj" },
    ],
  },
  // Rangpur Division
  {
    divisionSlug: "rangpur-division",
    areas: [
      { name: "Rangpur City", slug: "rangpur-city" },
      { name: "Dinajpur", slug: "dinajpur" },
      { name: "Gaibandha", slug: "gaibandha" },
      { name: "Kurigram", slug: "kurigram" },
      { name: "Lalmonirhat", slug: "lalmonirhat" },
      { name: "Nilphamari", slug: "nilphamari" },
      { name: "Thakurgaon", slug: "thakurgaon" },
      { name: "Panchagarh", slug: "panchagarh" },
    ],
  },
  // Mymensingh Division
  {
    divisionSlug: "mymensingh-division",
    areas: [
      { name: "Mymensingh City", slug: "mymensingh-city" },
      { name: "Jashore", slug: "jashore" },
      { name: "Sherpur", slug: "sherpur" },
      { name: "Kishoreganj", slug: "kishoreganj" },
      { name: "Netrokona", slug: "netrokona" },
    ],
  },
];

export async function seedAreas(prisma: PrismaClient) {
  console.info("Seeding areas...");

  let totalCreated = 0;

  for (const divisionData of areasData) {
    const division = await prisma.division.findUnique({
      where: { slug: divisionData.divisionSlug },
    });

    if (!division) {
      console.warn(
        `⚠️  Division ${divisionData.divisionSlug} not found. Skipping areas.`,
      );
      continue;
    }

    for (const area of divisionData.areas) {
      await prisma.area.upsert({
        where: { slug: area.slug },
        update: {},
        create: {
          ...area,
          divisionId: division.id,
        },
      });
      totalCreated++;
    }
  }

  console.info(`✓ ${totalCreated} areas seeded`);
}
