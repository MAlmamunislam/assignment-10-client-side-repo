"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  // ডিফল্ট সিলেক্টেড রোল 'user' রাখার জন্য স্টেট
  const [selectedRole, setSelectedRole] = useState("user");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    console.log("Form Data:", userData);
    const plan =  selectedRole ==='user' ? 'free' : 'premium';
    const { data, error } = await authClient.signUp.email({
      name: userData.fullName,
      email: userData.email,
      password: userData.password,
      image: userData.photoUrl,
      role: userData.role,
      plan: plan,
       // রেডিও গ্রুপ থেকে সিলেক্টেড রোলটি যাবে
    });

    if (error) {
      toast.error(
        error.message || "Failed to create account. Please try again.",
      );
      return;
    }

    if (data) {
      toast.success("Account created successfully! 🎉");
      router.push(redirect ? decodeURIComponent(redirect) : "/");
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
            Create Account
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Join thousands of creators today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ১. Full Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-purple-400/80 uppercase tracking-wider font-mono px-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. John Doe"
              required
              className="w-full bg-[#0d0926]/40 border border-white/[0.08] rounded-xl px-4 py-3.5 text-white/90 placeholder-gray-600 outline-none focus:border-purple-500/50 transition-all duration-300 font-medium tracking-wide"
            />
          </div>

          {/* ২. Email Address Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-purple-400/80 uppercase tracking-wider font-mono px-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. hello@domain.com"
              required
              className="w-full bg-[#0d0926]/40 border border-white/[0.08] rounded-xl px-4 py-3.5 text-white/90 placeholder-gray-600 outline-none focus:border-purple-500/50 transition-all duration-300 font-medium tracking-wide"
            />
          </div>

          {/* ৩. Photo URL Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-purple-400/80 uppercase tracking-wider font-mono px-1">
              Photo URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="photoUrl"
              placeholder="https://example.com/avatar.jpg"
              required
              className="w-full bg-[#0d0926]/40 border border-white/[0.08] rounded-xl px-4 py-3.5 text-white/90 placeholder-gray-600 outline-none focus:border-purple-500/50 transition-all duration-300 font-medium tracking-wide"
            />
          </div>

          {/* ৪.🌟 মডার্ন রেডিও গ্রুপ (ড্রপডাউনের বিকল্প) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-purple-400/80 uppercase tracking-wider font-mono px-1">
              Choose Account Type <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* User Radio Card */}
              <label
                className={`flex flex-col justify-center items-start p-3.5 rounded-xl border cursor-pointer transition-all duration-300 bg-[#0d0926]/20 ${
                  selectedRole === "user"
                    ? "border-purple-500 bg-purple-500/5 shadow-md shadow-purple-500/10"
                    : "border-white/[0.08] hover:border-white/[0.15]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={selectedRole === "user"}
                    onChange={() => setSelectedRole("user")}
                    className="accent-purple-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-white/90">
                    User
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 pl-6 leading-tight">
                  Browse & bookmark prompts
                </span>
              </label>

              {/* Creator Radio Card */}
              <label
                className={`flex flex-col justify-center items-start p-3.5 rounded-xl border cursor-pointer transition-all duration-300 bg-[#0d0926]/20 ${
                  selectedRole === "creator"
                    ? "border-purple-500 bg-purple-500/5 shadow-md shadow-purple-500/10"
                    : "border-white/[0.08] hover:border-white/[0.15]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="creator"
                    checked={selectedRole === "creator"}
                    onChange={() => setSelectedRole("creator")}
                    className="accent-purple-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-white/90">
                    Creator
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 pl-6 leading-tight">
                  Sell & share your own prompts
                </span>
              </label>
            </div>
          </div>

          {/* ৫. Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-purple-400/80 uppercase tracking-wider font-mono px-1">
              Password <span className="text-red-500">*</span>
            </label>
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
            Create Account
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500 mt-6 font-medium">
          Already have an account?{" "}
          <Link
            href={redirect ? `/login?redirect=${redirect}` : "/login"} // এখানে লিংকটি ডাইনামিক করে দাও
            className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
