"use client";

import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"

const people = [
  {
    id: 1,
    name: "Ekansh Juneja",
    designation: "AI Engineer | Full Stack Developer",
    image:
      "/ekansh.jpg",
  },
  {
    id: 2,
    name: "Naveen Sharma",
    designation: "AI Engineer | Full Stack Developer",
    image:
      "/naveen.jpg",
  },
  {
    id: 3,
    name: "Megha Mandal",
    designation: "R&D Engineer",
    image:
      "/ekansh.jpg",
  },
];

export default function AboutUs() {
  return (
    <div className="h-[100vh] bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 overflow-y-auto">
      {/* Header Section */}
      <div className="w-full bg-[#1e293b] py-10">
        <div className="ml-8">
          <h2 className="text-white text-lg">Learn More About</h2>
          <h1 className="font-bold text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
            About Us
          </h1>
        </div>
      </div>

      {/* About Us Content */}
      <div className="min-h-[90vh] w-full flex items-start justify-center px-4 sm:px-6 md:px-8 lg:px-10 mt-4 md:mt-8 mb-12">
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-input bg-[#1e293b]">
          <h1 className="font-bold text-xl md:text-2xl text-white text-left">
            LEGALAID-AI: Revolutionizing Legal Operations with AI
          </h1>
          <p className="text-white mt-4">
            Legal operations are often complex, requiring deep expertise in legal language,
            compliance standards, and risk management. LEGALAID-AI is here to simplify that.
            Our platform leverages cutting-edge Natural Language Processing (NLP) and Large
            Language Models (LLMs) to automate legal document review, making it faster and more
            accessible for everyone—whether you're a legal professional or someone without legal
            expertise.
          </p>
          <p className="text-white mt-4">
            With LEGALAID-AI, users can upload legal documents (PDF, Word, or text) for automated
            analysis and extraction of key clauses. Our AI-powered chatbot provides real-time assistance
            with general legal queries, while our educational hub offers valuable resources for learning about
            various legal topics like contract law and intellectual property.
          </p>
          <p className="text-white mt-4">
            By reducing manual effort, minimizing errors, and providing instant access to legal knowledge,
            LEGALAID-AI empowers individuals and businesses to navigate legal challenges with confidence.
          </p>

          {/* Developer Credits */}
          <div className="flex flex-row items-center justify-center mb-10 w-full mt-8 p-4 bg-[#334155] rounded-md">
            <AnimatedTooltip items={people} />
          </div>
        </div>
      </div>
    </div>
  );
}