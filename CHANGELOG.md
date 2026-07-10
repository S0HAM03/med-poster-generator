# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Integrated actual AI Vision processing utilizing `@google/genai` (Gemini 1.5 Flash) to parse medical documentation dynamically.
- Configured a local API proxy plugin in `vite.config.js` to handle `/api/analyze-prescription/route` securely during `npm run dev` without exposing API keys to the client.
- Implemented `.env` support to securely handle the `GEMINI_API_KEY`.
- Created `ROADMAP.md` to track future development goals.
- Created `CHANGELOG.md` to document continuous project updates.

### Changed
- Replaced the mock `useVisionApi.js` payload with real `fetch` POST requests to the backend serverless route.
- Modified `index.html` to eagerly load the `Inter` font, fixing an `html2canvas` layout bug that caused squished PDF text rendering.
- Removed `tracking-tight` and `tracking-wider` utility classes in `PosterCanvas.jsx` to ensure deterministic vector rendering during canvas capture.

### Fixed
- Fixed the multi-language UI state bug where translations were present in utilities but not actively hooked into the `App.jsx` language selector.
