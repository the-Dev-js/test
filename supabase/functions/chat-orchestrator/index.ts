import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface ChatRequest {
  message: string
  phase: 'onboarding_sub_phase' | 'strategic' | 'fetch_qloo_insights'
  onboardingSubPhase?: string
  userBusinessType?: string
  targetLocation?: string
  qlooInsights?: QlooInsight
}

interface OnboardingResponse {
  response: string
  nextPhase: string
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
    // Build query parameters according to Qloo v2 API documentation
    const params = new URLSearchParams({
      'filter.location.query': location,
      'filter.type': 'urn:entity:place'
    })
    
    // Note: signal.interests.entities is optional but could be added later
    // for more personalized insights based on business type
    
    // Construct the full URL with query parameters
    const apiUrl = `https://hackathon.api.qloo.com/v2/insights?${params.toString()}`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Api-Key': qlooApiKey,
        'Content-Type': 'application/json'
      }
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
Please provide a comprehensive, detailed analysis structured in exactly 4 sections. Be thorough and specific - your goal is to give the user immediately actionable intelligence they can implement:

1. **Deep Cultural Analysis** (200-300 words):
   - Explain HOW the cultural preferences, trends, and clusters specifically impact this business type
   - Identify cultural opportunities and potential pitfalls
   - Analyze consumer behavior patterns relevant to this business
   - Discuss cultural nuances that competitors might miss

2. **Strategic Recommendations** (300-400 words):
   - Provide 4-5 specific, actionable strategies with concrete examples
   - For each strategy, explain: WHAT to do, HOW to implement it, and WHY it works in this culture
   - Include specific tactics: pricing approaches, product adaptations, marketing messages, distribution channels
   - Reference successful case studies or approaches when possible

3. **Implementation Roadmap** (200-250 words):
   - Provide a step-by-step action plan with timelines
   - Identify key resources needed (budget, partnerships, staff)
   - Highlight critical success factors and potential obstacles
   - Suggest metrics to track progress and success

4. **Cultural Intelligence Insights** (150-200 words):
   - Share insider knowledge about local business practices
   - Explain cultural do's and don'ts specific to this business type
   - Provide communication tips and relationship-building advice
   - Mention seasonal considerations, holidays, or cultural events that could impact business

TONE & STYLE:
- Write as an expert consultant who has deep experience in this market
- Use specific examples, numbers, and concrete details whenever possible
- Be direct and actionable - avoid generic advice
- Reference the cultural data provided to justify your recommendations
- Focus on competitive advantages the user can gain through cultural intelligence`
}

// Enhanced onboarding prompt with clearer instructions
function buildOnboardingPrompt(message: string, subPhase: string, nextPhase: string): string {
  const basePrompt = `Vous êtes un Assistant d'Intelligence Culturelle aidant les entreprises à s'étendre à l'international. Guidez les utilisateurs à travers notre processus d'onboarding de manière naturelle et conversationnelle.

Phase actuelle: ${subPhase}
Prochaine phase: ${nextPhase}
Message utilisateur: ${message}

Instructions:
- Soyez chaleureux, professionnel et encourageant
- Répondez de manière claire et concise
- Gardez les réponses courtes (moins de 150 mots)
- Utilisez un ton conversationnel en français
- Expliquez les fonctionnalités et cas d'usage de l'application`

  switch (subPhase) {
    case 'initial_question':
      return `${basePrompt}

L'utilisateur vient de poser sa première question. Accueillez-le et expliquez les capacités de l'application Cultural AI. Encouragez-le à poser des questions sur le fonctionnement, les cas d'usage, ou les fonctionnalités.`

    case 'explaining_app':
      return `${basePrompt}

L'utilisateur pose des questions sur l'application. Expliquez comment Cultural AI fonctionne, ses cas d'usage (restaurants, e-commerce, startups, etc.), et comment l'IA culturelle peut les aider. Mentionnez qu'ils peuvent cliquer sur le bouton de démarrage quand ils sont prêts pour une analyse personnalisée.`

    default:
      return `${basePrompt}

Répondez de manière utile au message de l'utilisateur et guidez-le vers une meilleure compréhension de l'application.`
  }
}

