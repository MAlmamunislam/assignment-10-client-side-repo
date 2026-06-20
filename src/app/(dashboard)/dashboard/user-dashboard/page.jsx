"use client";
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FileText, Bookmark, Copy, Star } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const UserDashboard = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user || null;

  const [stats, setStats] = useState({
    myPrompts: 0,
    savedPrompts: 0,
    totalCopies: 0,
    reviewsGiven: 0,
    activityData: []
  });

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'user') {
      if (user.role === 'admin') router.replace('/dashboard/admin-dashboard');
      else if (user.role === 'creator') router.replace('/dashboard/creator-dashboard');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/stats/${user.id}?email=${user.email}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [user, isPending, router]);

  if (isPending || !user || user.role !== 'user') {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center text-purple-400 font-mono text-xs tracking-widest animate-pulse">
        LOADING...
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold tracking-wide text-white">Dashboard Overview</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Prompts', val: stats.myPrompts, icon: FileText, color: 'text-purple-400' },
          { label: 'Saved Prompts', val: stats.savedPrompts, icon: Bookmark, color: 'text-cyan-400' },
          { label: 'Total Copies', val: stats.totalCopies, icon: Copy, color: 'text-emerald-400' },
          { label: 'Reviews Given', val: stats.reviewsGiven, icon: Star, color: 'text-amber-400' },
        ].map((item, i) => (
          <div key={i} className="bg-[#0c081e]/40 border border-white/[0.04] rounded-2xl p-6 flex flex-col gap-3 backdrop-blur-xl">
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <h2 className="text-3xl font-bold text-white">{item.val || 0}</h2>
            <p className="text-[11px] text-gray-500 uppercase font-mono">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Fixed Dynamic Activity Chart */}
   {/* Fixed Dynamic Activity Chart */}
<div className="bg-[#0c081e]/30 border border-white/[0.04] rounded-2xl p-6 backdrop-blur-xl">
  <h3 className="text-sm font-semibold text-white mb-6">Activity Overview</h3>
  
  {/* এখানে কন্ডিশন চেক করছি: ডাটা না থাকলে গ্রাফ লোড হবে না */}
  {stats.activityData && stats.activityData.length > 0 ? (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={stats.activityData}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#4b5563" />
          <YAxis axisLine={false} tickLine={false} stroke="#4b5563" />
          <Tooltip contentStyle={{ backgroundColor: '#0c081e', borderRadius: '12px', border: 'none' }} />
          <Area type="monotone" dataKey="TotalCopies" stroke="#a855f7" fillOpacity={1} fill="url(#colorViews)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ) : (
    // ডাটা না থাকলে একটি লোডিং মেসেজ দেখাবে
    <div className="h-[280px] flex items-center justify-center text-gray-500 font-mono text-xs">
    <div className="w-full flex items-center justify-center py-8">
  <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-[#0B0A1A] via-[#14112B] to-[#090814] p-8">

    <div className="absolute top-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl"></div>

    <div className="relative z-10 flex flex-col items-center text-center">

      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20">
        <Copy className="h-8 w-8 text-violet-400" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white">
        No one has copied
      </h2>

      <h2 className="text-2xl md:text-3xl font-bold">
        <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
          your
        </span>{" "}
        prompt yet.
      </h2>

      <p className="mt-4 text-sm text-gray-400 max-w-md">
        Share your prompt with the community and watch your first copy appear.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <div className="w-12 h-[1px] bg-violet-500/30"></div>
        <div className="w-2 h-2 rotate-45 bg-violet-400"></div>
        <div className="w-12 h-[1px] bg-violet-500/30"></div>
      </div>

    </div>
  </div>
</div>
    </div>
  )}
</div>
    </div>
  );
};

export default UserDashboard;