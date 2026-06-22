"use client";
import React, { useEffect, useState } from "react";
import { Copy, Eye, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const AllPrompts = () => {
  const router = useRouter();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ;

  useEffect(() => {
    const fetchTopPrompts = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/prompts/public`);
        if (res.ok) {
          const data = await res.json();
          
          // এখানে সর্টিং ও লিমিট করছি: প্রথমে Rating, তারপর CopyCount দিয়ে যাচাই করে সেরা ৩টি নিচ্ছি
          const topThree = data
            .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.copyCount || 0) - (a.copyCount || 0))
            .slice(0, 3);
            
          setPrompts(topThree);
        }
      } catch (error) {
        console.error("Error fetching prompts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopPrompts();
  }, [SERVER_URL]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#030014] text-purple-400 font-mono text-xs tracking-widest animate-pulse">
        LOADING PREMIUM PICKS...
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 space-y-10 bg-[#030014]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
          <Zap className="h-3 w-3 fill-purple-400" /> Top Rated Prompts
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white">Trending Picks</h1>
      </div>

      {/* Cards Grid (Only 3) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <div key={prompt._id || prompt.id} className="bg-[#0d0a22] border border-purple-500/30 rounded-[24px] overflow-hidden flex flex-col shadow-2xl transition-all duration-300 hover:-translate-y-1.5">
            <div className="h-48 w-full bg-[#05030f] relative overflow-hidden p-3">
              <img src={prompt.thumbnail || "/placeholder.jpg"} alt={prompt.title} className="w-full h-full object-cover rounded-2xl" />
              <span className="absolute top-5 right-5 bg-black/40 backdrop-blur-md border border-white/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">{prompt.aiTool || "ChatGPT"}</span>
            </div>
            
            <div className="px-6 pt-2 pb-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-[17px] text-white">{prompt.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-2">{prompt.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-3.5 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5"><Copy className="h-3.5 w-3.5" /> {(prompt.copyCount || 0).toLocaleString()}</span>
                  <span className="flex items-center gap-1 text-amber-400/90">★ {prompt.rating ? parseFloat(prompt.rating).toFixed(1) : "0.0"}</span>
                </div>
                <button onClick={() => router.push(`/all-prompts/${prompt._id || prompt.id}`)} className="px-4 py-2 bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-xs font-bold rounded-xl transition-all">
                  <Eye className="h-3.5 w-3.5 inline mr-1" /> View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPrompts;