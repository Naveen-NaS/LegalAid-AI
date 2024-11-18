"use client";

import React, { useEffect, useState, ChangeEvent } from 'react';
import Image from 'next/image';
// import { useTypewriter, Cursor } from 'react-simple-typewriter';
// import NoticeReply from './NoticeReply';
import axios from 'axios';


export default function QuestionsPage() {
    // const [questions, setQuestions] = useState("");
    // const [preAnswers, setPreAnswers] = useState("");


    const questions = `What is the client's desired outcome (e.g., full monetary recovery, return of the vehicle, or both)?
    Does the client possess the original agreement and any documentation related to payments made and received, including returned checks, and are they willing to share these documents?
    Can you provide documentation or evidence supporting the possession status and condition of the BAJAJ PICK UP VAN, R.C. No. DL1LL-5540, as currently held under the possession of M/S. PRJ ENTERPRISERS LTD?
    Please enter any relevant details you want to be considered while generating the notice reply.
    `

    const preAnswers = `The client's desired outcome is both the full monetary recovery including principal investment, accrued arrears, legal costs, and interest, as well as the return of the BAJAJ PICK UP VAN, R.C. No. DL1LL-5540.
    The client appears to possess the original agreement and likely has documentation related to payments made and received, including returned checks, as mentioned in the notice, and seems willing to share these documents for legal proceedings.
    Documentation or evidence supporting the possession status and condition of the vehicle is not specified, but it's mentioned that the vehicle was registered in the clients name and has always remained under the possession of M/S. PRJ ENTERPRISERS LTD.
    No
    `

    // const fetchData = async () => {
    //     setIsLoading(true);
    //     try {
    //       const response = await fetch('/api/user-data', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ userID }),
    //       });
    
    //       const data = await response.json();
    
    //       if (response.ok && data.data) {
    //         setResponseData(data.data);
    //         setClientReason(data.data.current_reason || '');
    //       } else {
    //         console.error('Failed to fetch data:', data.message);
    //       }
    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };
    
    //   // Fetch data when the component mounts
    //   useEffect(() => {
    //     fetchData();
    //   }, []);

    const questionsArr = questions ? questions.split('\n') : [];
    const preAnswersArr = preAnswers ? preAnswers.split('\n') : [];

    const [answers, setAnswers] = useState<string[]>(() =>
        questionsArr.map((_, index) => preAnswers[index] || '')
    );

    const [selectedQuestions, setSelectedQuestions] = useState<boolean[]>(() =>
        questionsArr.map(() => true)
    );
    const [loading, setLoading] = useState(false);
    const [showNoticeReplyPage, setShowNoticeReplyPage] = useState(false);
    const [noticeReply, setNoticeReply] = useState<{ result: string } | null>(null);
    const [selectAll, setSelectAll] = useState(false);
    const [numOfPages, setNumOfPages] = useState(2);

    const handleNumOfPagesChange = (value: string) => {
        const numericValue = parseInt(value, 10);
        setNumOfPages(!isNaN(numericValue) ? Math.max(2, numericValue) : 2);
    };

    const handleSelectionChange = (index: number) => {
        const updatedSelection = [...selectedQuestions];
        updatedSelection[index] = !updatedSelection[index];
        setSelectedQuestions(updatedSelection);
    };

    const handleSelectAll = () => {
        const newSelection = questionsArr.map(() => selectAll);
        setSelectedQuestions(newSelection);
        setSelectAll(!selectAll);
    };

    const handleInputChange = (index: number, value: string) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    const handleSubmit = async () => {
        try {
        setLoading(true);
        const response = await axios.post('/api/fetchQnAs', {
            questions: questionsArr.filter((_, index) => selectedQuestions[index]),
            answers: answers.filter((_, index) => selectedQuestions[index]),
        });

        const pageNums = await axios.post('/api/fetchNumPages', {
            numOfPages,
        });

        if (response.status === 200) {
            const noticeResponse = await axios.get('/api/getNoticeReply');
            if (noticeResponse.status === 200) {
            setNoticeReply({ result: noticeResponse.data });
            setLoading(false);
            setShowNoticeReplyPage(true);
            }
        } else {
            alert('Failed to submit answers. Please try again.');
            setLoading(false);
        }
        } catch (error) {
        console.error('Error submitting answers:', error);
        alert('An error occurred. Please try again later.');
        setLoading(false);
        }
    };

    return (
        <>
        {!showNoticeReplyPage ? (
            <div className="max-w-3xl mx-auto">
            {!loading && (
                <div className="flex flex-col items-center mb-8">
                <Image src='/logo.png' alt="Logo" width={120} height={120} className="mb-4" />
                <h3 className="text-xl font-bold text-center text-gray-800">
                    Please Answer the Following Questions for Reply Generation
                </h3>
                </div>
            )}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    type="button"
                    onClick={handleSelectAll}
                    className="col-span-2 bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
                >
                    {selectAll ? 'Deselect All' : 'Select All'}
                </button>
                
                {questionsArr.map((question, index) => (
                    <div
                    key={index}
                    className={`p-4 border rounded ${
                        selectedQuestions[index] ? 'border-gray-800 bg-white' : 'border-gray-300 bg-gray-100'
                    }`}
                    >
                    <input
                        type="checkbox"
                        checked={selectedQuestions[index]}
                        onChange={() => handleSelectionChange(index)}
                        className="mr-2"
                    />
                    <label className="font-semibold block mb-2">
                        {index + 1}. {question}
                    </label>
                    <textarea
                        value={preAnswersArr[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                    />
                    </div>
                ))}

                <div className="col-span-2">
                    <label className="font-semibold">Enter No. of Pages</label>
                    <input
                    type="number"
                    value={numOfPages}
                    onChange={(e) => handleNumOfPagesChange(e.target.value)}
                    className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none"
                    min={2}
                    />
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="col-span-2 bg-gray-800 text-white py-3 rounded hover:bg-gray-700 mt-4"
                >
                    Submit
                </button>
                </form>
            )}
            </div>
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
      <div className="cursor">|</div>
      <Image src='/loading.gif' alt="Loading..." width={100} height={100} />
    </div>
  );
};
