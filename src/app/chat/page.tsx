// "use client";

// import React, { useState, useEffect, useRef, FormEvent } from "react";
// import axios from "axios";
// import ReactMarkdown from 'react-markdown';

// interface ChatMessage {
//   user: string;
//   message: string;
// }

// export default function Chat() {
//   const [input, setInput] = useState<string>("");
//   const [chat, setChat] = useState<ChatMessage[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
//   const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for scrolling

//   // Scroll to bottom when a new message is added
//   useEffect(() => {
//     const scrollToBottom = () => {
//       if (chatContainerRef.current) {
//         chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//       }
//     };

//     scrollToBottom(); // Directly call without requestAnimationFrame

//   }, [chat]);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     // Add user input to chat
//     setChat((prevChat) => [...prevChat, { user: "User", message: input }]);
    
//     setIsLoading(true); // Start loading

//     try {
//       // Send request to backend API
//       const response = await axios.post("/api/chat", { 
//         question: input, 
//         history: chat, 
//       });

//       // Add bot's response to chat
//       setChat((prevChat) => [
//         ...prevChat,
//         { user: "Bot", message: response.data.answer },
//       ]);
//     } catch (error) {
//       console.error("Error fetching response:", error);
//       setChat((prevChat) => [
//         ...prevChat,
//         { user: "Bot", message: "Error: Unable to fetch response or resource exhausted. Try again later." },
//       ]);
//     } finally {
//       setIsLoading(false); // Stop loading
//       setInput(""); // Clear input after sending
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-900 text-white">
//       <div className="flex flex-col items-center pb-4 pt-20 justify-between flex-1">
//         <div
//           ref={chatContainerRef} // Reference for scrolling
//           className="flex flex-col w-full max-w-3xl max-h-[70vh] p-4 overflow-y-auto mb-16"
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
        
//         {/* Form for user input */}
//         <form
//           onSubmit={handleSubmit}
//           className="fixed bottom-0 w-full max-w-3xl bg-gray-800 p-3 mb-5 flex border border-gray-600 rounded z-20"
//         >
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask a question..."
//             className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2" // Added margin-right (mr-2)
//             required
//             disabled={isLoading} // Disable input while loading
//           />

//           <button
//             type="submit"
//             className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition ${
//               isLoading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={isLoading} // Disable button while loading
//           >
//             {isLoading ? "Sending..." : "Send"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image'; // For using images from public folder

interface ChatMessage {
  user: string;
  message: string;
}
export default function Chat() {
  const [input, setInput] = useState<string>("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setChat((prevChat) => [...prevChat, { user: "User", message: input }]);
    setRecentPrompts((prevPrompts) => [...prevPrompts, input]);
    setIsLoading(true);

    try {
      const response = await axios.post("/api/chat", { question: input, history: chat });
      setChat((prevChat) => [
        ...prevChat,
        { user: "Bot", message: response.data.answer },
      ]);
    } catch (error) {
      setChat((prevChat) => [
        ...prevChat,
        { user: "Bot", message: "Error: Unable to fetch response." },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleNewChat = () => {
    setChat([]);
    setInput("");
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 p-4 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-30`}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white mb-4"
        >
          <Image src="/menu_icon.png" alt="Menu" width={24} height={24} />
        </button>

        <button
          onClick={handleNewChat}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 flex items-center"
        >
          <Image
            src="/plus_icon.png"
            alt="New Chat"
            width={20}
            height={20}
            className="mr-2"
          />
          New Chat
        </button>

        <h3 className="text-md font-semibold mb-2">Recent Prompts</h3>
        {recentPrompts.length > 0 ? (
          <ul>
            {recentPrompts.map((prompt, index) => (
              <li
                key={index}
                className="cursor-pointer mb-2 text-blue-300"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent prompts available</p>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col items-center pb-4 pt-20 justify-between flex-1">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-10"
        >
          <Image src="/menu_icon.png" alt="Menu" width={24} height={24} />
        </button>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex flex-col w-full max-w-3xl max-h-[70vh] p-4 overflow-y-auto mb-16"
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

        {/* User Input Form */}
        <form
          onSubmit={handleSubmit}
          className="fixed bottom-0 w-full max-w-3xl bg-gray-800 p-3 mb-5 flex border border-gray-600 rounded z-20"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}