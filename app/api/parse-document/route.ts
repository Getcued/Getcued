import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 })
    }

    let extractedText = ""

    if (file.type === "application/pdf") {
      // For PDF files, we'd need a PDF parsing library
      // For now, return an error suggesting text format
      return NextResponse.json(
        {
          error: "PDF parsing requires additional setup. Please convert to .txt format or paste the text directly.",
        },
        { status: 400 },
      )
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // For DOCX files, we'd need a DOCX parsing library
      // For now, return an error suggesting text format
      return NextResponse.json(
        {
          error: "DOCX parsing requires additional setup. Please convert to .txt format or paste the text directly.",
        },
        { status: 400 },
      )
    } else if (file.type === "text/plain") {
      extractedText = await file.text()
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    // Use OpenAI to clean and format the text if available
    if (process.env.OPENAI_API_KEY && extractedText) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          system: `You are a script formatting assistant. Clean up and format the provided text to make it suitable for line-by-line rehearsal. 

Rules:
- Preserve all dialogue and speaker names
- Format speaker names consistently (SPEAKER: dialogue)
- Remove excessive whitespace but preserve line breaks between speakers
- Keep stage directions and scene descriptions
- Don't change the actual content, just clean up formatting
- If it's a song, preserve verse/chorus structure`,
          prompt: `Please clean and format this script/text for rehearsal:\n\n${extractedText}`,
          maxTokens: 2000,
        })

        extractedText = text
      } catch (error) {
        console.log("OpenAI formatting failed, using original text:", error)
        // Continue with original text if OpenAI fails
      }
    }

    return NextResponse.json({
      text: extractedText,
      filename: file.name,
    })
  } catch (error) {
    console.error("Document parsing error:", error)
    return NextResponse.json(
      {
        error: "Failed to parse document",
      },
      { status: 500 },
    )
  }
}
