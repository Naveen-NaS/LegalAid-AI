// "use client";

// import React from "react";
// import { useState, useEffect, useRef, FormEvent } from "react";
// import axios from "axios";
// import ReactMarkdown from 'react-markdown';
// import { div } from "framer-motion/client";

// interface ChatMessage {
//   user: string;
//   message: string;
// }

// export default function Chat()  {
//   const [input, setInput] = useState<string>("");
//   const [chat, setChat] = useState<ChatMessage[]>([]);
//   const [databaseMode, setDatabaseMode] = useState<boolean>(false);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const newChat = [...chat, { user: "User", message: input }];
//     setChat(newChat);

//     try {
//       const response = await axios.post("/api/chat", { question: input, history: chat, dbmode: databaseMode });
//       setChat((prevChat) => [...prevChat, { user: "Bot", message: response.data.answer }]);
//     } catch (error) {
//       setChat((prevChat) => [...prevChat, { user: "Bot", message: "Error: Unable to fetch response Or Resource Exhausted, try again later" }]);
//     }

//     setInput("");
// };


//   return (
//     <div className="flex min-h-screen bg-gray-900 text-white">
//       <div className="flex flex-col items-center pb-4 pt-20 justify-between flex-1">
//         <div
//           // ref={chatContainerRef}
//           className="flex flex-col w-full max-w-3xl h-full p-4 overflow-y-auto mb-16"
//         >
//           {chat.map((chatItem, index) => (
//             <div
//               key={index}
//               className={`chat-message ${
//                 chatItem.user === "User"
//                   ? "self-end bg-blue-500 text-white"
//                   : "self-start bg-gray-700 text-white"
//               } p-3 rounded mb-2 w-fit max-w-[75%]`}
//             >
//               <ReactMarkdown>{chatItem.message}</ReactMarkdown>
//             </div>
//           ))}
//         </div>
//         <form
//           onSubmit={handleSubmit}
//           className="fixed bottom-0 w-full max-w-3xl bg-gray-800 p-3 mb-5 flex border border-gray-600 rounded z-20" // Set a higher z-index for the form
//         >
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask a question..."
//             className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <label className="flex items-center ml-3">
//             <input
//               type="checkbox"
//               checked={databaseMode}
//               onChange={() => setDatabaseMode(!databaseMode)}
//               className="hidden"
//             />
//             <span className="relative inline-block w-12 h-6 mr-3 bg-gray-500 rounded-full cursor-pointer">
//               <span
//                 className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
//                   databaseMode ? "transform translate-x-6 bg-orange-600" : ""
//                 }`}
//               />
//             </span>
//           </label>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
//           >
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// };





"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  user: string;
  message: string;
}

export default function Chat() {
  const [input, setInput] = useState<string>("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [databaseMode, setDatabaseMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for scrolling

  // Scroll to bottom when a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user input to chat
    setChat((prevChat) => [...prevChat, { user: "User", message: input }]);
    
    setIsLoading(true); // Start loading

    try {
      // Send request to backend API
      const response = await axios.post("/api/chat", { 
        question: input, 
        history: chat, 
        dbmode: databaseMode 
      });

      // Add bot's response to chat
      setChat((prevChat) => [
        ...prevChat,
        { user: "Bot", message: response.data.answer },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setChat((prevChat) => [
        ...prevChat,
        { user: "Bot", message: "Error: Unable to fetch response or resource exhausted. Try again later." },
      ]);
    } finally {
      setIsLoading(false); // Stop loading
      setInput(""); // Clear input after sending
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center pb-4 pt-20 justify-between flex-1">
        <div
          ref={chatContainerRef} // Reference for scrolling
          className="flex flex-col w-full max-w-3xl h-full p-4 overflow-y-auto mb-16"
        >
          {chat.map((chatItem, index) => (
            <div
              key={index}
              className={`chat-message ${
                chatItem.user === "User"
                  ? "self-end bg-blue-500 text-white"
                  : "self-start bg-gray-700 text-white"
              } p-3 rounded mb-2 w-fit max-w-[75%]`}
            >
              <ReactMarkdown>{chatItem.message}</ReactMarkdown>
            </div>
          ))}
        </div>
        
        {/* Form for user input */}
        <form
          onSubmit={handleSubmit}
          className="fixed bottom-0 w-full max-w-3xl bg-gray-800 p-3 mb-5 flex border border-gray-600 rounded z-20"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading} // Disable input while loading
          />
          
          {/* Toggle switch for database mode */}
          <label className="flex items-center ml-3">
            <input
              type="checkbox"
              checked={databaseMode}
              onChange={() => setDatabaseMode(!databaseMode)}
              className="hidden"
            />
            <span className="relative inline-block w-12 h-6 mr-3 bg-gray-500 rounded-full cursor-pointer">
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  databaseMode ? "transform translate-x-6 bg-orange-600" : ""
                }`}
              />
            </span>
          </label>

          {/* Submit button */}
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}