'use client';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FileText, Bookmark, Copy, Star } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

// গ্রাফের ডামি ডাটা (ঠিক স্ক্রিনশটের ফিল অনুযায়ী জুলাই থেকে ডিসেম্বর)
const chartData = [
  { name: 'Jul', views: 120 },
  { name: 'Aug', views: 240 },
  { name: 'Sep', views: 180 },
  { name: 'Oct', views: 350 },
  { name: 'Nov', views: 480 },
  { name: 'Dec', views: 600 },
];

const UserDashboard = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user || null;

  // ডাইনামিক ডাটাবেজ কাউন্টের জন্য স্টেট (আপাতত ডিফল্ট ০)
  const [stats, setStats] = useState({
    myPrompts: 0,
    savedPrompts: 0,
    totalCopies: 0,
    reviewsGiven: 0
  });

  useEffect(() => {

    if (isPending) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'user') {
      if (user.role === 'admin') {
        router.replace('/dashboard/admin-dashboard');
      } else if (user.role === 'creator') {
        router.replace('/dashboard/creator-dashboard');
      }
    }
  }, [user, isPending, router]);

  if (isPending || !user || user.role !== 'user') {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center text-purple-400 font-mono text-xs tracking-widest animate-pulse">
        CHECKING PERMISSIONS...
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* 🔹 হেডার সেকশন */}
      <div>
        <h1 className="text-2xl font-bold tracking-wide text-white">Dashboard Overview</h1>
        <p className="text-gray-400 text-xs mt-1">Welcome back, {user?.name || "demo"}!</p>
      </div>

      {/* 🔹 ৪টি প্রিমিয়াম স্ট্যাটাস কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* কার্ড ১: My Prompts */}
        <div className="bg-[#0c081e]/40 border border-white/[0.04] rounded-2xl p-6 flex flex-col gap-3 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/20 transition-all duration-300">
          <div className="p-2.5 bg-purple-600/10 text-purple-400 border border-purple-500/10 rounded-xl w-fit">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-mono tracking-tight text-white">{stats.myPrompts}</h2>
            <p className="text-[11px] text-gray-500 font-medium tracking-wide mt-1 uppercase font-mono">My Prompts</p>
          </div>
        </div>

        {/* কার্ড ২: Saved Prompts */}
        <div className="bg-[#0c081e]/40 border border-white/[0.04] rounded-2xl p-6 flex flex-col gap-3 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300">
          <div className="p-2.5 bg-cyan-600/10 text-cyan-400 border border-cyan-500/10 rounded-xl w-fit">
            <Bookmark className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-mono tracking-tight text-white">{stats.savedPrompts}</h2>
            <p className="text-[11px] text-gray-500 font-medium tracking-wide mt-1 uppercase font-mono">Saved Prompts</p>
          </div>
        </div>

        {/* কার্ড ৩: Total Copies */}
        <div className="bg-[#0c081e]/40 border border-white/[0.04] rounded-2xl p-6 flex flex-col gap-3 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
          <div className="p-2.5 bg-emerald-600/10 text-emerald-400 border border-emerald-500/10 rounded-xl w-fit">
            <Copy className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-mono tracking-tight text-white">{stats.totalCopies}</h2>
            <p className="text-[11px] text-gray-500 font-medium tracking-wide mt-1 uppercase font-mono">Total Copies</p>
          </div>
        </div>

        {/* কার্ড ৪: Reviews Given */}
        <div className="bg-[#0c081e]/40 border border-white/[0.04] rounded-2xl p-6 flex flex-col gap-3 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
          <div className="p-2.5 bg-amber-600/10 text-amber-400 border border-amber-500/10 rounded-xl w-fit">
            <Star className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-mono tracking-tight text-white">{stats.reviewsGiven}</h2>
            <p className="text-[11px] text-gray-500 font-medium tracking-wide mt-1 uppercase font-mono">Reviews Given</p>
          </div>
        </div>

      </div>

      {/* 🔹 অ্যাক্টিভিটি ওভারভিউ গ্লাসমরফিক চার্ট বক্স */}
      <div className="bg-[#0c081e]/30 border border-white/[0.04] rounded-2xl p-6 backdrop-blur-xl space-y-6">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white">Activity Overview</h3>
        </div>

        {/* গ্রাফ কন্টেইনার */}
        <div className="h-[280px] w-full pr-4 text-xs font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {/* গ্রাফের ভেতরের মসৃণ বেগুনি রঙের গ্রেডিয়েন্ট */}
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                stroke="#4b5563" 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                stroke="#4b5563" 
                domain={[0, 800]} 
                ticks={[0, 200, 400, 600, 800]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0c081e', 
                  borderColor: 'rgba(255,255,255,0.08)', 
                  borderRadius: '12px',
                  color: '#fff'
                }} 
              />
              
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#a855f7" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorViews)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default UserDashboard;