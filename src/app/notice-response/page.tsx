"use client"

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";


import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { set } from "zod";


export default function NoticeReply() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [response, setResponse] = useState<string>("");
  
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableText, setEditableText] = useState<string>(response);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [isEdited, setIsEdited] = useState<boolean>(false);

  const userID = session ? session.user?.id : "";


  useEffect(() => {
    const initializeData = async () => {
      if (session) {
        const userID = session.user?.id;
        console.log(userID) // Adjust based on how user ID is stored in session
        if (userID) {
              const response = await fetch('/api/getNotice', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID: String(userID) }),
              });
          
              const result = await response.json();
              console.log('Result:', result);
          
              const { getReason } = result;
              setResponse(result);
              setDisplayedText(result);
              setEditableText(result);
        }
      }
    };

    initializeData();
  }, [session]);

  console.log(response);




  // useEffect(() => {
  //   if (response) {
  //     const words = response.split(" ");
  //     let currentWordIndex = 0;

  //     const intervalId = setInterval(() => {
  //       if (currentWordIndex < words.length) {
  //         setDisplayedText((prevText) => `${prevText} ${words[currentWordIndex]}`);
  //         currentWordIndex++;
  //       } else {
  //         clearInterval(intervalId);
  //       }
  //     }, 30);

  //     return () => clearInterval(intervalId);
  //   }
  // }, [response]);

  // useEffect(() => {
  //   if (textContainerRef.current) {
  //     textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight;
  //   }
  // }, [displayedText]);


  const handleEditResponse = () => {
    if (isEditing) {
      setDisplayedText("");
    }
    setIsEditing(!isEditing);
    setIsEdited(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableText(e.target.value);
  };

  // const handleReUpload = () => {
  //   window.location.reload();
  // };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleDownload = async (format: "docx" | "pdf") => {
    if (format === "docx") {
      const doc = new Document({
        sections: [
          {
            children: editableText.split("\n").map((line) => {
              const boldRegex = /\*\*(.*?)\*\*/g;
              let matches;
              const children: TextRun[] = [];
              let lastIndex = 0;

              while ((matches = boldRegex.exec(line)) !== null) {
                if (matches.index > lastIndex) {
                  children.push(
                    new TextRun({
                      text: line.substring(lastIndex, matches.index),
                      font: "Times New Roman",
                      size: 24,
                    })
                  );
                }

                children.push(
                  new TextRun({
                    text: matches[1],
                    bold: true,
                    font: "Times New Roman",
                    size: 24,
                  })
                );
                lastIndex = boldRegex.lastIndex;
              }

              if (lastIndex < line.length) {
                children.push(
                  new TextRun({
                    text: line.substring(lastIndex),
                    font: "Times New Roman",
                    size: 24,
                  })
                );
              }

              return new Paragraph({
                children,
                alignment: AlignmentType.LEFT,
              });
            }),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "response.docx");
    } else if (format === "pdf") {
      const doc = new jsPDF();
      doc.setFont("Times", "normal");
      doc.setFontSize(11);

      const lines = doc.splitTextToSize(editableText, 180); // Adjusted width
      let y = 10;

      lines.forEach((line: string) => {
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
        doc.text(line, 10, y);
        y += 6;
      });

      const pdfBlob = doc.output("blob");
      saveAs(pdfBlob, "response.pdf");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center p-6 bg-transparent">
        <>
          <div className="absolute top-4 left-4">
            <img src="/logo.png" alt="Logo" className="w-24" />
          </div>

          <div className="absolute top-4 right-4 flex gap-4">
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded"
              onClick={() => handleDownload("docx")}
            >
              Download as Word (.docx)
            </button>
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded"
              onClick={() => handleDownload("pdf")}
            >
              Download as PDF (.pdf)
            </button>
          </div>

          <div
            ref={textContainerRef}
            className="mt-20 w-full h-[80%] max-w-4xl p-4 bg-gray-100 border border-gray-300 rounded overflow-y-auto "
          >
            {isEditing ? (
              <textarea
                className="w-full h-full bg-transparent text-black resize-none outline-none"
                value={editableText}
                onChange={handleTextChange}
              />
            ) : (
              <textarea
                className="w-full h-full bg-transparent text-black resize-none outline-none"
                value={editableText}
                readOnly
              />
            )}
          </div>

          <div className="mt-4 flex gap-4">
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded"
              onClick={handleEditResponse}
            >
              {isEditing ? "Save Response" : "Edit Response"}
            </button>
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded"
            >
              Re-Upload
            </button>
          </div>
        </>
    </div>
  );
};