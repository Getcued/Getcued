import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Enhanced script database with more comprehensive content
const SCRIPT_DATABASE = {
  shakespeare: {
    hamlet: {
      scenes: [
        {
          title: "To Be or Not To Be",
          characters: ["Hamlet"],
          content:
            "To be or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and, by opposing, end them.",
        },
        {
          title: "Hamlet and Ophelia",
          characters: ["Hamlet", "Ophelia"],
          content:
            "HAMLET: Lady, shall I lie in your lap?\nOPHELIA: No, my lord.\nHAMLET: I mean, my head upon your lap?\nOPHELIA: Ay, my lord.",
        },
      ],
    },
    romeo_juliet: {
      scenes: [
        {
          title: "Balcony Scene",
          characters: ["Romeo", "Juliet"],
          content:
            "ROMEO: But soft, what light through yonder window breaks? It is the east, and Juliet is the sun.\nJULIET: O Romeo, Romeo, wherefore art thou Romeo?",
        },
        {
          title: "First Meeting",
          characters: ["Romeo", "Juliet"],
          content:
            "ROMEO: If I profane with my unworthiest hand this holy shrine, the gentle sin is this: My lips, two blushing pilgrims, ready stand to smooth that rough touch with a tender kiss.",
        },
      ],
    },
    macbeth: {
      scenes: [
        {
          title: "Tomorrow Speech",
          characters: ["Macbeth"],
          content:
            "Tomorrow, and tomorrow, and tomorrow, creeps in this petty pace from day to day, to the last syllable of recorded time.",
        },
        {
          title: "Dagger Soliloquy",
          characters: ["Macbeth"],
          content: "Is this a dagger which I see before me, the handle toward my hand? Come, let me clutch thee.",
        },
      ],
    },
  },
  contemporary: {
    scenes: [
      {
        title: "Job Interview",
        characters: ["Applicant", "Interviewer"],
        content: "INTERVIEWER: Tell me about yourself.\nAPPLICANT: Well, I've always been passionate about...",
      },
      {
        title: "Breakup Scene",
        characters: ["Alex", "Jordan"],
        content: "ALEX: We need to talk.\nJORDAN: I know what you're going to say...",
      },
    ],
  },
}

export async function POST(request: NextRequest) {
  try {
    const { messages, memory } = await request.json()

    const lastMessage = messages[messages.length - 1]?.content || ""

    // Enhanced system prompt with memory integration
    const systemPrompt = `You are Cued, an AI acting coach and scene partner. You help actors rehearse by:

1. **Playing all other characters** in scenes while the user focuses on their role
2. **Providing acting coaching** on delivery, emotion, pacing, and character development  
3. **Adapting to any script** - from Shakespeare to contemporary drama
4. **Giving personalized feedback** based on the user's skill level and preferences

**User Memory Context:**
- Total sessions: ${memory?.totalSessions || 0}
- Skill level: ${memory?.skillLevel || "unknown"}
- Favorite genres: ${memory?.favoriteGenres?.join(", ") || "none specified"}
- Recent plays: ${memory?.recentPlays?.join(", ") || "none"}

**Your personality:**
- Enthusiastic and supportive acting coach
- Knowledgeable about theater, film, and performance techniques
- Encouraging but honest with feedback
- Uses theater terminology naturally
- Occasionally uses relevant emojis (🎭✨🎪🌟)

**When the user mentions a specific play or scene:**
1. Offer to rehearse that scene with them
2. Ask which character they want to play
3. Set up the scene context
4. Play all other characters while they focus on their role
5. Give coaching notes between takes

**Available in database:** ${Object.keys(SCRIPT_DATABASE.shakespeare).join(", ")}, plus contemporary scenes.

Be theatrical, encouraging, and ready to dive into any scene!`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
