
// Follow this setup guide to integrate the Deno runtime:
// https://deno.com/manual/getting_started/setup_your_environment
// This allows the Edge Function to connect to external services like OpenAI

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";

if (!OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is not set");
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const initialSystemMessage: Message = {
  role: "system",
  content: `You are StudyHub's AI assistant, designed to help students excel in their academic journey. 
  Your primary roles are:
  
  1. Explaining difficult concepts in simple terms
  2. Helping with study planning and organization
  3. Providing learning strategies and memorization techniques
  4. Suggesting resources for deeper understanding
  5. Offering encouragement and motivation

  Always be helpful, friendly, and focused on education. Do not provide answers to specific homework
  questions, but instead guide the student through the problem-solving process. Keep responses concise,
  accurate, and tailored to students.
  `
};

serve(async (req) => {
  try {
    // Check for API key
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured. Please set the OPENAI_API_KEY environment variable.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse request
    const { message, history = [] } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: "No message provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Prepare conversation history for OpenAI
    const messages: Message[] = [
      initialSystemMessage,
      ...history.slice(-10), // Only use the last 10 messages to avoid token limits
      { role: "user", content: message }
    ];

    // Call OpenAI API
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // You can change this to another model if needed
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to get response from OpenAI" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await openAIResponse.json();
    const assistantResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        message: assistantResponse,
        model: data.model,
        usage: data.usage
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

// To deploy this Edge Function after connecting to Supabase:
// 1. Save this file in your Supabase project as /supabase/functions/chat/index.ts
// 2. Set your OPENAI_API_KEY in the Supabase Dashboard under Settings > API > Edge Function Secrets
// 3. Deploy with: supabase functions deploy chat
// 4. Test with: curl -i --location --request POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/chat' \
//    --header 'Authorization: Bearer YOUR_ANON_KEY' \
//    --header 'Content-Type: application/json' \
//    --data '{"message":"Tell me about quantum physics"}'
