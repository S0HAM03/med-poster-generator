# MedPoster AI

MedPoster AI is a zero-retention, privacy-first Single Page Application (SPA) designed to transform high-friction medical prescriptions into clear, visual, senior-centric posters. 

By taking a photo of a doctor's handwritten prescription or a pill strip, the application extracts the medical data using an AI Gateway (Vision LLM) and converts it into a high-contrast, easy-to-read printable A4 poster for daily medication adherence.

## Features

- **Zero-Retention Architecture**: Ephemeral data processing. No databases, no user accounts, no cloud storage. 100% HIPAA/DPDPA compliant by design.
- **AI-Powered Ingestion**: Uses a Vision LLM API to deterministically extract medicine names, dosages, schedules, and food instructions.
- **Interactive Verification**: A split-pane verification UI allowing users to cross-reference AI output with the original image, featuring a two-step deletion lock for motor-impaired users.
- **Hardware-Accelerated Print Engine**: Utilizes `html2canvas` and `jsPDF` for client-side vector composition, ensuring 300 DPI equivalent crisp A4 PDF generation.
- **Multi-Language Support**: One-click translation of time blocks and instructions into English, Hindi, Marathi, and Tamil.
- **Senior-Centric Design**: Strict adherence to WCAG 2.2 AAA contrast standards, expanded line-heights, large typography (`Inter`), and clear iconography.

## Tech Stack

- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (v3)
- **Icons**: Custom Solid SVG Paths
- **PDF Generation**: html2canvas + jsPDF
- **Routing & Backend**: Vercel Serverless Functions (`/api/analyze-prescription/route.js`)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/S0HAM03/med-poster-generator.git
   cd med-poster-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Architecture & Data Flow

1. **Ingestion**: User uploads an image. It is locally scaled to max 2048px and compressed to 85% JPEG to reduce payload size.
2. **AI Gateway**: The image base64 is sent to a serverless API route. The prompt forces strict deterministic JSON output (Temperature 0.0).
3. **Verification**: Data hydrates a local React state machine. The user verifies and edits the extracted data.
4. **Compositing**: Data is mapped onto a hidden DOM node structured to an A4 aspect ratio.
5. **Output**: The DOM node is rasterized at `scale: 4` and embedded into a jsPDF container for instant client-side download.

## License

This project is open-source. Please see the LICENSE file for more information.
