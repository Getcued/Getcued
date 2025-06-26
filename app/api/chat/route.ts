import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Fallback AI responses for different types of acting requests
const actingResponses = {
  shakespeare: [
    "Ah, a fellow lover of the Bard! Let's dive into this scene. I'll be your scene partner. What character would you like me to play?",
    "Shakespeare's language is music to the soul! Remember to feel the rhythm of iambic pentameter as we work through this scene.",
    "The beauty of Shakespeare lies in the emotion beneath the words. Let's explore what drives your character in this moment.",
  ],
  character: [
    "Character development is the heart of great acting! Let's dig deep into your character's motivations, fears, and desires.",
    "Every character has a secret. What do you think your character is hiding? Let's explore their inner world together.",
    "Think about your character's backstory. What happened to them before this scene? How does it affect their choices now?",
  ],
  scene: [
    "I'm ready to be your scene partner! Tell me which character you'd like me to play, and let's bring this scene to life.",
    "Scene work is where the magic happens! I'll match your energy and help you discover new layers in your performance.",
    "Let's start with the emotional core of this scene. What is your character fighting for in this moment?",
  ],
  improv: [
    "Improv is all about saying 'yes, and...' Let's create something amazing together! I'm ready to jump into any scenario.",
    "The key to great improv is listening and reacting truthfully. I'll follow your lead and help build our scene organically.",
    "Remember, in improv there are no mistakes, only discoveries! Let's see where this scene takes us.",
  ],
  general: [
    "Hello! I'm Cued, your AI scene partner. I'm here to help you rehearse, develop characters, and improve your craft. What would you like to work on today?",
    "Great to meet you! Whether you want to run lines, work on character development, or practice improv, I'm here to support your artistic journey.",
    "I'm excited to work with you! Acting is about truth and connection. Let's explore your craft together and discover something new.",
  ],
}

function getResponseCategory(message: string): keyof typeof actingResponses {
  const lowerMessage = message.toLowerCase()

  if (
    lowerMessage.includes("shakespeare") ||
    lowerMessage.includes("hamlet") ||
    lowerMessage.includes("romeo") ||
    lowerMessage.includes("juliet") ||
    lowerMessage.includes("macbeth")
  ) {
    return "shakespeare"
  }
  if (lowerMessage.includes("character") || lowerMessage.includes("backstory") || lowerMessage.includes("motivation")) {
    return "character"
  }
  if (lowerMessage.includes("scene") || lowerMessage.includes("rehearse") || lowerMessage.includes("practice")) {
    return "scene"
  }
  if (lowerMessage.includes("improv") || lowerMessage.includes("improvisation")) {
    return "improv"
  }
  return "general"
}

function getRandomResponse(category: keyof typeof actingResponses): string {
  const responses = actingResponses[category]
  return responses[Math.floor(Math.random() * responses.length)]
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Try OpenAI first if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          system: `You are Cued, an AI-powered scene partner for actors and performers. You help actors:
          - Rehearse scenes from plays, movies, and TV shows
          - Practice lines and dialogue
          - Develop characters and backstories
          - Work on improvisation
          - Analyze scripts and motivations
          - Provide acting tips and feedback
          
          You should be encouraging, professional, and knowledgeable about theater, film, and acting techniques. 
          When doing scene work, clearly indicate which character you're playing and stay in character during dialogue.
          Be enthusiastic about helping actors improve their craft!`,
          prompt: message,
          maxTokens: 500,
        })

        return NextResponse.json({
          response: text,
          timestamp: new Date().toISOString(),
          source: "openai",
        })
      } catch (openaiError) {
        console.log("OpenAI failed, using fallback:", openaiError)
        // Fall through to fallback system
      }
    }

    // Fallback system - intelligent responses based on message content
    const category = getResponseCategory(message)
    const response = getRandomResponse(category)

    // Add some personalization based on the user's message
    let personalizedResponse = response

    // If they mentioned a specific play or character, acknowledge it
    if (message.toLowerCase().includes("romeo")) {
      personalizedResponse = "Ah, Romeo! Such passion and youth. " + response
    } else if (message.toLowerCase().includes("juliet")) {
      personalizedResponse = "Juliet - one of Shakespeare's most complex heroines! " + response
    } else if (message.toLowerCase().includes("hamlet")) {
      personalizedResponse =
        "Hamlet - the prince of Denmark and perhaps literature's greatest character study. " + response
    } else if (message.toLowerCase().includes("macbeth")) {
      personalizedResponse = "The Scottish play! Such ambition and tragedy. " + response
    }

    return NextResponse.json({
      response: personalizedResponse,
      timestamp: new Date().toISOString(),
      source: "fallback",
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        response: "I'm having a moment of stage fright! Please try again, and let's create some magic together.",
        timestamp: new Date().toISOString(),
        source: "error",
      },
      { status: 200 },
    ) // Return 200 so the chat doesn't break
  }
}
