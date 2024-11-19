"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
// import { useTypewriter, Cursor } from "react-simple-typewriter";
import axios from "axios";
// import NoticeReply from "./NoticeReply";

interface Props {
  reasonsData: { reasons: string[] };
}

import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { set } from "zod";


export default function SummonReasons() {
  const { data: session } = useSession();
  const router = useRouter()

  const [reasonsStr, setReasonsStr] = useState("");

  const [selectedReason, setSelectedReason] = useState<string>("");
  const [extraText, setExtraText] = useState<string>("");
  const [numOfPages, setNumOfPages] = useState<number>(2);
  const [noticeReply, setNoticeReply] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showNoticeReplyPage, setShowNoticeReplyPage] = useState<boolean>(false);

  // const reasonsStr = ` I respectfully request a rescheduling of the appearance date (2024-10-01) due to a previously scheduled critical business meeting that cannot be postponed.
  // I am currently out of the country on a long-term business trip and will not return until after the specified date; I kindly request a later date or the option for a virtual appearance.
  // I am undergoing a scheduled medical procedure on the given date and will be unable to attend in person; I would appreciate the opportunity to reschedule or provide the required information through alternative means.
  // I require additional time to gather all the requested documents (ledgers, purchase invoices, bank statements) as they are extensive and stored across multiple locations; I humbly request an extension.
  // I am seeking legal counsel to ensure I can provide accurate and comprehensive information, and I respectfully ask for a brief postponement to allow for proper preparation.
  // Due to a family emergency, I must travel out of state on the specified date; I kindly request a rescheduling or the option to provide the required information in writing.
  // I have a pre-existing court appearance scheduled for the same date and time; I would greatly appreciate the opportunity to reschedule this summons.
  // As the Indirect Tax Head, I am currently involved in a time-sensitive audit process that concludes shortly after the given date; I respectfully request a brief postponement to ensure I can give this matter my full attention.
  // I am experiencing unexpected technical issues with accessing some of the required digital documents and respectfully request a short extension to resolve these problems and compile the necessary information.
  // I have recently changed roles within the company and need additional time to familiarize myself with the specific details requested; I kindly ask for a brief postponement to ensure I can provide accurate and complete information.
  // `

  const userID = session ? session.user?.id : "";
  console.log('UserID:', userID);

  useEffect(() => {
    const initializeData = async () => {
      if (session) {
        const userID = session.user?.id; // Adjust based on how user ID is stored in session
        if (userID) {
              const response = await fetch('/api/getReasons', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID: String(userID) }),
              });
          
              const result = await response.json();
              console.log('Result:', result);
          
              const { getReason } = result;
              setReasonsStr(result);
        }
      }
    };

    initializeData();
  }, [session]);

  console.log('Reasons:', reasonsStr);



  const reasons = reasonsStr ? reasonsStr.split('.,') : [];
  console.log('Reasons:', reasons);

  const handleOptionSelect = (reason: string) => setSelectedReason(reason);

  const handleNumOfPagesChange = (value: string) => {
    const numericValue = parseInt(value, 10);
    setNumOfPages(!isNaN(numericValue) ? Math.max(2, numericValue) : 2);
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert("Please select a reason");
      return;
    }

    setLoading(true);

    const combinedData = { selectedReason, extraText };

    try {
      const pageNumsResponse = await axios.post(
        "http://sastelaptop.com:3010/api/fetchNumPages",
        { numOfPages }
      );

      console.log(pageNumsResponse);

      const response = await axios.post(
        "http://sastelaptop.com:3010/api/getSummonNoticeReply",
        combinedData,
        { headers: { "Content-Type": "application/json" } }
      );

      const noticeData = response.data;
      console.log('Notice Data:', noticeData);
      console.log('User ID:', userID);

      const addResponse = await fetch("/api/saveNotice", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: String(userID), notice: String(noticeData) }),
      });

      if (addResponse.ok) {
          const responseData = await addResponse.json();
          console.log('Saved successfully:', responseData);
          router.push('/notice-response');
      } else {
          alert('Failed to save notice reply. Please try again.');
      }
      setShowNoticeReplyPage(true);
    } catch (err) {
      console.error("Error fetching notice reply:", err);
      setError("Failed to load notice reply data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!showNoticeReplyPage ? (
        loading ? (
          <LoadingSpinner />
        ) : (
          <div className="max-w-4xl mx-auto p-5 font-sans">
            {reasons.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-5 flex-wrap">
                  <div className="w-32">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={120}
                      height={120}
                      className="w-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-center">
                    Please Select the Most Suitable Reason for Reply Generation
                  </h3>
                </div>
                <div className="flex flex-wrap gap-5 mb-5">
                  {reasons.map((reason, index) => (
                    <div
                      key={index}
                      className={`flex-1 min-w-[30%] p-5 rounded-lg border ${
                        selectedReason === reason
                          ? "bg-gray-300"
                          : "bg-gray-100"
                      } cursor-pointer hover:shadow-lg`}
                      onClick={() => handleOptionSelect(reason)}
                    >
                      <p>{reason}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mb-5">
                  <label className="font-bold">Enter No. of Pages:</label>
                  <input
                    type="number"
                    value={numOfPages}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleNumOfPagesChange(e.target.value)}
                    className="border rounded-md p-2 w-20"
                    min="2"
                  />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  Any Additional Suggestions?
                </h3>
                <textarea
                  value={extraText}
                  onChange={(e) => setExtraText(e.target.value)}
                  placeholder="Write your suggestions here..."
                  rows={5}
                  className="w-full p-3 border rounded-lg mb-5 resize-none"
                />
                <button
                  className={`px-5 py-3 text-white font-bold rounded-md ${
                    selectedReason
                      ? "bg-black hover:bg-gray-800"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleSubmit}
                  disabled={!selectedReason}
                >
                  Continue
                </button>
              </>
            ) : (
              <p>Loading reasons...</p>
            )}
          </div>
        )
      ) : (
        // <NoticeReply noticeReply={noticeReply} />
        <div>
            <h1>Hello Word</h1>
        </div>
      )}
    </>
  );
};

const LoadingSpinner: React.FC = () => {
    const words = ['Generating your reply...', 'Please wait...', 'Almost there...'];
    const [text, setText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
  
    useEffect(() => {
      const currentWord = words[wordIndex];
      const interval = setInterval(() => {
        setText((prevText) => prevText + currentWord[charIndex]);
        setCharIndex((prevIndex) => prevIndex + 1);
      }, 100);
  
      if (charIndex === currentWord.length) {
        clearInterval(interval);
        setTimeout(() => {
          setText('');
          setCharIndex(0);
          setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 1000);
      }
  
      return () => clearInterval(interval);
    }, [charIndex, wordIndex]);
  
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {text}
        </h2>
        <Image src='/loading.gif' alt="Loading..." width={100} height={100} />
      </div>
    );
};