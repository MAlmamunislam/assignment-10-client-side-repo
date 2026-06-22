"use client";
import React, { useEffect, useState } from "react";
import { Users, FileText, MessageSquare, Copy, Loader2, Award, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ;
      // sesssion check
      const router = useRouter();
      const { data: session, isPending } = authClient.useSession();
      const user = session?.user || null;
    
      const isAdmin = user?.role === "admin";
    
      useEffect(() => {
        if (isPending) {
          <p className="text-white/90 text-sm font-medium tracking-wide animate-pulse">
             Loading...
          </p>;
          return;
        }
        if (!user) {
          router.replace("/login");
          return;
        }
    
        if (!isAdmin) {
          router.replace("/dashboard");
        }
      });

  useEffect(() => {
    fetch(`${SERVER_URL}/api/admin/stats`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500 h-10 w-10" /></div>;

  const cards = [
    { title: "Total Users", value: stats?.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Total Prompts", value: stats?.totalPrompts, icon: FileText, color: "text-purple-400", bg: "bg-purple-400/10" },
    { title: "Total Reviews", value: stats?.totalReviews, icon: MessageSquare, color: "text-green-400", bg: "bg-green-400/10" },
    { title: "Total Copies", value: stats?.totalCopies, icon: Copy, color: "text-orange-400", bg: "bg-orange-400/10" },
  ];

  return (
    <div className="space-y-8">
          <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/10 p-8 rounded-3xl flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Platform Overview</h3>
         <p>Monitor your platform's performance and stay up-to-date with the latest trends.</p>
        </div>
        <div className="hidden md:block">
            <Award className="text-yellow-500/50" size={64}/>
        </div>
      </div>
      {/* মেইন গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-[#090514] border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all duration-300 shadow-xl group">
            <div className={`p-3 rounded-2xl w-fit ${card.bg} mb-4`}>
              <card.icon className={card.color} size={24} />
            </div>
            <h4 className="text-gray-400 text-sm font-medium">{card.title}</h4>
            <p className="text-3xl font-bold text-white mt-1 group-hover:scale-105 transition-transform origin-left">{card.value?.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* অতিরিক্ত সেকশন: একটি ওয়েলকাম ব্যানার বা নোটিশ টাইপ বক্স */}
    
    </div>
  );
};

export default AdminAnalytics;