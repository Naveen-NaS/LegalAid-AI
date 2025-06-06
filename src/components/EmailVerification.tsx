"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  handleCredentialsSignIn,
  handelResendVerficationCode,
} from "@/app/actions/authActions";

const REGEXP_ONLY_DIGITS = /^\d+$/;

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import GlobalMessage from "@/components/GlobalMessage";

import { redirect } from 'next/navigation'

const OTPSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email"),
  pin: z
    .string()
    .length(6, {
      message: "Your one-time password must be 6 characters.",
    })
    .regex(REGEXP_ONLY_DIGITS, "OTP must contain only digits"),
});

const ResendOTPSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email"),
  verifyCode: z.string(),
  verifyCodeExpiry: z.date(),
});

interface VerifyEmailProps {
  email: string;
  password: string;
}

const VerifyEmail = ({ email, password }: VerifyEmailProps) => {
  const [countdown, setCountdown] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const [verifyCode, setVerifyCode] = useState("");
  const [verifyCodeExpiry, setVerifyCodeExpiry] = useState(
    new Date(Date.now() + 3600000)
  );

  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");

  const form = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      email: email,
      pin: "", // This will store the OTP
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [countdown]);

  // Handle Resend Click
  const handleResendClick = async () => {
    setCountdown(60);
    setIsResendEnabled(false);
    setVerifyCode(Math.floor(100000 + Math.random() * 900000).toString());
    setVerifyCodeExpiry(new Date(Date.now() + 3600000));

    const result = await handelResendVerficationCode({
      email,
      verifyCode,
      verifyCodeExpiry,
    });

    if (result?.success) {
      setGlobalMessage(result.message);
      setGlobalSuccess("true");
    } else {
      setGlobalMessage(result.message);
      setGlobalSuccess("false");
    }
  };

  // Form Submission Handler
  const onSubmit = async (data: z.infer<typeof OTPSchema>) => {
    console.log("Submitting data:", data); // Check if 'pin' (OTP) is present
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Ensure 'pin' and 'email' are sent here
      });

      const responseData = await response.json();
      if (response.ok) {
        await handleCredentialsSignIn({ email, password });
        redirect(`/`);
        setGlobalMessage(responseData.message);
        setGlobalSuccess("true");
      } else {
        setGlobalMessage(responseData.message);
        setGlobalSuccess("false");
      }
    } catch (error) {
      console.log(error);
      setGlobalMessage("Something went wrong. Please try again.");
      setGlobalSuccess("false");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-center font-inter bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
        <div className="flex justify-center">
          <div className="max-w-md mx-auto bg-[#1e293b] text-center px-4 sm:px-8 py-10 rounded-xl shadow">
            {globalMessage && (
              <GlobalMessage success={globalSuccess} message={globalMessage} />
            )}
            <Link href="/" className="ml-2 flex justify-center items-center mb-3">
              <Image
                src="/logo.png"
                alt="Logo"
                width={150}
                height={150}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            </Link>
            <header className="mb-6">
              <h1 className="text-2xl text-white font-bold mb-1">
                Email Verification
              </h1>
              <p className="text-[15px] text-slate-100">
                Enter the 6-digit verification code sent to your Email.
              </p>
            </header>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                {/* OTP Input */}
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputOTP
                          value={field.value} // Ensure this captures the OTP value
                          onChange={(otp) => field.onChange(otp)} // Update field value on change
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS.source}
                        >
                          <InputOTPGroup>
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                              <InputOTPSlot
                                key={index}
                                index={index}
                                className="text-white border-white text-center w-12 h-12 mx-1 rounded-lg border transition-all duration-200"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-[#20c997] hover:bg-[#17a589] mt-6 relative group/btn w-full text-white rounded-md h-10 font-medium shadow-lg transition-colors duration-300"
                >
                  {isSubmitting ? "Loading..." : "Verify Code & Sign In →"}
                </button>

                {/* Resend Button */}
                <div className="text-l text-slate-200 mt-4">
                  Didn't receive code?{" "}
                  <button
                    type="button"
                    onClick={handleResendClick}
                    disabled={!isResendEnabled}
                    className={`font-bold text-base bg-clip-text ${
                      isResendEnabled
                        ? "bg-gradient-to-r from-blue-500 to-violet-500"
                        : "text-gray-400"
                    }`}
                  >
                    Resend {countdown > 0 ? `in ${countdown}s` : ""}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VerifyEmail;