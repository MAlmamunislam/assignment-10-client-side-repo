"use client";
import React, { useState, useEffect } from "react";
import { Search, Copy, Eye, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const AllPrompts = () => {
  const router = useRouter();
  
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAiTool, setSelectedAiTool] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchAllPublicPrompts = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/prompts/public`);
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

  useEffect(() => {
    let result = [...prompts];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter((prompt) => {
        const titleMatch = prompt.title?.toLowerCase().includes(query);
        const aiToolMatch = prompt.aiTool?.toLowerCase().includes(query);
        const tagsMatch = prompt.tags?.toLowerCase().includes(query);
        return titleMatch || aiToolMatch || tagsMatch;
      });
    }

    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (selectedAiTool) result = result.filter((p) => p.aiTool === selectedAiTool);
    if (selectedDifficulty) result = result.filter((p) => p.difficulty === selectedDifficulty);

    if (sortBy === "popular") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "most-copied") result.sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0));
    else if (sortBy === "latest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredPrompts(result);
  }, [searchQuery, selectedCategory, selectedAiTool, selectedDifficulty, sortBy, prompts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070514] flex items-center justify-center text-purple-400 font-mono text-xs tracking-widest animate-pulse">
        LOADING PREMIUM MARKETPLACE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070514] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-[#070514] to-[#04020b] px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-10 text-white">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium backdrop-blur-md">
          <Zap className="h-3 w-3 fill-purple-400" /> Marketplace Live
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
          Discover AI Prompts
        </h1>
        <p className="text-gray-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
          Explore, filter, and copy premium engineered prompts to supercharge your workflow.
        </p>
      </div>

      {/* Filter Panel */}
      <div className="max-w-6xl mx-auto bg-[#0d0a21]/40 border border-white/[0.05] backdrop-blur-2xl rounded-2xl p-4 md:p-5 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, tags, or AI tool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070514]/60 border border-white/[0.06] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500/40 text-white transition-all placeholder:text-gray-600"
            />
          </div>

          {/* Filter Dropdowns - Updated Styles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-[#1a1633] border border-purple-500/30 rounded-xl px-3 py-3 text-xs cursor-pointer focus:outline-none focus:border-purple-400 text-white transition-all">
              <option value="">All Categories</option>
              <option value="Graphics">Graphics & Design</option>
              <option value="Coding">Coding & Dev</option>
              <option value="Copywriting">Copywriting</option>
            </select>
            <select value={selectedAiTool} onChange={(e) => setSelectedAiTool(e.target.value)} className="bg-[#1a1633] border border-purple-500/30 rounded-xl px-3 py-3 text-xs cursor-pointer focus:outline-none focus:border-purple-400 text-white transition-all">
              <option value="">All AI Tools</option>
              <option value="ChatGPT">ChatGPT</option>
              <option value="Midjourney">Midjourney</option>
            </select>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="bg-[#1a1633] border border-purple-500/30 rounded-xl px-3 py-3 text-xs cursor-pointer focus:outline-none focus:border-purple-400 text-white transition-all">
              <option value="">Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Pro">Pro</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#1a1633] border border-purple-500/30 rounded-xl px-3 py-3 text-xs cursor-pointer focus:outline-none focus:border-purple-400 text-white transition-all">
              <option value="latest">Sort: Latest</option>
              <option value="popular">Sort: Popular</option>
              <option value="most-copied">Sort: Copied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredPrompts.length === 0 ? (
        <div className="text-center py-24 max-w-6xl mx-auto bg-[#0d0a21]/20 border border-white/[0.03] rounded-2xl backdrop-blur-md">
          <p className="text-gray-500 text-sm">No premium prompts found matching your criteria.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <div key={prompt._id || prompt.id} className="bg-[#0d0a22]/50 border border-white/[0.05] hover:border-purple-500/30 rounded-[24px] overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-300 group hover:-translate-y-1.5">
              <div className="h-52 w-full bg-[#05030f] relative overflow-hidden p-3">
                <img src={prompt.thumbnail || "/placeholder.jpg"} alt={prompt.title} className="w-full h-full object-cover rounded-2xl" />
                <span className="absolute top-5 left-5 bg-[#7c3aed] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">★ Featured</span>
                <span className="absolute top-5 right-5 bg-black/40 backdrop-blur-md border border-white/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">{prompt.aiTool || "ChatGPT"}</span>
              </div>
              
              <div className="px-6 pt-2 pb-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h3 className="font-bold text-[17px] text-white">{prompt.title}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2">{prompt.description}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {prompt.tags?.split(",").map((tag, idx) => (
                      <span key={idx} className="text-[10px] text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded-lg border border-purple-500/10">#{tag.trim()}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                  <div className="flex items-center gap-3.5 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><Copy className="h-3.5 w-3.5" /> {(prompt.copyCount || 0).toLocaleString()}</span>
                    <span className="flex items-center gap-1 text-amber-400/90">★ {prompt.rating ? parseFloat(prompt.rating).toFixed(1) : "0.0"}</span>
                  </div>
                  <button onClick={() => router.push(`/all-prompts/${prompt._id || prompt.id}`)} className="flex items-center gap-1.5 px-4 py-2 bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-xs font-bold rounded-xl transition-all">
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                </div>
              </div>

              {/* User Footer */}
              <div className="bg-black/20 px-6 py-3.5 flex items-center justify-between text-xs border-t border-white/[0.03]">
                <div className="flex items-center gap-2">
                  <img src={prompt.userImage || "https://api.dicebear.com/7.x/bottts/svg?seed=placeholder"} alt={prompt.userName} className="h-6 w-6 rounded-full border border-white/10" />
                  <span className="text-gray-400 font-medium truncate max-w-[130px]">{prompt.userName || "Creator"}</span>
                </div>
                <span className="text-[11px] text-gray-500 bg-white/[0.03] px-2.5 py-0.5 rounded-full">{prompt.category || "Marketing"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPrompts;