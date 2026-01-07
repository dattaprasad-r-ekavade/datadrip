import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@test.com";
  const password = "password123";

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      hashedPassword,
      isSuperAdmin: true,
    },
    create: {
      email,
      name: "Admin User",
      hashedPassword,
      role: "ADMIN",
      isSuperAdmin: true,
    },
  });

  console.log("✅ User created/updated:");
  console.log("   Email:", email);
  console.log("   Password:", password);
  console.log("   Super Admin:", user.isSuperAdmin);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
