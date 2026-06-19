'use client';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

const DashboardRouter = () => {
  const router = useRouter();
  
  // BetterAuth থেকে সেশন ও লোডিং স্টেট নেওয়া
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user || null;

  useEffect(() => {
    // ১. BetterAuth যতক্ষণ সেশন লোড করছে, ততক্ষণ অপেক্ষা করবে
    if (isPending) return;

    // ২. লগইন করা না থাকলে সরাসরি সাইন-ইন পেজে পুশ করবে (বেসিক সিকিউরিটি)
    if (!user) {
      toast.error("Please sign in first!");
      router.replace('/login');
      return;
    }

    // ৩. রোল বের করে সরাসরি সঠিক ড্যাশবোর্ডে রিডাইরেক্ট করা
    const role = user.role;

    if (role === 'admin') {
      router.replace('/dashboard/admin-dashboard');
    } else if (role === 'creator') {
      router.replace('/dashboard/creator-dashboard');
    } else {
      router.replace('/dashboard/user-dashboard'); // সাধারণ ইউজার
    }

  }, [user, isPending, router]);

  // রিডাইরেক্ট হওয়ার মাঝখানের সামান্য সময়ে এই সুন্দর প্রিমিয়াম গ্লাস ইফেক্টটি দেখাবে
  return (
    <div className="w-full min-h-screen bg-[#030014] flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* ব্যাকগ্রাউন্ড পার্পল গ্লো */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>
      
      {/* মেইন গ্লাস বক্স */}
      <div className="relative z-10 flex flex-col items-center gap-5 bg-gray-900/40 border border-white/[0.06] p-8 rounded-2xl backdrop-blur-xl shadow-2xl shadow-purple-950/10">
        
        {/* মডার্ন লোডিং স্পিনার */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/10"></div>
          <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 animate-spin"></div>
        </div>
        
        <div className="text-center">
          <p className="text-white/90 text-sm font-medium tracking-wide animate-pulse">
            Loading Dashboard...
          </p>
          <p className="text-[11px] text-gray-500 font-mono mt-1">
            Redirecting based on your role
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardRouter;