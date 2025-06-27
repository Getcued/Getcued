import { type NextRequest, NextResponse } from "next/server"

// Script database for intelligent responses
const scriptDatabase = {
  hamlet: {
    title: "Hamlet",
    scenes: {
      "to be or not to be": {
        context: "Hamlet's famous soliloquy contemplating life and death",
        coaching: "Focus on the philosophical journey. Each question leads to the next. Build the argument logically.",
      },
    },
  },
  "romeo and juliet": {
    title: "Romeo and Juliet",
    scenes: {
      "balcony scene": {
        context: "The famous balcony scene where Romeo and Juliet declare their love",
        coaching: "Balance passion with poetry. Let the language flow naturally, don't force the rhythm.",
      },
    },
  },
  macbeth: {
    title: "Macbeth",
    scenes: {
      sleepwalking: {
        context: "Lady Macbeth's guilt-ridden sleepwalking scene",
        coaching: "Show the fragmentation of her mind. The blood isn't there, but it's completely real to her.",
      },
    },
  },
}

// Generate intelligent responses based on user input
function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Hamlet responses
  if (lowerMessage.includes("hamlet")) {
    if (lowerMessage.includes("to be") || lowerMessage.includes("soliloquy")) {
      return "Excellent choice! Hamlet's 'To be or not to be' soliloquy is one of the most famous in theater. This isn't just about suicide - it's about action versus inaction. Hamlet is a philosopher trapped in a revenge plot. Let's work on building each thought logically. Would you like to start with the opening lines, or do you want to discuss Hamlet's emotional state first?"
    }
    return "Hamlet is such a complex character! He's melancholic, philosophical, and torn between thought and action. What specific scene or aspect of Hamlet would you like to work on? His relationship with Ophelia, the ghost scene, or perhaps one of his soliloquies?"
  }

  // Romeo and Juliet responses
  if (lowerMessage.includes("romeo") || lowerMessage.includes("juliet")) {
    if (lowerMessage.includes("balcony")) {
      return "The balcony scene is iconic! Romeo is completely smitten and speaks in beautiful poetry, while Juliet balances innocence with intelligence. She's actually the practical one who brings up marriage. Which character are you working on? I can help you with Romeo's passionate declarations or Juliet's quick wit and emotional maturity."
    }
    return "Romeo and Juliet - such passionate, complex young characters! Romeo's impulsiveness contrasts beautifully with Juliet's practicality. What draws you to this story? Are you looking at a specific scene, or do you want to explore their character development throughout the play?"
  }

  // Macbeth responses
  if (lowerMessage.includes("macbeth")) {
    if (lowerMessage.includes("sleepwalking") || lowerMessage.includes("lady macbeth")) {
      return "Lady Macbeth's sleepwalking scene is incredibly powerful! She's completely broken down - the control she once had is gone. Play the fragmentation of her mind as it jumps between memories. The blood she sees isn't there, but it's completely real to her. Would you like to work on specific lines or explore her psychological state?"
    }
    return "Macbeth is a dark, intense play about ambition and guilt. The characters' moral decay is gradual but devastating. Are you working on Macbeth himself, Lady Macbeth, or another character? I can help with character development and the psychological journey."
  }

  // General acting coaching
  if (lowerMessage.includes("character") || lowerMessage.includes("development")) {
    return "Character development is the heart of great acting! Let's explore your character's wants, needs, and obstacles. What drives them? What's their greatest fear? How do they see themselves versus how others see them? Tell me about the character you're working on, and we'll dive deep into their psychology."
  }

  if (lowerMessage.includes("monologue") || lowerMessage.includes("soliloquy")) {
    return "Monologues are fantastic for developing your craft! They're like a window into a character's soul. What monologue are you working on? I can help you find the emotional beats, understand the subtext, and work on your delivery. Remember, every great monologue tells a story with a beginning, middle, and end."
  }

  if (lowerMessage.includes("voice") || lowerMessage.includes("diction")) {
    return "Voice and diction work is essential for clear, powerful delivery! Good vocal technique helps you project emotion and meaning. Are you working on breath support, articulation, or vocal variety? I can give you exercises for warming up your voice and improving your speech clarity."
  }

  // Scene work
  if (lowerMessage.includes("scene") || lowerMessage.includes("rehearse")) {
    return "Scene work is where the magic happens! I'm here to be your scene partner and coach. What scene would you like to rehearse? I can play opposite you, help you find the emotional truth, work on blocking, or analyze the subtext. Just tell me what you're working on!"
  }

  // Modern drama
  if (lowerMessage.includes("streetcar") || lowerMessage.includes("blanche")) {
    return "A Streetcar Named Desire is a masterpiece of American theater! Blanche is such a complex character - vulnerable yet manipulative, refined yet desperate. Her journey from delusion to breakdown is heartbreaking. Are you working on a specific scene, or do you want to explore Blanche's psychology?"
  }

  if (lowerMessage.includes("death of a salesman") || lowerMessage.includes("willy")) {
    return "Death of a Salesman is incredibly powerful! Willy Loman represents the broken American Dream. He's desperate, delusional, but also deeply human. His relationship with his sons and his wife Linda reveals so much about his character. What aspect of Willy would you like to explore?"
  }

  // Beginner responses
  if (lowerMessage.includes("beginner") || lowerMessage.includes("new") || lowerMessage.includes("start")) {
    return "Welcome to the wonderful world of acting! Everyone starts somewhere, and I'm here to guide you. We can begin with basic techniques like relaxation, breathing, and simple character exercises. What interests you most - working on a specific scene, developing a character, or learning fundamental acting techniques?"
  }

  // Default responses
  const defaultResponses = [
    "I'm excited to work with you! What scene, character, or technique would you like to focus on today? I can help with everything from Shakespeare to contemporary drama.",
    "Let's dive into some great acting work! Are you preparing for an audition, working on a specific role, or just wanting to improve your craft? I'm here to help with character development, scene work, and technique.",
    "Welcome to your personal acting studio! I can help you rehearse scenes, develop characters, work on monologues, or practice specific techniques. What brings you here today?",
    "Ready to create some magic? Whether you're working on classical theater, modern drama, or developing your own style, I'm here to be your scene partner and coach. What would you like to explore?",
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const response = generateResponse(message)

    return NextResponse.json({
      content: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        content: "I'm having a moment of stage fright! Let's try that scene again.",
      },
      { status: 500 },
    )
  }
}
