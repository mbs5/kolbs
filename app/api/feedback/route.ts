import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from "openai";
import { getCurrentUser } from '@/lib/user';

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized, please sign in" },
        { status: 401 }
      );
    }

    const cycleData = await request.json();

    // Check for required fields
    if (!cycleData.title || 
        !cycleData.concreteExperience || 
        !cycleData.reflectiveObservation || 
        !cycleData.abstractConceptualization || 
        !cycleData.activeExperimentation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare the prompt for the OpenAI API
    const prompt = `
      Please analyze the following learning cycle entries based on Kolb's Experiential Learning Cycle and provide feedback.
      The learning cycle consists of four stages: Concrete Experience, Reflective Observation, Abstract Conceptualization, and Active Experimentation.
      
      Learning Cycle Title: ${cycleData.title}
      Skill: ${cycleData.skill?.name || "Not specified"}
      
      Concrete Experience: ${cycleData.concreteExperience}
      
      Reflective Observation: ${cycleData.reflectiveObservation}
      
      Abstract Conceptualization: ${cycleData.abstractConceptualization}
      
      Active Experimentation: ${cycleData.activeExperimentation}
      
      For each stage, please:
      1. Rate the entry on a scale of 1-10
      2. Provide specific feedback on what was done well
      3. Suggest improvements or questions to consider
      4. Recommend resources or next steps if applicable
      
      Also provide an overall evaluation of the learning cycle and how well the stages connect to each other.
      Format your response in JSON with the following structure:
      {
        "concreteExperience": { "rating": number, "feedback": string },
        "reflectiveObservation": { "rating": number, "feedback": string },
        "abstractConceptualization": { "rating": number, "feedback": string },
        "activeExperimentation": { "rating": number, "feedback": string },
        "overallFeedback": string
      }
    `;

    // Call the OpenAI API to generate feedback
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content:
            "You are an expert learning coach who specializes in Kolb's Experiential Learning Cycle. Your goal is to provide constructive, actionable feedback to help learners improve their learning process.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    // Parse the OpenAI API response
    const response = completion.choices[0].message.content;
    const parsedResponse = JSON.parse(response || "{}");

    // Return the feedback to the client
    return NextResponse.json({ feedback: parsedResponse });
  } catch (error) {
    console.error("Error generating feedback:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
} 