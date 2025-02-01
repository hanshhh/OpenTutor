import { NextResponse } from "next/server";
import { getUserConversations } from "@/lib/db/utils";
import { handleDatabaseError } from "@/middleware/db-error";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await getUserConversations(session.user.id);
    return NextResponse.json(conversations);
  } catch (error) {
    return handleDatabaseError(error);
  }
}
