import { prisma } from "./index";
import type { Message, Conversation } from "@prisma/client";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createConversation(userId: string, title: string) {
  return prisma.conversation.create({
    data: {
      title,
      userId,
    },
  });
}

export async function addMessage(
  conversationId: string,
  content: string,
  sender: "user" | "assistant"
) {
  return prisma.message.create({
    data: {
      content,
      sender,
      conversationId,
    },
  });
}

export async function getUserConversations(userId: string) {
  return prisma.conversation.findMany({
    where: {
      userId,
    },
    include: {
      messages: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getConversation(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: true,
    },
  });
}

export async function createNewConversation(
  userId: string,
  initialMessage: string
) {
  const conversation = await prisma.conversation.create({
    data: {
      userId,
      title: `Conversation ${new Date().toLocaleString()}`,
      messages: {
        create: {
          content: initialMessage,
          sender: "user",
        },
      },
    },
    include: {
      messages: true,
    },
  });

  // Get GPT response
  const gptResponse = await getGPTResponse(initialMessage);

  // Add GPT response to conversation
  const assistantMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      content: gptResponse,
      sender: "assistant",
    },
  });

  return {
    ...conversation,
    messages: [...conversation.messages, assistantMessage],
  };
}

export async function addMessageToConversation(
  conversationId: string,
  content: string,
  sender: "user" | "assistant"
) {
  return prisma.message.create({
    data: {
      conversationId,
      content,
      sender,
    },
  });
}

export async function getGPTResponse(message: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful teaching assistant for a statistics course. Provide clear, concise explanations and use examples when appropriate. 

When writing mathematical expressions, ALWAYS use LaTeX notation:
- Use $ for inline math expressions, including variables, subscripts, and simple formulas
- Use $$ for displayed equations
- Always use proper LaTeX notation for:
  * Subscripts (e.g., $X_1$, $X_n$)
  * Mathematical operators (e.g., $\\sum$, $\\prod$)
  * Greek letters (e.g., $\\mu$, $\\sigma$)
  * Special functions and symbols (e.g., $\\mathbb{E}$, $\\mathbb{P}$, $\\rightarrow$)
  * Fractions ($\\frac{a}{b}$)
  * Square roots ($\\sqrt{x}$)

For example:
- Sample mean: $\\bar{X} = \\frac{X_1 + X_2 + \\cdots + X_n}{n}$
- Probability: $\\mathbb{P}(|\\bar{X} - \\mu| \\geq k\\sigma/\\sqrt{n}) \\leq 1/k^2$
- Variance: $\\text{Var}(\\bar{X}) = \\sigma^2/n$

Always format mathematical expressions, even when they appear within regular text.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return (
      completion.choices[0]?.message?.content ||
      "Sorry, I could not generate a response."
    );
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
}
