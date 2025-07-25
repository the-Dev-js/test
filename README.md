QLOO-WEBAPP-PROTOTYPE

## Cultural AI - Conquer New Markets With Intelligence

AI-powered cultural intelligence platform helping businesses expand globally with insights from GPT, Claude, Gemini & Qloo API.

## Setup Instructions

### 1. Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Copy your project URL and anon key from the API settings
3. Create a `.env` file based on `.env.example` and add your Supabase credentials

### 2. Deploy Edge Functions

1. Install Supabase CLI: `npm install -g supabase`
2. Login to Supabase: `supabase login`
3. Link your project: `supabase link --project-ref your-project-id`
4. Deploy the function: `supabase functions deploy chat-orchestrator`

### 3. Configure API Keys

In your Supabase dashboard, go to Edge Functions → chat-orchestrator → Settings and add these environment variables:

- `QLOO_API_KEY`: Your Qloo API key
- `OPENAI_API_KEY`: Your OpenAI API key (optional)
- `GEMINI_API_KEY`: Your Google Gemini API key (optional)

### 4. Run the Application

```bash
npm install
npm run dev
```

## Features

- **Cultural Intelligence**: Powered by Qloo API for deep cultural insights
- **AI-Powered Responses**: Integration with OpenAI GPT and Google Gemini
- **Serverless Architecture**: Uses Supabase Edge Functions for secure API handling
- **Real-time Chat**: Interactive chatbot interface for cultural market research
- **Secure**: API keys are stored securely in Supabase, never exposed to frontend

## How It Works

1. User asks a question about cultural preferences or business opportunities
2. The frontend sends the request to a Supabase Edge Function
3. The Edge Function calls Qloo API to get cultural insights for the target market
4. Cultural data is combined with the user's question to create an enhanced prompt
5. The enhanced prompt is sent to an LLM (OpenAI or Gemini) for intelligent analysis
6. The AI response is returned to the user with actionable cultural insights

## Architecture

```
Frontend (React) → Supabase Edge Function → Qloo API + LLM APIs → Response
```

This architecture ensures:
- API keys remain secure on the server
- CORS issues are avoided
- Scalable serverless deployment
- Fast response times