import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface ChatRequest {
  message: string;
  phase?: string;
  businessType?: string;
  location?: string;
  context?: string;
}

interface QlooResponse {
  clusters?: Array<{
    name: string;
    score: number;
    items: Array<{
      name: string;
      type: string;
      score: number;
    }>;
  }>;
  insights?: {
    cultural_preferences: string[];
    local_trends: string[];
    demographics: any;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, phase, businessType, location, context }: ChatRequest = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Handle different conversation phases
    if (phase && phase !== 'ready_for_query') {
      // For onboarding phases, generate AI response without Qloo data
      const onboardingResponse = await generateOnboardingResponse(message, phase, businessType, location)
      
      return new Response(
        JSON.stringify({ 
          response: onboardingResponse,
          phase: phase,
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Step 1: Call Qloo API for cultural insights (only for ready_for_query phase)
    const qlooData = await getQlooInsights(location || 'global market', businessType || 'general business')
    
    // Step 2: Construct enhanced prompt with cultural context
    const enhancedPrompt = buildCulturalPrompt(message, qlooData, businessType, location)
    
    // Step 3: Call LLM with enhanced prompt
    const llmResponse = await callLLM(enhancedPrompt)

    return new Response(
      JSON.stringify({ 
        response: llmResponse,
        cultural_context: qlooData,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in chat orchestrator:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process your request. Please try again.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function getQlooInsights(location: string, businessType: string): Promise<QlooResponse> {
  const qlooApiKey = Deno.env.get('QLOO_API_KEY')
  
  if (!qlooApiKey) {
    console.warn('Qloo API key not found, using mock data')
    return getMockQlooData(location, businessType)
  }

  try {
    // Example Qloo API call - adjust based on actual Qloo API documentation
    const response = await fetch('https://hackathon.api.qloo.com', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${qlooApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        location: location,
        business_type: businessType,
        categories: ['lifestyle', 'entertainment', 'food', 'shopping']
      })
    })

    if (!response.ok) {
      throw new Error(`Qloo API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Qloo API error:', error)
    // Fallback to mock data if API fails
    return getMockQlooData(location, businessType)
  }
}

function getMockQlooData(location: string, businessType: string): QlooResponse {
  // Mock data based on location - this simulates what Qloo might return
  const mockData: Record<string, QlooResponse> = {
    'Canada': {
      clusters: [
        {
          name: 'Outdoor Enthusiasts',
          score: 0.85,
          items: [
            { name: 'Hockey', type: 'sport', score: 0.92 },
            { name: 'Hiking', type: 'activity', score: 0.78 },
            { name: 'Camping', type: 'activity', score: 0.71 }
          ]
        },
        {
          name: 'Cultural Appreciators',
          score: 0.73,
          items: [
            { name: 'Local Festivals', type: 'event', score: 0.81 },
            { name: 'Craft Beer', type: 'beverage', score: 0.76 },
            { name: 'Artisan Markets', type: 'shopping', score: 0.68 }
          ]
        }
      ],
      insights: {
        cultural_preferences: [
          'Strong preference for locally-made products',
          'High value on environmental sustainability',
          'Community-oriented shopping experiences',
          'Seasonal product preferences (winter sports, summer outdoor activities)'
        ],
        local_trends: [
          'Maple syrup and maple-flavored products',
          'Tim Hortons-style coffee culture',
          'Poutine and comfort food variations',
          'Indigenous art and crafts appreciation'
        ],
        demographics: {
          age_groups: { '25-34': 0.28, '35-44': 0.24, '45-54': 0.22 },
          income_level: 'middle-to-upper-middle',
          education: 'high'
        }
      }
    },
    'France': {
      clusters: [
        {
          name: 'Culinary Connoisseurs',
          score: 0.91,
          items: [
            { name: 'Wine Tasting', type: 'activity', score: 0.94 },
            { name: 'Artisan Cheese', type: 'food', score: 0.89 },
            { name: 'Local Markets', type: 'shopping', score: 0.85 }
          ]
        }
      ],
      insights: {
        cultural_preferences: [
          'Premium quality over quantity',
          'Traditional craftsmanship appreciation',
          'Sophisticated aesthetic preferences'
        ],
        local_trends: [
          'Artisanal bread and pastries',
          'Regional wine preferences',
          'Fashion and luxury goods'
        ],
        demographics: {
          age_groups: { '30-45': 0.35, '45-60': 0.30 },
          income_level: 'upper-middle',
          education: 'high'
        }
      }
    }
  }

  return mockData[location] || mockData['Canada']
}

function buildCulturalPrompt(
  userMessage: string, 
  qlooData: QlooResponse, 
  businessType?: string, 
  location?: string
): string {
  const culturalContext = qlooData.insights?.cultural_preferences?.join(', ') || 'No specific preferences available'
  const localTrends = qlooData.insights?.local_trends?.join(', ') || 'No specific trends available'
  const topClusters = qlooData.clusters?.slice(0, 2).map(c => 
    `${c.name} (${Math.round(c.score * 100)}% relevance): ${c.items.map(i => i.name).join(', ')}`
  ).join('\n') || 'No cluster data available'

  return `You are an expert Cultural Intelligence Consultant powered by Qloo's cultural intelligence data. You provide strategic, actionable business advice for international expansion. Your responses should be professional, insightful, and immediately implementable.

CULTURAL CONTEXT FOR ${location?.toUpperCase() || 'THE TARGET MARKET'}:

Key Cultural Preferences:
${culturalContext}

Local Trends:
${localTrends}

Top Cultural Clusters:
${topClusters}

Business Type: ${businessType || 'General business'}
Location: ${location || 'Not specified'}

USER QUESTION: ${userMessage}

RESPONSE FORMAT:
Please structure your response in exactly three sections:

1. CULTURAL ANALYSIS: Directly answer the user's question by analyzing the cultural context and local trends specific to their market.

2. STRATEGIC RECOMMENDATIONS: Provide 3-4 specific, actionable business recommendations that align with the cultural preferences identified above. Each recommendation should be concrete and implementable.

3. NEXT STEPS: Suggest 2-3 immediate, concrete actions they can take within the next 30 days to implement these insights.

Keep your tone professional yet conversational. Focus on practical business value and cultural alignment. Limit your response to 300 words maximum for clarity and actionability.`
}

async function callLLM(prompt: string): Promise<string> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

  // Try Gemini first, then OpenAI as fallback
  if (geminiApiKey) {
    try {
      return await callGemini(prompt, geminiApiKey)
    } catch (error) {
      console.error('Gemini API error:', error)
      if (openaiApiKey) {
        return await callOpenAI(prompt, openaiApiKey)
      }
    }
  } else if (openaiApiKey) {
    return await callOpenAI(prompt, openaiApiKey)
  }

  // Fallback response if no API keys are available
  throw new Error('NO_LLM_API_KEYS_CONFIGURED')
}

For your specific question: "${prompt.split('USER QUESTION: ')[1]?.split('\n')[0] || 'your inquiry'}", I'd recommend researching local competitors, engaging with community groups, and testing small-scale initiatives to understand what resonates with your target audience.

Would you like me to help you think through a specific aspect of your market research strategy?`
}

async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a Cultural AI Assistant that helps businesses understand local markets and cultural preferences. Provide practical, actionable advice based on cultural insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    })
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'
}

async function generateOnboardingResponse(message: string, phase: string, businessType?: string | null, location?: string | null): Promise<string> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

  const onboardingPrompt = buildOnboardingPrompt(message, phase, businessType, location)

  // Try OpenAI first, then Gemini as fallback
  if (openaiApiKey) {
    try {
      return await callOpenAI(onboardingPrompt, openaiApiKey)
    } catch (error) {
      console.error('OpenAI API error:', error)
      if (geminiApiKey) {
        return await callGemini(onboardingPrompt, geminiApiKey)
      }
    }
  } else if (geminiApiKey) {
    return await callGemini(onboardingPrompt, geminiApiKey)
  }

  // Fallback response if no API keys are available
  return getFallbackOnboardingResponse(phase, message)
}

function buildOnboardingPrompt(message: string, phase: string, businessType?: string | null, location?: string | null): string {
  const baseContext = `You are a Cultural AI Assistant that helps businesses understand global markets through cultural intelligence. You are friendly, professional, and enthusiastic about helping users expand their business globally.

IMPORTANT: Keep your responses conversational and natural. Avoid using emojis, bold markdown (**), or bullet points with symbols. Use simple text formatting.`

  switch (phase) {
    case 'initial_question':
      return `${baseContext}

The user just said: "${message}"

This is their first interaction. They seem to be choosing between:
1. Learning more about how you work
2. Jumping right into asking questions

Respond appropriately based on their message. If they want to learn more, explain your capabilities. If they want to jump in, start asking about their business. If unclear, ask them to clarify their preference.

Keep it warm, welcoming, and under 150 words.`

    case 'explaining_app_sent':
      return `${baseContext}

You just explained your capabilities to the user. They responded: "${message}"

Now transition to asking about their business type. Be natural and conversational. Ask what type of business they have or are planning to start, and give some examples to help them.

Keep it under 100 words and make it feel like a natural conversation flow.`

    case 'awaiting_business_type':
      return `${baseContext}

The user just told you about their business: "${message}"

Acknowledge their business type positively and naturally, then ask about the location/market they're interested in exploring. Give examples of how they can specify locations (cities, countries, regions).

Keep it conversational and under 100 words.`

    case 'awaiting_location':
      return `${baseContext}

The user's business type: "${businessType}"
The user just specified their target location: "${message}"

Acknowledge both their business and location, then let them know you're ready to help with specific questions. Give examples of the types of questions they can ask about cultural preferences, market opportunities, etc.

Keep it encouraging and under 120 words.`

    default:
      return `${baseContext}

The user said: "${message}"
Current phase: ${phase}

Respond helpfully and guide them through the conversation naturally.`
  }
}

function getFallbackOnboardingResponse(phase: string, message: string): string {
  switch (phase) {
    case 'initial_question':
      if (message.toLowerCase().includes('learn') || message.toLowerCase().includes('more')) {
        return "I'd love to explain how I can help! I'm your Cultural AI Assistant, powered by Qloo's cultural intelligence and advanced AI. I analyze local preferences, trends, and consumer behaviors worldwide to help businesses succeed in new markets. I can help you understand what products resonate in different cultures, how to adapt your services, and what marketing approaches work best locally. Ready to explore a specific market?"
      } else {
        return "Great! Let's dive right in. To give you the most relevant cultural insights, I'll need to understand your business better. What type of business do you have or are planning to start? For example: restaurant, retail store, tech service, consulting, or something else entirely."
      }
    
    case 'explaining_app_sent':
      return "Perfect! Let's start by understanding your business. What type of business do you have or are you planning to start? This could be anything from a restaurant to a tech startup, retail store, or professional service."
    
    case 'awaiting_business_type':
      return `Excellent! I understand you're working in ${message}. Now, which location or market are you interested in exploring? You can specify a city like Tokyo or Paris, a country like Brazil or Germany, or even a region like Southeast Asia.`
    
    case 'awaiting_location':
      return `Perfect! I now understand you're interested in ${message} for your business. I'm ready to provide detailed cultural insights and recommendations. What specific questions do you have about this market? You can ask about local preferences, cultural factors, market opportunities, or how to adapt your approach.`
    
    default:
      return "I'm here to help you understand cultural preferences and market opportunities worldwide. What would you like to know?"
  }
}