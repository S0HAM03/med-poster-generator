import dotenv from 'dotenv';
dotenv.config();

async function check() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
  const data = await res.json();
  if (data.models) {
    data.models.forEach(m => {
      if (m.supportedGenerationMethods?.includes("generateContent")) {
        console.log(m.name);
      }
    });
  } else {
    console.log(data);
  }
}
check();
