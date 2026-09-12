import { PrismaClient } from "@prisma/client";

const categories = [
  // Entertainment & Arts
  {
    name: "Music Concerts",
    slug: "music-concerts",
    description: "Live music performances and concerts",
  },
  {
    name: "Theatre & Drama",
    slug: "theatre-drama",
    description: "Stage plays and dramatic performances",
  },
  {
    name: "Comedy Shows",
    slug: "comedy-shows",
    description: "Stand-up comedy and humor events",
  },
  {
    name: "Dance Performances",
    slug: "dance-performances",
    description: "Dance shows and performances",
  },
  {
    name: "Film & Screenings",
    slug: "film-screenings",
    description: "Movie premieres and film screenings",
  },
  {
    name: "Art Exhibitions",
    slug: "art-exhibitions",
    description: "Art galleries and exhibitions",
  },
  {
    name: "Literary Events",
    slug: "literary-events",
    description: "Book launches, poetry readings, and author talks",
  },
  {
    name: "Magic Shows",
    slug: "magic-shows",
    description: "Magic and illusion performances",
  },

  // Sports & Fitness
  {
    name: "Sports Events",
    slug: "sports-events",
    description: "Sporting matches and tournaments",
  },
  {
    name: "Marathons & Running",
    slug: "marathons-running",
    description: "Running events and marathons",
  },
  {
    name: "Fitness & Yoga",
    slug: "fitness-yoga",
    description: "Fitness classes and yoga sessions",
  },
  {
    name: "Adventure & Outdoor",
    slug: "adventure-outdoor",
    description: "Outdoor adventure and camping events",
  },
  {
    name: "eSports & Gaming",
    slug: "esports-gaming",
    description: "Gaming tournaments and eSports events",
  },

  // Business & Professional
  {
    name: "Conferences",
    slug: "conferences",
    description: "Business and industry conferences",
  },
  {
    name: "Workshops & Seminars",
    slug: "workshops-seminars",
    description: "Educational workshops and seminars",
  },
  {
    name: "Networking Events",
    slug: "networking-events",
    description: "Professional networking events",
  },
  {
    name: "Trade Shows & Expos",
    slug: "trade-shows-expos",
    description: "Trade shows and industry expos",
  },
  {
    name: "Career Fairs",
    slug: "career-fairs",
    description: "Job fairs and career events",
  },
  {
    name: "Webinars",
    slug: "webinars",
    description: "Online webinars and virtual sessions",
  },

  // Education & Learning
  {
    name: "Educational Workshops",
    slug: "educational-workshops",
    description: "Skill-building and educational workshops",
  },
  {
    name: "Courses & Training",
    slug: "courses-training",
    description: "Training programs and certification courses",
  },
  {
    name: "Kids & Family Learning",
    slug: "kids-family-learning",
    description: "Educational events for kids and families",
  },

  // Festivals & Cultural
  {
    name: "Festivals",
    slug: "festivals",
    description: "Cultural and seasonal festivals",
  },
  {
    name: "Cultural Events",
    slug: "cultural-events",
    description: "Cultural celebrations and heritage events",
  },
  {
    name: "Religious & Spiritual",
    slug: "religious-spiritual",
    description: "Religious gatherings and spiritual events",
  },
  {
    name: "National & Public Holidays",
    slug: "national-holidays",
    description: "National holiday celebrations",
  },

  // Food & Lifestyle
  {
    name: "Food & Drink Festivals",
    slug: "food-drink-festivals",
    description: "Food and beverage festivals",
  },
  {
    name: "Nightlife & Parties",
    slug: "nightlife-parties",
    description: "Nightclub events and parties",
  },
  {
    name: "Fashion Shows",
    slug: "fashion-shows",
    description: "Fashion shows and runway events",
  },
  {
    name: "Health & Wellness",
    slug: "health-wellness",
    description: "Health, wellness, and self-care events",
  },

  // Family & Community
  {
    name: "Kids & Family Events",
    slug: "kids-family-events",
    description: "Family-friendly events and activities",
  },
  {
    name: "Community Gatherings",
    slug: "community-gatherings",
    description: "Local community events and meetups",
  },
  {
    name: "Charity & Fundraisers",
    slug: "charity-fundraisers",
    description: "Charity events and fundraising drives",
  },

  // Technology
  {
    name: "Tech Events & Hackathons",
    slug: "tech-hackathons",
    description: "Technology events and hackathons",
  },
  {
    name: "Startup & Entrepreneurship",
    slug: "startup-entrepreneurship",
    description: "Startup pitch events and entrepreneurship meetups",
  },
  {
    name: "Product Launches",
    slug: "product-launches",
    description: "New product launch events",
  },

  // Others
  {
    name: "Exhibitions & Fairs",
    slug: "exhibitions-fairs",
    description: "General exhibitions and fairs",
  },
  { name: "Auctions", slug: "auctions", description: "Auction events" },
  {
    name: "Weddings & Private Events",
    slug: "weddings-private-events",
    description: "Wedding ceremonies and private celebrations",
  },
  {
    name: "Corporate Events",
    slug: "corporate-events",
    description: "Corporate meetings and company events",
  },
];

export async function seedCategories(prisma: PrismaClient) {
  console.info("Seeding categories...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.info(`✓ ${categories.length} categories seeded`);
}