// Call Gemini API (prioritized)
async function callGemini(prompt: string): Promise<string> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
  
  if (!geminiApiKey) {
    throw new Error('Gemini API key not configured')
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
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

// Call Gemini LLM
async function callLLM(prompt: string): Promise<string> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

  // Check if Gemini API key is configured
  if (!geminiApiKey) {
    throw new Error(ERROR_TYPES.MISSING_API_KEYS)
  }

  // Call Gemini API
  try {
    console.log('Calling Gemini API...')
    return await callGemini(prompt)
  } catch (error) {
    console.error('Gemini API failed:', error)
    throw new Error(ERROR_TYPES.LLM_API_ERROR)
  }

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
async function generateOnboardingResponse(message: string, subPhase: string): Promise<OnboardingResponse> {
  // Determine next sub-phase based on current sub-phase and user message
  let nextPhase = subPhase
  
  if (subPhase === 'initial_question') {
    // Check if user is asking for explanations
    if (message.toLowerCase().includes('comment') || 
        message.toLowerCase().includes('fonctionn') || 
        message.toLowerCase().includes('utilise') || 
        message.toLowerCase().includes('marche') || 
        message.toLowerCase().includes('explique') ||
        message.toLowerCase().includes('how') ||
        message.toLowerCase().includes('what') ||
        message.toLowerCase().includes('explain')) {
      nextPhase = 'explaining_app'
    }
    // Otherwise stay in initial_question phase
  } else if (subPhase === 'explaining_app') {
    // Stay in explaining_app phase for follow-up questions
    nextPhase = 'explaining_app'
  }

  const prompt = buildOnboardingPrompt(message, subPhase, nextPhase)
  
  try {
    const response = await callLLM(prompt)
    return { response, nextPhase }
  } catch (error) {
    console.error('Error generating onboarding response:', error)
    throw new Error(ERROR_TYPES.ONBOARDING_ERROR)
  }
}

// Fallback onboarding responses
function getFallbackOnboardingResponse(subPhase: string, message: string): OnboardingResponse {
  // Determine next sub-phase (same logic as in generateOnboardingResponse)
  let nextPhase = subPhase
  
  if (subPhase === 'initial_question') {
    if (message.toLowerCase().includes('comment') || 
        message.toLowerCase().includes('fonctionn') || 
        message.toLowerCase().includes('utilise') || 
        message.toLowerCase().includes('marche') || 
        message.toLowerCase().includes('explique') ||
        message.toLowerCase().includes('how') ||
        message.toLowerCase().includes('what') ||
        message.toLowerCase().includes('explain')) {
      nextPhase = 'explaining_app'
    }
  } else if (subPhase === 'explaining_app') {
    nextPhase = 'explaining_app'
  }

  let response: string
  switch (subPhase) {
    case 'initial_question':
      response = "Bonjour ! Je suis votre Assistant IA Culturel. Je peux vous expliquer comment cette application fonctionne, quels sont ses cas d'usage, et comment l'intelligence artificielle culturelle peut vous aider dans votre expansion internationale. Que souhaitez-vous savoir ?"
      break
    
    case 'explaining_app':
      response = "Cette application utilise l'API Qloo et l'IA Gemini pour vous fournir des insights culturels personnalisés. Elle peut vous aider à comprendre les préférences locales, les tendances culturelles, et les opportunités de marché dans n'importe quel pays. Avez-vous d'autres questions sur son fonctionnement ?"
      break
    
    default:
      response = "Je suis là pour vous aider à comprendre les préférences culturelles pour l'expansion internationale des entreprises. Que souhaitez-vous savoir ?"
      break
  }
  
  return { response, nextPhase }
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

    const { message, phase } = requestData

    if (!phase || (phase !== 'fetch_qloo_insights' && !message)) {
      return createErrorResponse(ERROR_TYPES.INVALID_REQUEST, 400)
    }

    // Handle different phases
    if (phase === 'fetch_qloo_insights') {
      // Handle Qloo insights fetching
      const { targetLocation, userBusinessType } = requestData
      
      if (!targetLocation || !userBusinessType) {
        return createErrorResponse(ERROR_TYPES.INVALID_REQUEST, 400)
      }

      try {
        const insights = await getQlooInsights(targetLocation, userBusinessType)
        return new Response(
          JSON.stringify(insights),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        console.error('Error fetching Qloo insights:', error)
        if (error.message === ERROR_TYPES.QLOO_API_ERROR) {
          return createErrorResponse(ERROR_TYPES.QLOO_API_ERROR, 503)
        } else {
          return createErrorResponse(ERROR_TYPES.GENERAL_ERROR, 500)
        }
      }
    } else if (phase === 'onboarding_sub_phase') {
      // Handle onboarding sub-phases
      const { onboardingSubPhase } = requestData
      
      if (!onboardingSubPhase) {
        return createErrorResponse(ERROR_TYPES.INVALID_REQUEST, 400)
      }

      try {
        const onboardingResult = await generateOnboardingResponse(message, onboardingSubPhase)
        return new Response(
          JSON.stringify({ 
            response: onboardingResult.response, 
            nextPhase: onboardingResult.nextPhase 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        console.error('Onboarding error:', error)
        // Provide fallback response for onboarding
        const fallbackResult = getFallbackOnboardingResponse(onboardingSubPhase, message)
        return new Response(
          JSON.stringify({ 
            response: fallbackResult.response, 
            nextPhase: fallbackResult.nextPhase 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } else if (phase === 'strategic') {
      // Handle strategic phase with Qloo insights
      const { targetLocation, userBusinessType, qlooInsights } = requestData
      
      if (!targetLocation || !userBusinessType || !qlooInsights) {
        return createErrorResponse(ERROR_TYPES.INVALID_REQUEST, 400)
      }

      try {
        // Build enhanced prompt with cultural context
        const prompt = buildCulturalPrompt(message, qlooInsights, targetLocation, userBusinessType)
        
        // Get AI response
        const aiResponse = await callLLM(prompt)
        
        return new Response(
          JSON.stringify({ response: aiResponse }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        console.error('Error in strategic query processing:', error)
        
        if (error.message === ERROR_TYPES.LLM_API_ERROR) {
          return createErrorResponse(ERROR_TYPES.LLM_API_ERROR, 503)
        } else if (error.message === ERROR_TYPES.MISSING_API_KEYS) {
          return createErrorResponse(ERROR_TYPES.MISSING_API_KEYS, 503)
        } else {
          return createErrorResponse(ERROR_TYPES.GENERAL_ERROR, 500)
        }
      }
    } else {
      return createErrorResponse(ERROR_TYPES.INVALID_REQUEST, 400)
    }

  } catch (error) {
    console.error('Unexpected error in chat orchestrator:', error)
    return createErrorResponse(ERROR_TYPES.GENERAL_ERROR, 500)
  }
})