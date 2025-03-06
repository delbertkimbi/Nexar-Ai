export interface DeepSeekMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface DeepSeekCompletionParams {
  model: string
  messages: DeepSeekMessage[]
  max_tokens?: number
  temperature?: number
  top_p?: number
  stream?: boolean
  stop?: string | string[]
}

export interface DeepSeekCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

export async function generateCompletion(params: DeepSeekCompletionParams): Promise<DeepSeekCompletionResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    throw new Error("DeepSeek API key is not defined")
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: params.messages,
      max_tokens: params.max_tokens || 500,
      temperature: params.temperature || 0.7,
      top_p: params.top_p || 1,
      stream: params.stream || false,
      stop: params.stop || null,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`DeepSeek API error: ${error.error?.message || "Unknown error"}`)
  }

  return response.json()
}

export async function generatePromptSuggestion(category: string, context?: string): Promise<string> {
  const messages: DeepSeekMessage[] = [
    {
      role: "system",
      content: "You are a helpful assistant specialized in creating high-quality AI prompts.",
    },
    {
      role: "user",
      content: `Generate a high-quality AI prompt for the category: ${category}.
${context ? `Context or additional information: ${context}` : ""}

The prompt should be detailed, clear, and effective for generating good AI responses.
Format the prompt professionally and make it ready to use.`,
    },
  ]

  const completion = await generateCompletion({
    model: "deepseek-chat",
    messages,
    max_tokens: 300,
    temperature: 0.8,
  })

  return completion.choices[0].message.content.trim()
}

export async function improvePrompt(originalPrompt: string, feedback?: string): Promise<string> {
  const messages: DeepSeekMessage[] = [
    {
      role: "system",
      content: "You are a helpful assistant specialized in improving AI prompts.",
    },
    {
      role: "user",
      content: `Improve the following AI prompt:

"${originalPrompt}"

${feedback ? `Based on this feedback: ${feedback}` : ""}

Make the prompt more detailed, clear, and effective. Add specific instructions, context, or constraints that would help an AI generate better responses.`,
    },
  ]

  const completion = await generateCompletion({
    model: "deepseek-chat",
    messages,
    max_tokens: 400,
    temperature: 0.7,
  })

  return completion.choices[0].message.content.trim()
}

