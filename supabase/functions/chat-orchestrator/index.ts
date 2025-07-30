import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface ChatRequest {
  message: string
  phase: string
  businessType?: string
  location?: string
}

interface QlooInsight {
  preferences: string[]
  trends: string[]
  culturalClusters: string[]
}

interface ErrorResponse {
  error: string
  message: string
  errorType: string
}

// Enhanced error types for better user feedback
const ERROR_TYPES = {
  QLOO_API_ERROR: 'QLOO_API_ERROR',
  LLM_API_ERROR: 'LLM_API_ERROR',
  MISSING_API_KEYS: 'MISSING_API_KEYS',
  ONBOARDING_ERROR: 'ONBOARDING_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  GENERAL_ERROR: 'GENERAL_ERROR'
} as const

// Mock data for fallback when Qloo API is unavailable
function getMockQlooData(location: string): QlooInsight {
  const mockData: Record<string, QlooInsight> = {
    'france': {
      preferences: ['luxury brands', 'artisanal products', 'sustainable fashion', 'gourmet food'],
      trends: ['eco-consciousness', 'local sourcing', 'premium quality', 'cultural heritage'],
      culturalClusters: ['sophistication seekers', 'tradition preservers', 'quality enthusiasts']
    },
    'japan': {
      preferences: ['minimalist design', 'high-tech products', 'seasonal items', 'kawaii culture'],
      trends: ['digital innovation', 'convenience focus', 'aesthetic perfection', 'group harmony'],
      culturalClusters: ['tech adopters', 'aesthetic purists', 'convenience seekers']
    },
    'usa': {
      preferences: ['convenience products', 'value deals', 'personalization', 'brand loyalty'],
      trends: ['fast consumption', 'social media influence', 'instant gratification', 'diversity celebration'],
      culturalClusters: ['convenience seekers', 'value hunters', 'trend followers']
    },
    'default': {
      preferences: ['quality products', 'good value', 'reliable service', 'local relevance'],
      trends: ['digital adoption', 'sustainability awareness', 'personalization', 'convenience'],
      culturalClusters: ['quality seekers', 'value conscious', 'digitally engaged']
    }
  }
  
  return mockData[location.toLowerCase()] || mockData['default']
}

// Get cultural insights from Qloo API
async function getQlooInsights(location: string, businessType: string): Promise<QlooInsight> {
  const qlooApiKey = Deno.env.get('QLOO_API_KEY')
  
  if (!qlooApiKey) {
    console.error('Qloo API key not configured')
    throw new Error(ERROR_TYPES.QLOO_API_ERROR)
  }

  try {
    // This is a placeholder for the actual Qloo API call
    // Replace with actual Qloo API endpoint and parameters
    const response = await fetch('https://api.qloo.com/v1/insights', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${qlooApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: location,
        business_type: businessType,
        insights_type: 'cultural_preferences'
      })
    })

    if (!response.ok) {
      console.error(`Qloo API error: ${response.status}`)
      throw new Error(ERROR_TYPES.QLOO_API_ERROR)
    }

    const data = await response.json()
    
    return {
      preferences: data.preferences || [],
      trends: data.trends || [],
      culturalClusters: data.cultural_clusters || []
    }
  } catch (error) {
    console.error('Error calling Qloo API:', error)
    throw new Error(ERROR_TYPES.QLOO_API_ERROR)
  }
}

// Enhanced prompt building with better structure and constraints
function buildCulturalPrompt(message: string, insights: QlooInsight, location: string, businessType: string): string {
  return `You are an Expert Cultural Intelligence Consultant specializing in international business expansion. Your role is to provide strategic, actionable insights for businesses entering new markets.

CULTURAL CONTEXT FOR ${location.toUpperCase()}:
- Key Preferences: ${insights.preferences.join(', ')}
- Current Trends: ${insights.trends.join(', ')}
- Cultural Clusters: ${insights.culturalClusters.join(', ')}

BUSINESS CONTEXT:
- Business Type: ${businessType}
- Target Market: ${location}

USER QUESTION: ${message}

RESPONSE REQUIREMENTS:
Please structure your response in exactly 3 sections (maximum 300 words total):

1. **Cultural Analysis**: Key cultural factors affecting this business opportunity
2. **Strategic Recommendations**: 3-4 specific, actionable strategies
3. **Next Steps**: Concrete actions the business should take immediately

Maintain a professional yet accessible tone. Focus on practical, implementable advice based on the cultural insights provided.`
}

