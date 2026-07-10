# MedPoster AI - Development Roadmap

This document outlines the planned trajectory for MedPoster AI, prioritizing features that enhance senior accessibility, improve AI accuracy, and streamline deployment.

## Current State (v1.0.0)
- Functional Vite SPA with Tailwind CSS.
- Zero-retention AI Gateway using Google Gemini 1.5 Flash.
- Localized generation (English, Hindi, Marathi, Tamil).
- Print-ready A4 PDF generation via `html2canvas` and `jsPDF`.

## Upcoming Milestones

### Phase 2: Enhanced Vision Accuracy & Validation
- [ ] Implement robust error boundaries for when the AI model fails to parse highly degraded handwriting.
- [ ] Introduce a "Confidence Score" indicator next to extracted medications to alert caregivers of low-confidence reads.
- [ ] Add explicit parsing support for regional Indian pharmaceutical packaging (blister strips).

### Phase 3: Infrastructure & Serverless Deployment
- [ ] Formalize the Vercel API routing structure outside of Vite local plugin for production deployments.
- [ ] Implement rate limiting and IP-based throttling on the serverless edge function to prevent API abuse.
- [ ] Setup CI/CD pipelines using GitHub Actions for automated linting and build tests.

### Phase 4: UI/UX & Accessibility Polish
- [ ] Integrate a high-contrast dark mode specifically tailored for users with light sensitivity.
- [ ] Add auditory feedback (text-to-speech) for the generated poster data to assist visually impaired users during the verification phase.
- [ ] Expand translation matrices to include Bengali, Telugu, and Gujarati.
