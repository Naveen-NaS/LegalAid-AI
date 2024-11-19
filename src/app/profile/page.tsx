"use client";

import React from "react";

// Dummy data for user profile
const userProfile = {
  username: "JohnDoe123",
  email: "johndoe@example.com",
  totalPDFUploaded: 15,
  totalResponsesGenerated: 42,
  emailVerified: true,
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 overflow-hidden">
      {/* Header Section */}
      <div className="w-full bg-[#1e293b] py-8">
        <div className="ml-8">
          <h2 className="text-white text-sm mb-1">Your Profile</h2>
          <h1 className="font-bold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
            Profile Details
          </h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="min-h-[85vh] w-full flex items-start justify-center px-4 sm:px-6 md:px-8 lg:px-10 mt-4 mb-0">
        {/* Card Section */}
        <div
          className="relative w-full max-w-[1100px] mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-input bg-[#1e293b]"
          style={{
            width: "90%", // Makes the card take up 90% of the page width
            maxWidth: "1100px", // Ensures it doesn’t get too wide on large screens
          }}
        >
          <h1 className="font-bold text-lg md:text-xl text-white text-left">Profile Information</h1>

          {/* User Details */}
          <div className="text-white mt-4 space-y-2">
            <p><strong>Username:</strong> {userProfile.username}</p>
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Total PDF Uploaded:</strong> {userProfile.totalPDFUploaded}</p>
            <p><strong>Total Responses Generated:</strong> {userProfile.totalResponsesGenerated}</p>
            <p><strong>Email Verified:</strong> {userProfile.emailVerified ? "True" : "False"}</p>
          </div>

          {/* Sign Out Button */}
          <div className="flex justify-center mt-8">
            <button
              className="relative inline-flex items-center justify-center p-[0.5rem] mb-[2rem] me-auto ms-auto overflow-hidden text-sm font-medium rounded-lg group 
                bg-black text-white 
                focus:ring-[4px] focus:outline-none focus:ring-purple-[800]
                transition-all duration-[300ms]
                active:bg-black active:text-white
                hover:-translate-y-[1px] hover:shadow-lg transform ease-in-out"
            >
              <span className="relative px-[20px] py-[10px] bg-gray-[900] rounded-md">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}