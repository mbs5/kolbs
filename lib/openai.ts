import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface FeedbackResult {
  concreteExperience: {
    rating: number;
    feedback: string;
  };
  reflectiveObservation: {
    rating: number;
    feedback: string;
  };
  abstractConceptualization: {
    rating: number;
    feedback: string;
  };
  activeExperimentation: {
    rating: number;
    feedback: string;
  };
  overallFeedback: string;
}

export async function analyzeLearningCycle(cycle: {
  title: string;
  concreteExperience: string;
  reflectiveObservation: string;
  abstractConceptualization: string;
  activeExperimentation: string;
}) {
  try {
    const prompt = `
    Please analyze the following learning cycle based on Kolb's Experiential Learning Theory.
    Rate each section on a scale of 1-10 and provide specific, constructive feedback.
    
    LEARNING CYCLE TITLE: ${cycle.title}
    
    CONCRETE EXPERIENCE:
    ${cycle.concreteExperience}
    
    REFLECTIVE OBSERVATION:
    ${cycle.reflectiveObservation}
    
    ABSTRACT CONCEPTUALIZATION:
    ${cycle.abstractConceptualization}
    
    ACTIVE EXPERIMENTATION:
    ${cycle.activeExperimentation}
    
    Please format your response as JSON with the following structure:
    {
      "concreteExperience": {
        "rating": number,
        "feedback": "specific feedback"
      },
      "reflectiveObservation": {
        "rating": number,
        "feedback": "specific feedback"
      },
      "abstractConceptualization": {
        "rating": number,
        "feedback": "specific feedback"
      },
      "activeExperimentation": {
        "rating": number,
        "feedback": "specific feedback"
      },
      "overallFeedback": "general feedback on the entire learning cycle"
    }
    
    For each section, evaluate:
    1. Depth and specificity of the content
    2. Adherence to the principles of that stage in Kolb's cycle
    3. Clarity of expression
    4. Potential for learning and growth
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: "You are an expert in learning theory and educational psychology, specializing in Kolb's Experiential Learning Cycle. Your task is to analyze learning cycle entries and provide constructive feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    return JSON.parse(content) as FeedbackResult;
  } catch (error) {
    console.error('Error analyzing learning cycle:', error);
    throw error;
  }
} 