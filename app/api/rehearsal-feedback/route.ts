import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const feedbackResponses = {
  delivery: [
    "Great delivery! Try varying your pace to add more emotional depth to this line.",
    "Nice work! Consider where you might add pauses for dramatic effect.",
    "Excellent! Think about the subtext - what is your character really trying to say?",
    "Good job! Try experimenting with different vocal tones to match your character's emotion.",
  ],
  character: [
    "Think about your character's motivation in this moment. What do they want?",
    "Consider your character's relationship with the other person in this scene.",
    "What happened to your character right before this line? How does that affect their delivery?",
    "Great! Try to embody your character's physicality as you speak this line.",
  ],
  technique: [
    "Remember to breathe and support your voice from your diaphragm.",
    "Try to connect with the emotional truth of the line.",
    "Consider the rhythm and musicality of the language.",
    "Think about your character's objective - what are they trying to achieve?",
  ],
  memory: [
    "Good effort! The more you practice, the more natural it will become.",
    "You're getting there! Try breaking the line into smaller chunks to memorize.",
    "Nice work! Consider the logical flow of the dialogue to help with memorization.",
    "Keep practicing! Try to understand the meaning behind each word.",
  ],
}

function getRandomFeedback(category: keyof typeof feedbackResponses): string {
  const responses = feedbackResponses[category]
  return responses[Math.floor(Math.random() * responses.length)]
}

export async function POST(request: NextRequest) {
  try {
    const { line, context, mode } = await request.json()

    if (!line) {
      return NextResponse.json({ error: "Line is required" }, { status: 400 })
    }

    // Try OpenAI first if available
    if (process.env.OPENAI_API_KEY) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          system: `You are an experienced acting coach providing helpful, encouraging feedback for rehearsal. 

Your role:
- Give constructive, specific feedback about line delivery
- Focus on character motivation, emotion, and technique
- Be encouraging and supportive
- Keep feedback concise (2-3 sentences max)
- Consider the context of surrounding lines
- Adapt advice based on the practice mode

Practice modes:
- "self": User is practicing their own lines
- "partner": User is practicing as scene partner  
- "prompt": User is testing their memory

Always be positive and constructive.`,
          prompt: `Please provide acting feedback for this line:

Speaker: ${line.speaker}
Line: "${line.text}"
Practice Mode: ${mode}
Context: ${context?.map((l: any) => `${l.speaker}: ${l.text}`).join("\n") || "No additional context"}

Give specific, helpful feedback for the actor.`,
          maxTokens: 200,
        })

        return NextResponse.json({ feedback: text })
      } catch (error) {
        console.log("OpenAI feedback failed, using fallback:", error)
      }
    }

    // Fallback system with intelligent responses
    let category: keyof typeof feedbackResponses = "delivery"

    if (mode === "prompt") {
      category = "memory"
    } else if (line.text.includes("?")) {
      category = "character"
    } else if (line.text.length > 50) {
      category = "technique"
    }

    const feedback = getRandomFeedback(category)

    return NextResponse.json({
      feedback: `${feedback} Remember, you're playing ${line.speaker} - think about what drives them in this moment.`,
    })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json(
      {
        feedback: "Keep up the great work! Every rehearsal makes you a better performer.",
      },
      { status: 200 },
    )
  }
}
