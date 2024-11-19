"use client";

import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";



// Add LinkedIn URLs for each person
const people = [
  {
    id: 1,
    name: "Megha Mandal",
    designation: "AI Engineer | Full Stack Developer",
    image: "/megha.jpg",
    linkedin: "https://www.linkedin.com/in/megha-mandal-78556a286", // Megha's LinkedIn URL
  },
  {
    id: 2,
    name: "Ekansh Juneja",
    designation: "AI Engineer | Full Stack Developer",
    image: "/ekansh.jpg",
    linkedin: "https://www.linkedin.com/in/ekansh-juneja-46991b249",
  },
  {
    id: 3,
    name: "Naveen Sharma",
    designation: "AI Engineer | Full Stack Developer",
    image: "/naveen.jpg",
    linkedin: "https://www.linkedin.com/in/naveen-sharma-871b7a257", // Naveen's LinkedIn URL
  },
];



export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 overflow-hidden">
      {/* Header Section */}
      <div className="w-full bg-[#1e293b] py-8"> {/* Adjusted padding to match Contact Us */}
        <div className="ml-8">
          <h2 className="text-white text-sm mb-1">Learn More About</h2> {/* Same margin as Contact Us */}
          <h1 className="font-bold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
            About Us
          </h1>
        </div>
      </div>

      {/* About Us Content */}
      <div className="min-h-[85vh] w-full flex items-start justify-center px-4 sm:px-6 md:px-8 lg:px-10 mt-4 mb-0">
        {/* Card Section - Wider and Larger */}
        <div
          className="relative w-full max-w-[1100px] mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-input bg-[#1e293b]"
          style={{
            width: "90%", // Makes the card take up 90% of the page width
            maxWidth: "1100px", // Ensures it doesn’t get too wide on large screens
          }}
        >
          <h1 className="font-bold text-lg md:text-xl text-white text-left"> {/* Reduced font size */}
            LEGALAID-AI: Revolutionizing Legal Operations with AI
          </h1>
          <p className="text-white mt-2"> {/* Reduced margin */}
            We believe in simplifying the complexities of the legal world. 
            Our mission is to empower individuals and businesses by merging cutting-edge technology with 
            expert legal insights. Whether you're a seasoned legal professional or someone navigating legal challenges for the 
            first time, our platform is an initiative to provide tools, resources, and support needed to tackle legal matters with ease and confidence.
          </p>
          <p className="text-white mt-2"> {/* Reduced margin */}
            LEGALAID-AI is your all-in-one legal assistant, offering automated, AI-powered legal reply generation, and educational content on topics like reform laws, data privacy, and AI. 
            Our interactive chatbot provides instant answers to general legal queries. Accessible, efficient, and intuitive, our platform transforms how you handle legal tasks.
          </p>

          {/* Subheading for Objectives */}
          <h2 className="font-bold text-lg md:text-xl text-white mt-4">Objectives</h2> {/* Reduced margin */}

          {/* Replace Paragraph with Bullet Points */}
          <ul className="list-disc list-inside text-white mt-2 space-y-1"> {/* Reduced spacing */}
            <li>Bridge the gap between legal expertise and accessibility through advanced AI tools.</li>
            <li>Provide an AI-powered chatbot for real-time legal assistance and guidance.</li>
            <li>Offer tailored legal replies to notices and contracts using LLM-powered templates.</li>
            <li>Deliver educational content to foster a deeper understanding of legal rights and responsibilities.</li>
            <li>Empower users to make informed decisions and confidently navigate legal challenges.</li>
          </ul>

          {/* Developer Credits - Smaller Photo Section Aligned Right */}
          <div
            className="absolute bottom-4 right-4 flex items-center justify-center p-1 bg-[#334155] rounded-md"
            style={{ width: '120px', height: '50px' }} // Smaller box size for photos
          >
            {/* Centering images inside the light blue box */}
            <div className="flex justify-center items-center w-full h-full">
              <AnimatedTooltip items={people} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}