// Enhanced onboarding prompt with clearer instructions
function buildOnboardingPrompt(message: string, phase: string): string {
  const basePrompt = `You are a Cultural Intelligence Assistant helping businesses expand internationally. Guide users through our onboarding process naturally and conversationally.

Current Phase: ${phase}
User Message: ${message}

Instructions:
- Be warm, professional, and encouraging
- Ask one clear question at a time
- Explain briefly why the information is needed
- Keep responses concise (under 100 words)
- Use a conversational tone`

  switch (phase) {
    case 'initial_question':
      return `${basePrompt}

The user just asked their first question. Welcome them and explain that you need some basic information to provide the most relevant cultural insights. Ask for their business type first.`

    case 'explaining_app_sent':
      return `${basePrompt}

You've explained the app. Now ask what type of business they have (e.g., e-commerce, restaurant, tech startup, retail, etc.).`

    case 'awaiting_business_type':
      return `${basePrompt}

The user should be providing their business type. If they did, acknowledge it and ask for their target market/location. If unclear, politely ask them to clarify their business type.`

    case 'awaiting_location':
      return `${basePrompt}

The user should be providing their target location/market. If they did, acknowledge it and let them know you're ready to help with cultural insights. If unclear, ask them to specify the country or region they want to expand to.`

    default:
      return `${basePrompt}

Respond helpfully to the user's message and guide them toward providing any missing information needed for cultural analysis.`
  }
}

