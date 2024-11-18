"use client"

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";



export default function NoticeReply() {
  const response = `[LETTERHEAD]
  M/s ABC & CO LIMITED
  301, Jammu & Kashmir

  **November 18, 2024**

  To,
  Mr. Abhinav Kr
  Superintendent/Appraiser/Senior Intelligence Officer
  DDI, Kashmir Zonal Unit
  3rd floor, Plot No. 12, Sector-13
  Jammu-120001

  Subject: Response to Summons under Section 70 of the Central Goods and Services Tax Act, 2017
  Reference: GSTIN- 01AA6677894657 CBIC-BIN-20240857NNO50012345

  Dear Mr. Abhinav Kr,

  I am writing in response to the summons dated August 28, 2024, issued under Section 70 of the Central Goods and Services Tax Act, 2017 (hereinafter referred to as "CGST Act"), in connection with the investigation of M/S Ram & Company & others.

  At the outset, I would like to express our full cooperation with the ongoing investigation and our commitment to comply with all legal requirements under the CGST Act. We acknowledge the importance of this matter and assure you of our complete support throughout the process.

  Regarding the summons to appear before you on October 1, 2024, at 11:30 AM at your office, I respectfully request a rescheduling of the appearance date. Due to a pre-existing religious observance on October 1, 2024, I kindly ask if it would be possible to reschedule the appearance to the following business day, October 2, 2024. This slight adjustment would allow me to fulfill my religious obligations while ensuring that I am fully prepared to provide all required information and documents as requested in the summons.

  In accordance with the summons, I understand that my attendance is necessary to:

  1. Give evidence
  2. Produce documents or things in my possession or under my control

  Specifically, you have requested:

  1. To tender a statement
  2. To submit copies of ledgers, purchase invoices, bank statements, etc.

  I assure you that I am diligently preparing all the requested documents and information. To ensure a comprehensive and efficient process, I propose the following course of action:

  1. Statement Preparation: I am in the process of preparing a detailed statement that addresses all relevant aspects of the investigation. This statement will be comprehensive and accurately reflect all pertinent information within my knowledge.

  2. Document Compilation: We are meticulously gathering and organizing all requested documents, including:
    a) Ledgers
    b) Purchase invoices
    c) Bank statements
    d) Any other relevant documentation that may assist in the investigation

  3. Additional Information: In the spirit of full cooperation, we are also compiling any supplementary information that may be pertinent to the investigation, even if not explicitly requested in the summons.

  4. Legal Representation: As per Section 70(2) of the CGST Act, I intend to be accompanied by a legal representative during the appearance. This is to ensure that all legal aspects are properly addressed and to facilitate a smooth process.

  5. Confidentiality: We understand the sensitive nature of this investigation and assure you that we will maintain strict confidentiality regarding all matters related to this summons and the subsequent proceedings.

  6. **Continuity of Cooperation:** Should any additional information or documentation be required beyond what is currently requested, we commit to providing it promptly upon your request.

  I would like to emphasize that M/s ABC & CO LIMITED is committed to maintaining the highest standards of compliance with all applicable laws and regulations, including the CGST Act. We view this investigation as an opportunity to demonstrate our adherence to legal and ethical business practices.

  Furthermore, I would like to draw your attention to Section 70(1) of the CGST Act, which states that the proper officer shall have the power to summon any person whose attendance he considers necessary either to give evidence or to produce a document or any other thing. We fully respect this authority and are prepared to comply with all lawful requirements under this section.

  In light of the religious observance on the originally scheduled date, I humbly request your consideration in rescheduling the appearance to October 2, 2024, or any other subsequent date that is convenient for your office. I assure you that this slight adjustment will not in any way impede the investigation process, and we will be fully prepared to provide all required information and documents on the rescheduled date.

  Should you have any questions or require any clarification regarding this response or the requested rescheduling, please do not hesitate to contact me. We remain at your disposal to facilitate this process in any way possible.

  Thank you for your understanding and consideration in this matter. We look forward to your favorable response regarding the rescheduling and to cooperating fully with your office in this investigation.

  Yours sincerely,

  [Your Signature]

  [Your Name]
  Indirect Tax Head
  M/s ABC & CO LIMITED`


  // const fetchData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch('/api/user-data', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ userID }),
  //     });

  //     const data = await response.json();

  //     if (response.ok && data.data) {
  //       setResponseData(data.data);
  //       setClientReason(data.data.current_reason || '');
  //     } else {
  //       console.error('Failed to fetch data:', data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // // Fetch data when the component mounts
  // useEffect(() => {
  //   fetchData();
  // }, []);


  const [displayedText, setDisplayedText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableText, setEditableText] = useState<string>(response);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [isEdited, setIsEdited] = useState<boolean>(false);

  useEffect(() => {
    if (response) {
      const words = response.split(" ");
      let currentWordIndex = 0;

      const intervalId = setInterval(() => {
        if (currentWordIndex < words.length) {
          setDisplayedText((prevText) => `${prevText} ${words[currentWordIndex]}`);
          currentWordIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 30);

      return () => clearInterval(intervalId);
    }
  }, [response]);

  useEffect(() => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight;
    }
  }, [displayedText]);

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

  const handleReUpload = () => {
    window.location.reload();
  };

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
      {editableText ? (
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
              <ReactMarkdown className="text-black">{isEdited ? editableText : displayedText}</ReactMarkdown>
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
              onClick={handleReUpload}
            >
              Re-Upload
            </button>
          </div>
        </>
      ) : (
        <div className="w-full max-w-4xl p-4 bg-gray-100 border border-gray-300 rounded h-60 flex items-center justify-center">
          <p className="text-red-500">No data to display. Please try again.</p>
        </div>
      )}
    </div>
  );
};