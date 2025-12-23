import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@poster.com";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin already exists");
    return;
  }

  await prisma.user.create({
    data: {
      id: randomUUID(),        // ✅ BUILT-IN
      email: adminEmail,
      name: "Super Admin",
      role: "admin",
      emailVerified: true,     // ✅ boolean (matches your schema)
    },
  });

  console.log("🚀 Default admin created");
  console.log("📧 Email:", adminEmail);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
