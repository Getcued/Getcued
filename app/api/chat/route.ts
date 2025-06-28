import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, messages = [] } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Create conversation context
    const conversationMessages = [
      {
        role: "system" as const,
        content: `You are Cued, an AI rehearsal partner for actors and performers. You help actors practice scenes, work on monologues, and improve their craft. You are knowledgeable about theater, film, and performance techniques. 

Key guidelines:
- Be encouraging and supportive
- Provide specific, actionable feedback
- Help with character development and emotional beats
- Suggest line delivery and timing
- Offer scene partner dialogue when needed
- Keep responses focused on acting and performance

When actors mention specific plays or scenes, engage with the material and offer to run lines or provide direction.`,
      },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: message,
      },
    ]

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages: conversationMessages,
      maxTokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "I'm having trouble connecting right now. Please try again!" }, { status: 500 })
  }
}
