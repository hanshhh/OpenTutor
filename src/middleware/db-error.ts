import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export function handleDatabaseError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    switch (error.code) {
      case "P2002":
        return NextResponse.json(
          { error: "Unique constraint violation" },
          { status: 409 }
        );
      case "P2025":
        return NextResponse.json(
          { error: "Record not found" },
          { status: 404 }
        );
      default:
        console.error("Database error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  // Handle unknown errors
  console.error("Unknown error:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
