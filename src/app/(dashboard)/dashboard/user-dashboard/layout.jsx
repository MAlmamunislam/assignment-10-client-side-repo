import React from "react";
import Sidebar from "./Sidebar";
 // আমাদের নতুন সাইডবারটি শুধু থাকবে

export default function UserDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col lg:flex-row overflow-hidden">
      {/* 🛡️ শুধুমাত্র একটি এবং পারফেক্ট সাইডবার এখানে থাকবে */}
      <Sidebar />

      {/* মেইন কন্টেন্ট এরিয়া (ডানপাশে বাকি পেজগুলো দেখানোর জন্য) */}
      <main className="flex-1 h-screen overflow-y-auto bg-gradient-to-b from-[#030014] to-[#08021a] p-4 md:p-8 lg:p-10">
        {/* ব্যাকগ্রাউন্ড পার্পল গ্লো ইফেক্ট */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}