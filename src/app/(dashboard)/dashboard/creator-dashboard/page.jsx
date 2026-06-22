'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { 
  FileText, 
  Copy, 
  Bookmark, 
  Star,
  MessageSquare,
  TrendingUp
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const CreatorDashboard = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user || null;

  // ড্যাশবোর্ড স্ট্যাটস এবং ডাটা লোডিং স্টেট
  const [stats, setStats] = useState({
    myPrompts: 0,
    savedPrompts: 0,
    totalCopies: 0,
    reviewsGiven: 0,
    avgRating: "0.0",
    activityData: []
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // ১. তোমার অরিজিনাল অথেন্টিকেশন ও রোল চেকিং লজিক
  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace('/signin');
      return;
    }

    // যদি সে ক্রিয়েটর না হয়
    if (user.role !== 'creator') {
      if (user.role === 'admin') {
        router.replace('/dashboard/admin-dashboard');
      } else {
        router.replace('/dashboard/user-dashboard');
      }
    }
  }, [user, isPending, router]);

  // ২. API থেকে ড্যাশবোর্ডের ডাটা ফেচ করা
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  useEffect(() => {
    const fetchDashboardStats = async () => {
      // ইউজার ক্রিয়েটর না হলে ডাটা কল করার দরকার নেই
      if (!user?.id || user.role !== 'creator') return;

      try {
        const response = await fetch(`${SERVER_URL}/api/users/stats/${user.id}?email=${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (!isPending && user?.role === 'creator') {
      fetchDashboardStats();
    }
  }, [user, isPending]);

  // তোমার অরিজিনাল লোডিং/চেকিং স্ক্রিন
  if (isPending || !user || user.role !== 'creator') {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center text-gray-400 font-mono text-sm">
        Checking creator permissions...
      </div>
    );
  }

  // ডাটা আসার আগ মুহূর্তের স্পিনার স্ক্রিন
  if (isLoadingStats) {
    return (
      <div className="min-h-screen bg-[#090514] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // মেইন ড্যাশবোর্ড ডিজাইন
  return (
    <div className="min-h-screen bg-[#090514] p-6 lg:p-10 text-white">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-wide">Welcome to Creator Dashboard</h1>
      
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        
        {/* Total Prompts */}
        <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl p-5 rounded-2xl flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <FileText className="text-purple-400 w-5 h-5" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">My Prompts</p>
            <h3 className="text-2xl font-bold mt-0.5">{stats.myPrompts}</h3>
          </div>
        </div>

        {/* Total Copies */}
        <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl p-5 rounded-2xl flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Copy className="text-blue-400 w-5 h-5" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Copies</p>
            <h3 className="text-2xl font-bold mt-0.5">{stats.totalCopies}</h3>
          </div>
        </div>

        {/* Saved Prompts */}
        <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl p-5 rounded-2xl flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Bookmark className="text-emerald-400 w-5 h-5" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Saved</p>
            <h3 className="text-2xl font-bold mt-0.5">{stats.savedPrompts}</h3>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl p-5 rounded-2xl flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Star className="text-amber-400 w-5 h-5" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Avg Rating</p>
            <h3 className="text-2xl font-bold mt-0.5">{stats.avgRating}</h3>
          </div>
        </div>

        {/* Reviews Given */}
        <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl p-5 rounded-2xl flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
          <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
            <MessageSquare className="text-pink-400 w-5 h-5" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">My Reviews</p>
            <h3 className="text-2xl font-bold mt-0.5">{stats.reviewsGiven}</h3>
          </div>
        </div>

      </div>

      {/* Analytics Chart */}
      <div className="grid grid-cols-1 gap-8">
        
        <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-purple-400 w-5 h-5" />
            <h2 className="text-lg font-semibold tracking-wide">Copies Performance</h2>
          </div>
          
          <div className="h-[350px] w-full">
            {stats.activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.activityData}>
                  <defs>
                    <linearGradient id="colorCopies" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090514', borderColor: '#ffffff15', borderRadius: '10px', color: '#fff' }}
                    itemStyle={{ color: '#c084fc' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="TotalCopies" 
                    stroke="#c084fc" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCopies)"
                    dot={{ fill: '#090514', stroke: '#c084fc', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#c084fc' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No activity data available yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreatorDashboard;