import { GoogleGenAI } from '@google/genai';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { image } = body;
    
    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured in .env" }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Remove data URI prefix if present
    const base64Data = image.includes(',') ? image.split(',')[1] : image;
    
    const prompt = `
ROLE AND CONTEXT:
You are an advanced, hyper-accurate medical data extraction system specializing in pharmacotherapy syntax, clinical handwriting analysis, and pharmaceutical packaging structures. Your sole purpose is to analyze photographs of medical documentation (handwritten prescriptions, printed medical summaries, or pill strips) and convert them into a structured, standardized schema for elderly patient visualization.

CRITICAL INSTRUCTIONS:
1. Complete Hallucination Isolation: Only extract medications that are visually verified within the image. If a medication name or dosage is completely illegible, do not guess. Mark the fields with null parameters where specified.
2. Handwriting Deciphering Engine: Doctors frequently use cursive shorthand and Latin medical abbreviations. You must translate these medical shorthand annotations into explicit daily terms based on standard clinical knowledge:
   - "QD" or "OD" -> Map to Morning = true
   - "BD" or "BID" -> Map to Morning = true, Night = true
   - "TDS" or "TID" -> Map to Morning = true, Afternoon = true, Night = true
   - "QID" -> Map to Morning = true, Afternoon = true, Night = true (and append a special note for intermediate dose)
   - "HS" or "PRN" -> Map to Night = true, or mark as an emergency/as-needed note.
   - "AC" -> Map mealInstruction to "Before Food"
   - "PC" -> Map mealInstruction to "After Food"

DATA EXTRACTION EXPECTATIONS:
- Patient Name: Extract the formal name if visible; if not, return null.
- Medicine Name: Capture the commercial brand name or the generic chemical compound clearly. Capitalize the first letter of every word.
- Dosage: Capture the exact mass or unit volume (e.g., "500 mg", "10 ml", "1 Tablet", "0.5 Puff").
- Schedule Mapping: Evaluate the text to determine if the medication should be taken during the following intervals: Morning (6:00 AM - 11:59 AM), Afternoon (12:00 PM - 4:59 PM), or Night (5:00 PM - 11:59 PM). Set their states to true or false. If a medication is marked as "SOS" or "As Needed", set all schedule blocks to false and populate the specialNotes field with "Take only when needed / SOS".
- Meal Instructions: Strictly categorize into one of three absolute options: "Before Food", "After Food", or "Independent". If unspecified by the document, default to "Independent".
- Special Notes: Extract any explicit auxiliary instructions present in the document.

OUTPUT FORMAT RULES:
- You must output raw, unformatted, parseable JSON matching the exact schema.
- Ensure all quotes are escaped properly and JSON syntax is flawless.
`;

    const schema = {
      type: "object",
      properties: {
        patientName: { type: "string" },
        medications: {
          type: "array",
          items: {
            type: "object",
            properties: {
              medicineName: { type: "string" },
              dosage: { type: "string" },
              schedule: {
                type: "object",
                properties: {
                  morning: { type: "boolean" },
                  afternoon: { type: "boolean" },
                  night: { type: "boolean" }
                }
              },
              mealInstruction: { 
                type: "string", 
                enum: ["Before Food", "After Food", "Independent"] 
              },
              specialNotes: { type: "string" }
            },
            required: ["medicineName", "dosage", "schedule", "mealInstruction"]
          }
        }
      },
      required: ["medications"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        { role: 'user', parts: [
          { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
          { text: prompt }
        ]}
      ],
      config: {
        temperature: 0.0,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    return new Response(response.text, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("AI processing error:", error);
    
    // Check for rate limits or other specific errors
    if (error.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: "Failed to process image. It might be too blurry or our servers are busy. Please try again." }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
