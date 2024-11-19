"use client";

import { useState, DragEvent, ChangeEvent } from "react";
import axios from "axios";
import Image from "next/image";
import { Session } from "inspector/promises";

import GlobalMessage from "@/components/GlobalMessage";

import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'

export default function FileUploader() {
  const { data: session } = useSession();
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSummon, setIsSummon] = useState(false);

  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");

  const [reasonsData, setReasonsData] = useState("");
  const [showReasonsPage, setShowReasonsPage] = useState(false);

  const [showQuestionsPage, setShowQuestionsPage] = useState(false);
  const [questionsData, setQuestionsData] = useState({ questions: [], answer: "" });

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setFileURL(URL.createObjectURL(droppedFile));
    } else {
      alert("Please upload only PDF files.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile));
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const response = await axios.post("http://sastelaptop.com:3010/api/uploadPdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.isSummon !== undefined) {
        setIsSummon(response.data.isSummon);
      }

      setUploadStatus("File uploaded successfully!");
      setIsUploadSuccessful(true);
    } catch (error) {
      setUploadStatus("Failed to upload file.");
      setIsUploadSuccessful(false);
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReupload = () => {
    setFile(null);
    setFileURL(null);
    setUploadStatus(null);
    setIsUploadSuccessful(false);
    setIsSummon(false);
  };

  const handleContinue = async () => {
    try {
      if(isSummon == true){
        const response = await axios.get("http://sastelaptop.com:3010/api/getReasons");
        const reasons = response.data;
        setReasonsData(reasons);

        const userId = session ? session.user?.id : "";

        const addResponse = await fetch("/api/saveReasons", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, reasons }),
        });

        const responseData = await addResponse.json();
        if (addResponse.ok) {
          router.push('/qnas');
        } else {
          setGlobalMessage(responseData.message);
          setGlobalSuccess("false");
        }

        setShowReasonsPage(true);
      }
      else {
        const response = await axios.get("http://sastelaptop.com:3010/api/getQuestions");
        const questions = response.data.questions;
        const answer = response.data.answer;

        const userId = session ? session.user?.id : "";

        const addResponse = await fetch("/api/saveQnAs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, questions, answer }),
        });

        const responseData = await addResponse.json();
        if (addResponse.ok) {
          router.push('/qnas');
        } else {
          setGlobalMessage(responseData.message);
          setGlobalSuccess("false");
        }

        setShowQuestionsPage(true);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 h-screen">
      {globalMessage && (
              <GlobalMessage success={globalSuccess} message={globalMessage} />
      )}
      <div className="mb-6">
        <Image src="/logo.png" alt="Logo" width={125} height={125} />
      </div>
      <div
        className={`w-full max-w-lg border-[4px] border-dashed p-6 text-center transition-all ${
          isDragging ? "border-black" : "border-gray-700"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div>
            <object data={fileURL!} type="application/pdf" className="w-full h-64">
              <p>Preview not available</p>
            </object>
            <p className="mt-4 text-sm">{file.name}</p>
            {!isUploading && !isUploadSuccessful && (
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={handleReupload}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md"
                >
                  Remove File
                </button>
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md"
                >
                  Upload
                </button>
              </div>
            )}
            {isUploading && (
              <div className="flex justify-center items-center mt-4 space-x-2">
                <div className="w-4 h-4 bg-gray-800 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-gray-800 rounded-full animate-bounce delay-150"></div>
                <div className="w-4 h-4 bg-gray-800 rounded-full animate-bounce delay-300"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Image src="/drag&drop.png" alt="Drag and Drop" width={125} height={125} />
            <h3 className="text-lg mt-4">Drag and Drop to Upload</h3>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              id="fileInput"
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer px-4 py-2 mt-4 bg-gray-800 text-white rounded-md inline-block"
            >
              Choose a file
            </label>
          </div>
        )}
        {uploadStatus && <p className="mt-4 text-black">{uploadStatus}</p>}
      </div>
      {isUploadSuccessful && (
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleReupload}
            className="px-4 py-2 bg-gray-800 text-white rounded-md"
          >
            Re-upload
          </button>
          <button
            onClick={handleContinue}
            className="px-4 py-2 bg-gray-800 text-white rounded-md"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
