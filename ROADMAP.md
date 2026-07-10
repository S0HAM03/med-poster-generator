# MedPoster AI - Development Roadmap

This document outlines the planned trajectory for MedPoster AI, prioritizing features that enhance senior accessibility, improve AI accuracy, and streamline deployment. Our ultimate goal is achieving a **zero-cost infrastructure** with a **"zero-error" processing pipeline**.

## Current State (v1.0.0)
- Functional Vite SPA with Tailwind CSS.
- Zero-retention AI Gateway using Google Gemini 1.5 Flash.
- Localized generation (English, Hindi, Marathi, Tamil).
- Print-ready A4 PDF generation via `html2canvas` and `jsPDF`.

## Upcoming Milestones

### Phase 2: Edge API, Resiliency Routing & Validation (The "Zero-Error" Pipeline)
- [ ] Initialize a Cloudflare Worker or Vercel Edge API route for the analyze-image endpoint (bypassing the local Vite proxy for production).
- [ ] Integrate the Gemini SDK as the primary processing engine, utilizing the `gemini-2.5-flash` or `gemini-1.5-flash` model.
- [ ] Enforce strict structured outputs using the LLM `response_schema` parameter to completely eliminate JSON parsing errors at the inference level.
- [ ] Integrate the Groq API (Llama 4 Scout Vision / Qwen 3.6-VL) as a secondary fallback mechanism (Waterfall Routing), triggered automatically on a 429 or 500 error from Gemini.
- [ ] Add Hugging Face Serverless Inference as the tertiary ultimate safety net.
- [ ] Implement **Zod** schema validation within the Edge Function to verify the LLM output matches the exact UI prop requirements before returning the payload, forcing a silent background retry on failure.

### Phase 3: The Auto-Correction Engine (Datasets & Fuzzy Matching)
- [ ] Source a CSV dataset of the top 5,000 generic and regional brand-name medications (e.g., using RxNav/RxNorm and Indian pharmaceutical Kaggle datasets).
- [ ] Write a build-step script to parse this CSV into an ultra-compressed `med-dictionary.json` file deployed statically with the frontend.
- [ ] Integrate `fuse.js` (a lightweight fuzzy-search library) into the React Verification Screen.
- [ ] Configure `fuse.js` to automatically scan the AI's extracted `medicineName` against the offline dictionary. 
  - If confidence is > 85%, auto-correct the spelling silently.
  - If 60-84%, flag the input field in yellow for manual user review.

### Phase 4: AI Evaluation & Prompt Tuning Loop
- [ ] Gather Evaluation Data: Source Kaggle datasets ("Handwritten Medical Prescriptions OCR Dataset") containing real, anonymized images of messy doctor notes.
- [ ] Write a local Python evaluation script to feed 100 test images through the LLM prompt.
- [ ] Continuously tweak the system prompt instructions (e.g., explicitly teaching regional clinical shorthand like "1-0-1" or "0-0-1") until extraction accuracy reliably exceeds 95%+.

### Phase 5: UI/UX & Accessibility Polish
- [ ] Integrate a high-contrast dark mode specifically tailored for users with light sensitivity.
- [ ] Add auditory feedback (text-to-speech) for the generated poster data to assist visually impaired users during the verification phase.
- [ ] Expand translation matrices to include Bengali, Telugu, and Gujarati.
