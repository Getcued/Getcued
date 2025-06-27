import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const SYSTEM_PROMPT = `You are Cued, an AI rehearsal partner for actors and performers. You help actors practice scenes, work on character development, and improve their craft.

Key guidelines:
- Be encouraging and supportive while providing constructive feedback
- Adapt to any character, script, or acting style the user wants to practice
- Provide specific, actionable advice on delivery, emotion, and technique
- Remember context from the conversation to build on previous work
- Use theater and acting terminology appropriately
- Be enthusiastic about the craft of acting
- If they mention a specific play or character, show knowledge of it
- Offer to run lines, work on character motivation, or practice specific scenes
- Keep responses conversational but professional

Remember: You're not just answering questions - you're actively helping them rehearse and improve their performance.`

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build conversation context
    let conversationContext = ""
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-6) // Last 6 messages for context
      conversationContext = recentHistory
        .map((msg: Message) => `${msg.sender === "user" ? "Actor" : "Cued"}: ${msg.content}`)
        .join("\n")
    }

    const fullPrompt = conversationContext
      ? `Previous conversation:\n${conversationContext}\n\nActor: ${message}`
      : `Actor: ${message}`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: SYSTEM_PROMPT,
      prompt: fullPrompt,
      maxTokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
