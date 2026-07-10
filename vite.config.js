import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
function apiPlugin(env) {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/analyze' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const { image } = JSON.parse(body);
              const base64Data = image.includes(',') ? image.split(',')[1] : image;

              const { OpenAI } = await import('openai');
              
              const groq = new OpenAI({
                apiKey: env.GROQ_API_KEY,
                baseURL: "https://api.groq.com/openai/v1"
              });

              const openrouter = new OpenAI({
                apiKey: env.OPENROUTER_API_KEY,
                baseURL: "https://openrouter.ai/api/v1"
              });

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

JSON SCHEMA STRUCTURE:
{
  "patientName": "string | null",
  "medications": [
    {
      "medicineName": "string",
      "dosage": "string",
      "schedule": {
        "morning": boolean,
        "afternoon": boolean,
        "night": boolean
      },
      "mealInstruction": "Before Food" | "After Food" | "Independent",
      "specialNotes": "string | null"
    }
  ]
}
`;

              const validateSchema = (dataStr) => {
                try {
                  const parsed = JSON.parse(dataStr);
                  if (!parsed.medications || !Array.isArray(parsed.medications)) {
                    return false;
                  }
                  return true;
                } catch {
                  return false;
                }
              };

              let responseText;

              try {
                // Primary Engine: Groq
                const response = await groq.chat.completions.create({
                  model: "meta-llama/llama-4-scout-17b-16e-instruct",
                  messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: [
                        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Data}` } }
                      ]
                    }
                  ],
                  response_format: { type: "json_object" },
                  temperature: 0.0
                });
                
                responseText = response.choices[0].message.content;

              } catch (primaryError) {
                console.warn("Groq Primary Engine Failed. Engaging Waterfall Fallback to OpenRouter...", primaryError.message);
                
                try {
                  // Fallback Engine 1A: OpenRouter
                  const fallbackResponse = await openrouter.chat.completions.create({
                    model: "google/gemma-4-26b-a4b-it:free",
                    messages: [
                      { role: "system", content: prompt },
                      { role: "user", content: [
                          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Data}` } }
                        ]
                      }
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.0
                  });
                  
                  responseText = fallbackResponse.choices[0].message.content;

                } catch (sdkError) {
                  console.error("OpenRouter Fallback also failed:", sdkError);
                  
                  const status = sdkError?.status || sdkError?.response?.status || 500;
                  
                  res.setHeader('Content-Type', 'application/json');
                  
                  if (status === 429) {
                    res.statusCode = 429;
                    return res.end(JSON.stringify({ 
                      error: "rate_limit", 
                      message: "The system is currently busy analyzing multiple prescriptions. Please wait 60 seconds and try again." 
                    }));
                  }

                  res.statusCode = 500;
                  return res.end(JSON.stringify({ 
                    error: "unreadable", 
                    message: "The uploaded image is too blurry. Please take a clearer photo in good lighting." 
                  }));
                }
              }

              // Edge Safety Structural Validation
              if (!validateSchema(responseText)) {
                console.error("Failed structural validation. LLM hallucinated JSON schema.");
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 500;
                return res.end(JSON.stringify({ 
                  error: "unreadable", 
                  message: "The uploaded image is too blurry. Please take a clearer photo in good lighting." 
                }));
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(responseText);

            } catch (error) {
              console.error("Outer request processing error:", error);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ 
                error: "unreadable", 
                message: "The uploaded image is too blurry. Please take a clearer photo in good lighting." 
              }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), apiPlugin(env)],
  }
})
