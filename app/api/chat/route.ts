import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, messages } = body

    if (!message && (!messages || messages.length === 0)) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Simple AI response logic for demo
    const getAIResponse = (userMessage: string): string => {
      const msg = userMessage.toLowerCase()

      if (msg.includes("romeo") || msg.includes("juliet") || msg.includes("balcony")) {
        return "Perfect choice! Let's work on the balcony scene. I'll play Romeo to your Juliet, or vice versa. Which character would you like to embody? Let's start with 'But soft, what light through yonder window breaks?' Remember to convey the longing and conflict in her voice."
      }

      if (msg.includes("hamlet") || msg.includes("to be or not to be")) {
        return "Excellent! Hamlet's most famous soliloquy. This is about life, death, and the fear of the unknown. Start slowly, build the internal conflict. Begin when you're ready: 'To be or not to be, that is the question...'"
      }

      if (msg.includes("macbeth") || msg.includes("lady macbeth") || msg.includes("sleepwalking")) {
        return "Great choice! Lady Macbeth's sleepwalking scene shows her guilt consuming her. She's reliving the murders. Start with fragmented, haunted delivery: 'Out, damned spot! Out, I say!' Focus on the psychological breakdown."
      }

      if (msg.includes("streetcar") || msg.includes("blanche")) {
        return "Powerful scene! Blanche's final moments show her complete break from reality. She's clinging to illusion as her last defense. Begin with vulnerability: 'I have always depended on the kindness of strangers.'"
      }

      if (msg.includes("practice") || msg.includes("rehearse")) {
        return "I'm excited to be your rehearsal partner! Whether you want to work on classical Shakespeare, contemporary drama, or anything in between, I'm here to help. What specific scene or monologue would you like to practice today?"
      }

      return "I'm here to help you rehearse and perfect your craft! Tell me what scene you'd like to work on, upload a script, or choose from some popular classics. I can play any character and give you detailed feedback on your performance."
    }

    const response = getAIResponse(message || messages[messages.length - 1]?.content || "")

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
