"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  // handle submit login

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signIn.email({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      toast.error(
        error.message || "Invalid email or password. Please try again.",
      );
      return;
    }

    if (data) {
      toast.success("Signed in successfully! Welcome back.");

      const redirect = searchParams.get("redirect");

      router.push(redirect || "/");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#030014] flex items-center justify-center py-12 px-4 select-none relative overflow-hidden">
      {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্টস */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/15 blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[150px] mix-blend-screen pointer-events-none animate-pulse duration-[8000ms]"></div>

      {/* মেইন ফর্ম কার্ড */}
      <div className="w-full max-w-md flex flex-col relative z-10 bg-gray-900 border border-white/[0.06] p-8 md:p-10 rounded-2xl backdrop-blur-xl shadow-2xl shadow-purple-950/10 transform hover:scale-[1.005] transition-all duration-500 ease-out">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-white/95 tracking-tight mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Sign in to continue your progress
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ১. Email Address Input with Label */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-purple-400/80 uppercase tracking-wider font-mono px-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. hello@domain.com"
              required
              className="w-full bg-[#0d0926]/40 border border-white/[0.08] rounded-xl px-4 py-3.5 text-white/90 placeholder-gray-600 outline-none focus:border-purple-500/50 transition-all duration-300 font-medium tracking-wide"
            />
          </div>

          {/* ২. Password Input with Label */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-semibold text-purple-400/80 uppercase tracking-wider font-mono">
                Password
              </label>
             
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                required
                className="w-full bg-[#0d0926]/40 border border-white/[0.08] rounded-xl px-4 py-3.5 text-white/90 placeholder-gray-600 outline-none focus:border-purple-500/50 transition-all duration-300 font-medium tracking-wide pr-14"
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold font-mono tracking-wider text-gray-500 hover:text-purple-400 transition-colors uppercase cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm py-4 rounded-xl shadow-lg shadow-purple-600/20 transform hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            Sign In
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500 mt-6 font-medium">
          Don't have an account?{" "}
          <a
            href={`/signup?redirect=${redirect || "/"}`}
            className="text-purple-400 font-semibold hover:text-purple-300"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
