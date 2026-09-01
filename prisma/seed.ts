import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  const categories = [
    { name: "Digital Marketing", slug: "digital-marketing" },
    { name: "UI/UX Design", slug: "ui-ux-design" },
    { name: "Graphic Design", slug: "graphic-design" },
    { name: "Web Development", slug: "web-development" },
  ];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  const catMap = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  const adminPass = await bcrypt.hash("Admin123!", 10);
  const studentPass = await bcrypt.hash("Student123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@edura.com" },
    update: {},
    create: {
      email: "admin@edura.com",
      name: "Admin",
      passwordHash: adminPass,
      role: "ADMIN",
    },
  });
  await prisma.user.upsert({
    where: { email: "student@edura.com" },
    update: {},
    create: {
      email: "student@edura.com",
      name: "Demo Student",
      passwordHash: studentPass,
      role: "STUDENT",
    },
  });

  const courses = [
    {
      title: "Learn Figma – UI/UX Design Essential Training",
      slug: "learn-figma-ux-essential",
      description: "Master Figma for UI/UX design with hands-on projects.",
      price: 0,
      thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop",
      level: "BEGINNER" as const,
      duration: "03 WEEKS",
      categoryId: catMap["ui-ux-design"],
      instructor: "Kevin Perry",
    },
    {
      title: "Education Software and PHP and JS System Script",
      slug: "education-software-php-js",
      description: "Build education platforms with PHP and JavaScript.",
      price: 0,
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
      level: "BEGINNER" as const,
      duration: "02 WEEKS",
      categoryId: catMap["web-development"],
      instructor: "Max Alexis",
    },
    {
      title: "IT Statistics Data Science and Business Analysis",
      slug: "it-statistics-data-science",
      description: "Learn statistics, data science and business analytics.",
      price: 0,
      thumbnail: "https://images.unsplash.com/photo-1501504905252-473cdee68f94?w=600&h=400&fit=crop",
      level: "BEGINNER" as const,
      duration: "04 WEEKS",
      categoryId: catMap["digital-marketing"],
      instructor: "Kevin Perry",
    },
    {
      title: "Advanced Android 12 & Kotlin Development Course",
      slug: "advanced-android-kotlin",
      description: "Become expert Android developer with Kotlin.",
      price: 0,
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7dfb?w=600&h=400&fit=crop",
      level: "INTERMEDIATE" as const,
      duration: "02 WEEKS",
      categoryId: catMap["web-development"],
      instructor: "Max Alexis",
    },
  ];

  for (const course of courses) {
    const c = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course,
    });
    // Add lessons if none
    const count = await prisma.lesson.count({ where: { courseId: c.id } });
    if (count === 0) {
      await prisma.lesson.createMany({
        data: [
          {
            courseId: c.id,
            title: "Introduction & Overview",
            order: 1,
            videoType: "YOUTUBE",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            duration: "12:45",
            isPreview: true,
          },
          {
            courseId: c.id,
            title: "Core Concepts Deep Dive",
            order: 2,
            videoType: "YOUTUBE",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            duration: "22:10",
          },
          {
            courseId: c.id,
            title: "Hands-on Project",
            order: 3,
            videoType: "YOUTUBE",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            duration: "35:00",
          },
        ],
      });
    }
  }

  await prisma.paymentAccount.upsert({
    where: { id: "seed-cbe" },
    update: {},
    create: {
      id: "seed-cbe",
      title: "Commercial Bank of Ethiopia",
      bankName: "CBE",
      accountNumber: "1000123456789",
      holderName: "EDURA LEARNING PLC",
      instructions: "Transfer exact amount and upload receipt. Include email in note.",
      isActive: true,
    },
  });
  await prisma.paymentAccount.upsert({
    where: { id: "seed-telebirr" },
    update: {},
    create: {
      id: "seed-telebirr",
      title: "TeleBirr",
      bankName: "TeleBirr",
      accountNumber: "0912345678",
      holderName: "EDURA LEARNING",
      instructions: "Send via TeleBirr and upload screenshot with transaction ID.",
      isActive: true,
    },
  });

  console.log("Seeding done");
}
main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