// Call Gemini API (prioritized)
async function callGemini(prompt: string): Promise<string> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
  
  if (!geminiApiKey) {
    throw new Error('Gemini API key not configured')
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Gemini API error: ${response.status} - ${errorText}`)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text
    } else {
      throw new Error('Invalid response format from Gemini')
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    throw error
  }
}

// Call OpenAI API (fallback)
async function callOpenAI(prompt: string): Promise<string> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`OpenAI API error: ${response.status} - ${errorText}`)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    throw error
  }
}

// Enhanced LLM calling with Gemini priority
async function callLLM(prompt: string): Promise<string> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

  // Try Gemini first (prioritized)
  if (geminiApiKey) {
    try {
      console.log('Attempting to call Gemini API...')
      return await callGemini(prompt)
    } catch (error) {
      console.error('Gemini API failed, trying OpenAI fallback:', error)
    }
  }

  // Fallback to OpenAI
  if (openaiApiKey) {
    try {
      console.log('Attempting to call OpenAI API...')
      return await callOpenAI(prompt)
    } catch (error) {
      console.error('OpenAI API also failed:', error)
      throw new Error(ERROR_TYPES.LLM_API_ERROR)
    }
  }

  throw new Error(ERROR_TYPES.MISSING_API_KEYS)
}

// Generate onboarding responses with enhanced error handling
async function generateOnboardingResponse(message: string, phase: string): Promise<string> {
  const prompt = buildOnboardingPrompt(message, phase)
  
  try {
    return await callLLM(prompt)
  } catch (error) {
    console.error('Error generating onboarding response:', error)
    throw new Error(ERROR_TYPES.ONBOARDING_ERROR)
  }
}

// Fallback onboarding responses
function getFallbackOnboardingResponse(phase: string): string {
  switch (phase) {
    case 'initial_question':
    case 'explaining_app_sent':
      return "Welcome! I'm here to help you understand cultural preferences for your business expansion. To get started, could you tell me what type of business you have? (e.g., e-commerce, restaurant, tech startup, retail, etc.)"
    
    case 'awaiting_business_type':
      return "I'd love to help you with cultural insights! Could you please tell me what type of business you have? This will help me provide more relevant advice."
    
    case 'awaiting_location':
      return "Great! Now, which country or region are you looking to expand to? This will help me provide specific cultural insights for that market."
    
    default:
      return "I'm here to help you understand cultural preferences for international business expansion. What would you like to know?"
  }
}

// Enhanced error response creation
function createErrorResponse(errorType: string, statusCode: number = 500): Response {
  const errorMessages: Record<string, string> = {
    [ERROR_TYPES.QLOO_API_ERROR]: "I'm having trouble accessing cultural data right now. Please try again in a few moments, or contact support if the issue persists.",
    [ERROR_TYPES.LLM_API_ERROR]: "I'm experiencing technical difficulties with my AI processing. Please try again shortly.",
    [ERROR_TYPES.MISSING_API_KEYS]: "The service is not properly configured. Please contact support for assistance.",
    [ERROR_TYPES.ONBOARDING_ERROR]: "I'm having trouble processing your request. Let me try to help you get started anyway.",
    [ERROR_TYPES.INVALID_REQUEST]: "I didn't understand your request format. Please try rephrasing your question.",
    [ERROR_TYPES.GENERAL_ERROR]: "Something went wrong on my end. Please try again, and if the problem continues, contact support."
  }

  const errorResponse: ErrorResponse = {
    error: "Internal server error",
    message: errorMessages[errorType] || errorMessages[ERROR_TYPES.GENERAL_ERROR],
    errorType: errorType
  }

  return new Response(
    JSON.stringify(errorResponse),
    { 
      status: statusCode,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  )
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    let requestData: ChatRequest
    try {
      requestData = await req.json()
    } catch (error) {
      console.error('Invalid JSON in request:', error)
      return createErrorResponse(ERROR_TYPES.INVALID_REQUEST, 400)
    }

    const { message, phase, businessType, location } = requestData

    if (!message || !phase) {
      return createErrorResponse(ERROR_TYPES.INVALID_REQUEST, 400)
    }

    // Handle onboarding phases
    if (phase !== 'ready_for_query') {
      try {
        const onboardingResponse = await generateOnboardingResponse(message, phase)
        return new Response(
          JSON.stringify({ response: onboardingResponse }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        console.error('Onboarding error:', error)
        // Provide fallback response for onboarding
        const fallbackResponse = getFallbackOnboardingResponse(phase)
        return new Response(
          JSON.stringify({ response: fallbackResponse }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Handle main query phase
    if (!businessType || !location) {
      return createErrorResponse(ERROR_TYPES.INVALID_REQUEST, 400)
    }

    try {
      // Get cultural insights from Qloo
      const insights = await getQlooInsights(location, businessType)
      
      // Build enhanced prompt with cultural context
      const prompt = buildCulturalPrompt(message, insights, location, businessType)
      
      // Get AI response
      const aiResponse = await callLLM(prompt)
      
      return new Response(
        JSON.stringify({ response: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('Error in main query processing:', error)
      
      // Determine error type and return appropriate response
      if (error.message === ERROR_TYPES.QLOO_API_ERROR) {
        return createErrorResponse(ERROR_TYPES.QLOO_API_ERROR, 503)
      } else if (error.message === ERROR_TYPES.LLM_API_ERROR) {
        return createErrorResponse(ERROR_TYPES.LLM_API_ERROR, 503)
      } else if (error.message === ERROR_TYPES.MISSING_API_KEYS) {
        return createErrorResponse(ERROR_TYPES.MISSING_API_KEYS, 503)
      } else {
        return createErrorResponse(ERROR_TYPES.GENERAL_ERROR, 500)
      }
    }
  } catch (error) {
    console.error('Unexpected error in chat orchestrator:', error)
    return createErrorResponse(ERROR_TYPES.GENERAL_ERROR, 500)
  }
})