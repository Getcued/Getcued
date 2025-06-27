import { type NextRequest, NextResponse } from "next/server"

// Enhanced script database with comprehensive character coaching
const scriptDatabase = {
  "romeo and juliet": {
    characters: ["Romeo", "Juliet", "Mercutio", "Nurse", "Friar Lawrence"],
    scenes: {
      "balcony scene": {
        act: "Act 2, Scene 2",
        description: "The famous balcony scene where Romeo and Juliet declare their love",
        coaching: {
          Romeo:
            "Focus on the poetry and passion. Romeo is young, impulsive, and completely smitten. Let the language flow naturally - Shakespeare's iambic pentameter should feel like heightened speech, not forced poetry.",
          Juliet:
            "Balance innocence with intelligence. Juliet is practical even in love - she's the one who brings up marriage. Show her quick wit and emotional maturity.",
        },
      },
    },
    themes: ["love", "fate", "youth", "family conflict"],
    style: "Shakespearean tragedy with romantic elements",
  },
  hamlet: {
    characters: ["Hamlet", "Claudius", "Gertrude", "Ophelia", "Polonius"],
    scenes: {
      "to be or not to be": {
        act: "Act 3, Scene 1",
        description: "Hamlet's famous soliloquy contemplating life and death",
        coaching: {
          Hamlet:
            "This isn't just about suicide - it's about action vs. inaction. Hamlet is a philosopher trapped in a revenge plot. Build the argument logically, let each thought lead to the next.",
        },
      },
    },
    themes: ["revenge", "madness", "mortality", "duty"],
    style: "Shakespearean tragedy with psychological depth",
  },
  macbeth: {
    characters: ["Macbeth", "Lady Macbeth", "Duncan", "Banquo", "Macduff"],
    scenes: {
      "sleepwalking scene": {
        act: "Act 5, Scene 1",
        description: "Lady Macbeth's guilt-ridden sleepwalking scene",
        coaching: {
          "Lady Macbeth":
            "She's completely broken down. The control she once had is gone. Play the fragmentation - her mind jumps between memories. The blood she sees isn't there, but it's completely real to her.",
        },
      },
    },
    themes: ["ambition", "guilt", "power", "supernatural"],
    style: "Dark Shakespearean tragedy",
  },
}

// Intelligent response system
function generateResponse(message: string, memory: any) {
  const lowerMessage = message.toLowerCase()

  // Detect script/play references
  for (const [play, data] of Object.entries(scriptDatabase)) {
    if (lowerMessage.includes(play)) {
      return generateScriptResponse(play, data, message, memory)
    }
  }

  // Character-specific responses
  if (lowerMessage.includes("romeo") || lowerMessage.includes("juliet")) {
    return generateCharacterResponse("Romeo and Juliet", message, memory)
  }

  if (lowerMessage.includes("hamlet")) {
    return generateCharacterResponse("Hamlet", message, memory)
  }

  if (lowerMessage.includes("macbeth")) {
    return generateCharacterResponse("Macbeth", message, memory)
  }

  // General acting coaching
  if (lowerMessage.includes("rehearse") || lowerMessage.includes("practice")) {
    return generateRehearsalResponse(message, memory)
  }

  // Fallback response
  return generateFallbackResponse(message, memory)
}

function generateScriptResponse(play: string, data: any, message: string, memory: any) {
  const responses = [
    `Excellent choice! ${play.charAt(0).toUpperCase() + play.slice(1)} is a masterpiece. What specific scene or character would you like to work on? I can help you with character development, scene analysis, or line delivery.`,

    `Let's dive into ${play.charAt(0).toUpperCase() + play.slice(1)}! This ${data.style} offers incredible opportunities for character work. Which character speaks to you most?`,

    `Perfect! I love working on ${play.charAt(0).toUpperCase() + play.slice(1)}. The themes of ${data.themes.slice(0, 2).join(" and ")} make it so rich for actors. What aspect would you like to explore first?`,
  ]

  return {
    response: responses[Math.floor(Math.random() * responses.length)],
    source: "script_database",
    memoryUpdates: {
      lastPlay: play.charAt(0).toUpperCase() + play.slice(1),
      lastGenre: data.style.includes("Shakespeare") ? "Shakespeare" : "Drama",
    },
  }
}

