"use client";
import React, { useState, useEffect } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  Copy, 
  Eye, 
  TrendingUp, 
  Folder, 
  Cpu, 
  Layers,
  Sparkles,
  ArrowUpDown
} from "lucide-react";
import { useRouter } from "next/navigation";

const AllPrompts = () => {
  const router = useRouter();
  
  // স্টেট ম্যানেজমেন্ট
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  // সার্চ ও ফিল্টার স্টেট
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAiTool, setSelectedAiTool] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // ১. ডাটাবেজ থেকে সব পাবলিক প্রম্পট ফেচ করা
  useEffect(() => {
    const fetchAllPublicPrompts = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/prompts/public`); // তোমার এপিআই এন্ডপয়েন্ট অনুযায়ী চেঞ্জ করতে পারো
        if (res.ok) {
          const data = await res.json();
          setPrompts(data || []);
          setFilteredPrompts(data || []);
        }
      } catch (error) {
        console.error("Error fetching prompts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPublicPrompts();
  }, [SERVER_URL]);

  // ২. 🔮 রিয়েল-টাইম সার্চ, ফিল্টার এবং সর্টিং লজিক
  useEffect(() => {
    let result = [...prompts];

    // 🔍 সার্চ ফাংশনালিটি (Title, Tags, AI Tool)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter((prompt) => {
        const titleMatch = prompt.title?.toLowerCase().includes(query);
        const aiToolMatch = prompt.aiTool?.toLowerCase().includes(query);
        const tagsMatch = prompt.tags?.toLowerCase().includes(query);
        return titleMatch || aiToolMatch || tagsMatch;
      });
    }

    // 📁 ক্যাটাগরি ফিল্টার
    if (selectedCategory) {
      result = result.filter((prompt) => prompt.category === selectedCategory);
    }

    // 🤖 এআই টুল ফিল্টার
    if (selectedAiTool) {
      result = result.filter((prompt) => prompt.aiTool === selectedAiTool);
    }

    // ⚡ ডিফিকাল্টি লেভেল ফিল্টার
    if (selectedDifficulty) {
      result = result.filter((prompt) => prompt.difficulty === selectedDifficulty);
    }

    // 📊 সোর্টিং লজিক
    if (sortBy === "popular") {
      // রেটিং অনুযায়ী (যদি রেটিং না থাকে তবে ডিফল্ট ৫ বা ০ হ্যান্ডেল করা)
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "most-copied") {
      // কপি কাউন্ট অনুযায়ী
      result.sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0));
    } else if (sortBy === "latest") {
      // একদম নতুন প্রম্পট সবার আগে
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredPrompts(result);
  }, [searchQuery, selectedCategory, selectedAiTool, selectedDifficulty, sortBy, prompts]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-purple-400 font-mono text-xs tracking-widest animate-pulse">
        LOADING MARKETPLACE...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-8 text-white">
      
      {/* 🚀 টপ হেডার সেকশন */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-purple-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-400" /> Discover AI Prompts
        </h1>
        <p className="text-gray-400 text-sm">
          Explore, filter, and copy high-engineered prompts to supercharge your workflow.
        </p>
      </div>

      {/* 🛠️ সার্চ, ফিল্টার এবং সর্ট কন্ট্রোল প্যানেল (Premium Glassmorphism) */}
      <div className="bg-[#0c081e]/40 border border-white/[0.05] backdrop-blur-xl rounded-2xl p-4 lg:p-6 space-y-4 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* 🔍 সার্চ বার */}
          <div className="relative lg:col-span-5">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, tags, or AI tool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/[0.06] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 text-white transition-colors placeholder:text-gray-600"
            />
          </div>

          {/* 📁 ক্যাটাগরি ড্রপডাউন */}
          <div className="relative lg:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-black/30 border border-white/[0.06] rounded-xl px-3 py-3 text-sm cursor-pointer focus:outline-none focus:border-purple-500/50 text-gray-300"
            >
              <option value="">All Categories</option>
              <option value="Graphics">Graphics & Design</option>
              <option value="Coding">Coding & Dev</option>
              <option value="Copywriting">Copywriting</option>
              <option value="Marketing">SEO & Marketing</option>
            </select>
          </div>

          {/* 🤖 এআই টুল ড্রপডাউন */}
          <div className="relative lg:col-span-2">
            <select
              value={selectedAiTool}
              onChange={(e) => setSelectedAiTool(e.target.value)}
              className="w-full bg-black/30 border border-white/[0.06] rounded-xl px-3 py-3 text-sm cursor-pointer focus:outline-none focus:border-purple-500/50 text-gray-300"
            >
              <option value="">All AI Tools</option>
              <option value="Midjourney">Midjourney</option>
              <option value="ChatGPT">ChatGPT</option>
              <option value="Claude">Claude AI</option>
              <option value="Stable Diffusion">Stable Diffusion</option>
            </select>
          </div>

          {/* ⚡ ডিফিকাল্টি ড্রপডাউন */}
          <div className="relative lg:col-span-1.5 lg:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-black/30 border border-white/[0.06] rounded-xl px-3 py-3 text-sm cursor-pointer focus:outline-none focus:border-purple-500/50 text-gray-300"
            >
              <option value="">Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Pro">Pro</option>
            </select>
          </div>

          {/* 📊 সর্টিং ড্রপডাউন */}
          <div className="relative lg:col-span-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-purple-950/20 border border-purple-500/30 rounded-xl px-2 py-3 text-sm cursor-pointer focus:outline-none focus:border-purple-500/50 text-purple-300 font-medium"
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
              <option value="most-copied">Most Copied</option>
            </select>
          </div>

        </div>
      </div>

      {/* 🎴 প্রম্পট কার্ড গ্রিড সেকশন */}
      {filteredPrompts.length === 0 ? (
        <div className="text-center py-20 bg-[#0c081e]/20 border border-white/[0.02] rounded-3xl">
          <p className="text-gray-500 text-sm">No prompts found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <div 
              key={prompt._id || prompt.id}
              className="bg-[#0f0a24]/60 border border-white/[0.04] hover:border-purple-500/30 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              {/* 📸 কার্ড টপ (থাম্বনেইল ইমেজ ও ব্যাজ) */}
              <div className="h-48 w-full bg-black/40 relative overflow-hidden">
                {prompt.thumbnail ? (
                  <img 
                    src={prompt.thumbnail} 
                    alt={prompt.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs font-mono">
                    NO THUMBNAIL
                  </div>
                )}
                
                {/* 🏷️ এআই টুল ব্যাজ */}
                <span className="absolute top-3 right-3 bg-teal-500/10 backdrop-blur-md border border-teal-500/30 text-teal-400 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md">
                  {prompt.aiTool || "AI Tool"}
                </span>
                
                {/* 🌟 কাস্টম ফিচারড বা ডিফিকাল্টি ব্যাজ */}
                <span className="absolute top-3 left-3 bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-purple-300 text-[10px] font-medium px-2.5 py-1 rounded-md">
                  {prompt.difficulty || "Beginner"}
                </span>
              </div>

              {/* 📝 কার্ড বডি (টাইটেল, ডেসক্রিপশন, ট্যাগস) */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                    {prompt.title}
                  </h3>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                    {prompt.description}
                  </p>
                  
                  {/* 🏷️ ট্যাগলিস্ট রেন্ডারিং */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prompt.tags?.split(",").map((tag, idx) => (
                      <span key={idx} className="text-[10px] text-purple-400/80 bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 📊 কাউন্টার ও ভিউ বাটন */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Copy className="h-3.5 w-3.5" /> {prompt.copyCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      ★ {prompt.rating || "4.5"}
                    </span>
                  </div>
                  
                  {/* 🎯 ভিউ ডিটেইলস বাটন */}
                  <button
                    onClick={() => router.push(`/prompts/${prompt._id || prompt.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white text-xs font-semibold rounded-lg border border-purple-500/20 hover:border-transparent transition-all cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                </div>
              </div>

              {/* 👤 কার্ড ফুটার (ক্রিয়েটর ইনফো) */}
              <div className="bg-black/20 px-5 py-3 flex items-center justify-between text-xs border-t border-white/[0.02]">
                <div className="flex items-center gap-2">
                  <img 
                    src={prompt.userImage || "https://api.dicebear.com/7.x/bottts/svg?seed=placeholder"} 
                    alt={prompt.userName} 
                    className="h-5 w-5 rounded-full object-cover border border-white/10"
                  />
                  <span className="text-gray-400 font-medium truncate max-w-[120px]">
                    {prompt.userName || "Anonymous"}
                  </span>
                </div>
                <span className="text-[10px] text-gray-600 font-mono">
                  {prompt.category}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPrompts;