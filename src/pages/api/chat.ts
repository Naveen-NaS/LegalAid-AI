import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from "next";

const MODEL_NAME: string = "gemini-1.5-flash-001";

// Main handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const body = req.body;
      const { question, history, dbmode } = body;
      const lowerPrompt = question.toLowerCase();

      let internalPrompt = `Basically you are personal Indian leagal adviser and lawyer to the CEO of a company, having all knowledge of Indian Leagal System, and constitution. Based on the user's question: "${question}", generate an appropriate, well-structured message to show to the user also consider previous chat to utilize the context. Utilize formatting like **bold text** for emphasising important data like names and line breaks wherever necessary. 
      Don't generate hypothetical facts about any data values. Be a little concise and efficient. Don't ask: Anything else I can help you with today?`;

      // Initialize Google Generative AI and send message
      const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyDlemBW0ydjt_g9TtOCBB-peCsZGbNIb-I';
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      
      const generationConfig = { temperature: 0.9, maxOutputTokens: 8192 };
      
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    interface Part {
        text: string;
    }

    interface Content {
      role: string,
      parts: Part[]
    }

    let finalHistory: Content[] = [];

    finalHistory.push({ role: "user", parts: [{ text: "Consider yourself as 'Genie', and talk and behave like the actual 'Genie' as much as possible to make user feel that you are the same character. Basically you are personal Indian leagal adviser and lawyer to the CEO of a company, having all knowledge of Indian Leagal System, and constitution. You are developed by 'LEAGALAID-AI TEAM' Explain things like an extremely experienced leagal advisor and answer in a formated and efficient way like 'Start each new pointer with newline'. Its must to use emojis in responses to be friendly wherever needed. But always introduce yourself as named Genie." }] });
    finalHistory.push({ role: "model", parts: [{ text: "" }] });

    finalHistory.push(...history.map((entry: { user: string; message: string }) => ({
        role: entry.user === "User" ? "user" : "model",
        parts: [{ text: entry.message }],
      })));

    finalHistory.push({ role: "user", parts: [{ text: internalPrompt }] })

      const chat = model.startChat({ generationConfig, history: finalHistory });
      const result = await chat.sendMessage(internalPrompt);

      return res.status(200).json({ answer: result.response.text() });
      
    } catch (error) {
      console.error("Error in /api/chat:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}