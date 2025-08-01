QLOO-WEBAPP-PROTOTYPE

## Cultural AI - Conquer New Markets With Intelligence

AI-powered cultural intelligence platform helping businesses expand globally with insights from Gemini & Qloo API.

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
- `GEMINI_API_KEY`: Your Google Gemini API key

### 4. Run the Application

```bash
npm install
npm run dev
```

## Features

- **Cultural Intelligence**: Powered by Qloo API for deep cultural insights
- **AI-Powered Responses**: Integration with Google Gemini
- **Serverless Architecture**: Uses Supabase Edge Functions for secure API handling
- **Real-time Chat**: Interactive chatbot interface for cultural market research
- **Secure**: API keys are stored securely in Supabase, never exposed to frontend

## How It Works

1. User asks a question about cultural preferences or business opportunities
2. The frontend sends the request to a Supabase Edge Function
3. The Edge Function calls Qloo API to get cultural insights for the target market
4. Cultural data is combined with the user's question to create an enhanced prompt
5. The enhanced prompt is sent to Gemini for intelligent analysis
6. The AI response is returned to the user with actionable cultural insights


## App Usage Modes
Cultural Match AI offers two complementary usage modes to suit all user profiles:

 ### Onboarding Mode (Discovery)
This mode is designed to onboard first-time users. It provides an interactive and guided experience without calling external data sources. The user can explore the interface, understand the concept of cultural intelligence, and learn what kind of questions to ask. No location or business information is required.

### Advanced Mode (Strategic Analysis)
This mode unlocks the full potential of the app.
To access it, the user clicks a dedicated button that triggers a popup, asking them to provide:

A location (city or country)

A business type or sector

Once submitted, the app performs a single fetch request to the Qloo Taste AI API, retrieving relevant cultural insights based on the input. These insights are then processed by Gemini AI to deliver clear, tailored strategic recommendations — such as product localization, culturally relevant marketing suggestions, and new business opportunities.

This dual-mode structure ensures both a gentle learning curve and deep, contextual cultural analysis, tailored to real-world strategic needs.

## Architecture

```
Frontend (React) → Supabase Edge Function → Qloo API + Gemini API → Response
```

This architecture ensures:
- API keys remain secure on the server
- CORS issues are avoided
- Scalable serverless deployment
- Fast response times
