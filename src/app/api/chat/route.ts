import { NextResponse } from "next/server";
import {
  createConversation,
  addMessage,
  getConversation,
  createNewConversation,
  addMessageToConversation,
  getGPTResponse,
} from "@/lib/db/utils";
import { handleDatabaseError } from "@/middleware/db-error";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";
import { StreamingTextResponse, OpenAIStream } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, conversationId } = await req.json();

    if (!message.trim()) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Function to send a chunk of data
    const sendChunk = async (data: any) => {
      await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    };

    // Start processing in the background
    (async () => {
      try {
        let userMessage;
        if (conversationId) {
          userMessage = await addMessageToConversation(
            conversationId,
            message,
            "user"
          );
        } else {
          const newConversation = await createNewConversation(
            session.user.id,
            message
          );
          conversationId = newConversation.id;
          userMessage = newConversation.messages[0];
        }

        // Get streaming response from OpenAI
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful teaching assistant for a statistics course.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          stream: true,
        });

        let accumulatedResponse = "";
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            accumulatedResponse += content;
            await sendChunk({ type: "stream", content });
          }
        }

        // Save the complete response
        const assistantMessage = await addMessageToConversation(
          conversationId,
          accumulatedResponse,
          "assistant"
        );

        // Send the final update
        await sendChunk({
          type: "end",
          messages: [userMessage, assistantMessage],
        });
      } catch (error) {
        await sendChunk({ type: "error", error: "Failed to process message" });
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
