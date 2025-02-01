import { prisma } from "./index";

async function main() {
  // Test database connection
  try {
    await prisma.$connect();
    console.log("Database connection successful");

    // Add any seed data here if needed
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
