import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface ChatRequest {
  message: string;
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
    const { message, businessType, location, context }: ChatRequest = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Step 1: Call Qloo API for cultural insights
    const qlooData = await getQlooInsights(location || 'Canada', businessType || 'retail')
    
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

  return `You are a Cultural AI Assistant powered by Qloo's cultural intelligence data. You help businesses understand local cultural preferences and provide actionable recommendations.

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

Please provide a comprehensive response that:
1. Directly answers the user's question
2. Incorporates the cultural insights and local trends provided above
3. Gives specific, actionable recommendations for their business
4. Explains how these recommendations align with local cultural preferences
5. Suggests 2-3 concrete next steps they can take

Keep your response conversational, insightful, and practical. Focus on how cultural understanding can drive business success in this market.`
}

async function callLLM(prompt: string): Promise<string> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

  // Try OpenAI first, then Gemini as fallback
  if (openaiApiKey) {
    try {
      return await callOpenAI(prompt, openaiApiKey)
    } catch (error) {
      console.error('OpenAI API error:', error)
      if (geminiApiKey) {
        return await callGemini(prompt, geminiApiKey)
      }
    }
  } else if (geminiApiKey) {
    return await callGemini(prompt, geminiApiKey)
  }

  // Fallback response if no API keys are available
  return `I understand you're asking about cultural preferences and business opportunities. While I don't have access to real-time cultural data at the moment, I can share that successful businesses typically focus on understanding local preferences, seasonal trends, and community values. 

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