function generateCharacterResponse(play: string, message: string, memory: any) {
  const characterResponses = {
    "Romeo and Juliet": [
      "Romeo and Juliet - such passionate, complex characters! Romeo's impulsiveness contrasts beautifully with Juliet's practicality. Which character are you working on, and what's challenging you about them?",

      "The balcony scene is iconic, but there's so much more to explore with these characters. Are you looking at their character development throughout the play, or focusing on a specific scene?",

      "These young lovers are dealing with such intense emotions and impossible circumstances. What draws you to this story? Let's explore their motivations together.",
    ],

    Hamlet: [
      "Hamlet is one of Shakespeare's most psychologically complex characters. He's a thinker forced into action, a philosopher in a revenge plot. What aspect of his character intrigues you most?",

      "The beauty of Hamlet is in his contradictions - he's decisive yet hesitant, loving yet cruel, sane yet mad. Which scenes are you working on? I can help you navigate his emotional journey.",

      "Hamlet's soliloquies are masterclasses in character development. Each one reveals a different facet of his personality. Are you working on a specific soliloquy or scene?",
    ],

    Macbeth: [
      "Macbeth and Lady Macbeth's relationship is fascinating - the shift in power dynamics as guilt consumes them. Which character are you focusing on?",

      "The supernatural elements in Macbeth create such an eerie atmosphere. How are you approaching the psychological deterioration of the characters?",

      "Ambition and guilt drive this entire play. The characters' moral decay is gradual but devastating. What scenes are you working on?",
    ],
  }

  const responses = characterResponses[play] || characterResponses["Hamlet"]

  return {
    response: responses[Math.floor(Math.random() * responses.length)],
    source: "character_coaching",
    memoryUpdates: {
      lastPlay: play,
      lastGenre: "Shakespeare",
    },
  }
}

function generateRehearsalResponse(message: string, memory: any) {
  const responses = [
    "I'm excited to rehearse with you! What scene or monologue would you like to work on? I can play opposite you, give you line cues, or provide coaching on character development.",

    "Let's get started! Are you working on a specific script, or would you like me to suggest some great scenes for practice? I can adapt to any style - classical, contemporary, or experimental.",

    "Perfect! I'm here to be your scene partner and coach. What's your experience level, and what would you like to focus on today? Character work, line delivery, or maybe some improvisation exercises?",
  ]

  return {
    response: responses[Math.floor(Math.random() * responses.length)],
    source: "rehearsal_coaching",
  }
}

function generateFallbackResponse(message: string, memory: any) {
  const greetings = [
    "Hello! I'm your AI rehearsal partner. I'm here to help you practice scenes, develop characters, and improve your acting technique. What would you like to work on today?",

    "Welcome to your personal acting studio! I can help you rehearse any script, work on character development, or practice specific techniques. What brings you here today?",

    "Hi there! Ready to dive into some character work? I'm equipped to help with everything from Shakespeare to contemporary drama. What's on your rehearsal list?",
  ]

  const coaching = [
    "That's an interesting approach! Let's explore that further. What specific aspect would you like to focus on? I can help with character motivation, emotional beats, or technical delivery.",

    "I love your enthusiasm! Character work is so rewarding. What's your process like? Do you prefer to start with the text, or do you like to explore the character's background first?",

    "Great question! Every actor has their own method. What techniques have you tried before? I can adapt to your preferred style and help you discover new approaches.",
  ]

  // Choose appropriate response type
  if (message.length < 20 || message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
    return {
      response: greetings[Math.floor(Math.random() * greetings.length)],
      source: "fallback",
    }
  }

  return {
    response: coaching[Math.floor(Math.random() * coaching.length)],
    source: "fallback",
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, memory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate intelligent response
    const result = generateResponse(message, memory || {})

    return NextResponse.json(result)
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        response: "I'm having a moment of stage fright! Let's try that scene again.",
        source: "error",
      },
      { status: 500 },
    )
  }
}
