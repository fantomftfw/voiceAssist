# ADHD Voice Assistant App

A web app that lets users manage tasks (create, edit, delete, mark as done, break down into subtasks, estimate completion time) using only their voice. Uses OpenAI Whisper for speech-to-text, OpenAI GPT for intent parsing, OpenAI TTS for text-to-speech, and Airtable as the backend. Hosted on Netlify.

## Features
- Voice-driven task management (create, edit, delete, mark as done)
- Break down tasks into subtasks using AI
- Estimate completion time for tasks/subtasks using AI
- All data stored in Airtable
- Voice feedback for every action (using OpenAI TTS)

## Tech Stack
- Next.js (React, TypeScript, TailwindCSS)
- OpenAI Whisper API (speech-to-text)
- OpenAI GPT-3.5 API (intent parsing)
- OpenAI TTS API (text-to-speech)
- Airtable REST API (database)
- Hosted on Netlify

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repo-url>
cd adhd-voice-assistant
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory with the following:

```
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_AIRTABLE_API_KEY=your_airtable_api_key
NEXT_PUBLIC_AIRTABLE_BASE_ID=your_airtable_base_id
NEXT_PUBLIC_AIRTABLE_TABLE_NAME=tasks
```

- Get your OpenAI API key from https://platform.openai.com/account/api-keys
- Get your Airtable API key and Base ID from https://airtable.com/api

### 4. Run the development server
```bash
npm run dev
```

### 5. Deploy to Netlify
- Connect your GitHub repo to Netlify
- Set the same environment variables in the Netlify dashboard or in `netlify.toml`
- Deploy the app

### 6. Local Netlify Development (Optional)
- Install Netlify CLI: `npm install -g netlify-cli` (or use the included dev dependency)
- Run locally: `npm run netlify`

## License
MIT

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
