'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

const HeroBanner = ({ onSearchSubmit }) => {
  const [query, setQuery] = useState('');

  const trendingTags = [
    'storytelling',
    'code-review',
    'seo-boost',
    'image-gen',
    'productivity',
    'writing-assistant'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(query);
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    if (onSearchSubmit) onSearchSubmit(tag);
  };

  return (
    <section className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-6 bg-[#030014] overflow-hidden pt-10 pb-2">
      
      {/* 🔮 ব্যাকগ্রাউন্ড অ্যাপল-স্টাইল গ্লো */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-gradient-to-r from-purple-600/15 to-blue-600/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
        
        {/* ১. টপ ব্যাজ */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/30 border border-purple-500/30 text-purple-300 text-xs font-medium tracking-wide mb-2 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>12,400+ AI prompts and counting</span>
        </motion.div>

        {/* ২. মেইন হেডিং */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15]"
        >
          Supercharge Your AI <br />
          <span className="bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            with Expert Prompts
          </span>
        </motion.h1>

        {/* ৩. সাবটাইটেল */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-gray-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed"
        >
          Discover, create, and share high-quality AI prompts for ChatGPT, Claude, Midjourney, and more. Join 3,200+ creators building the future of human-AI interaction.
        </motion.p>

        {/* ৪. সার্চ ইনপুট ও বাটন কনটেইনার (image_d5f9de.png অনুযায়ী ঠিক সাবটাইটেলের নিচে) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 w-full max-w-3xl"
        >
          <form onSubmit={handleSearch} className="flex items-center gap-3 w-full">
            {/* ইনপুট ফিল্ড */}
            <div className="flex items-center flex-1 bg-[#090616] border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-purple-500/40 transition-all shadow-inner">
              <Search className="w-5 h-5 text-gray-500 flex-shrink-0 mr-3" />
              <input 
                type="text" 
                placeholder="Search prompts, tags, AI tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
              />
            </div>

            {/* সার্চ বাটন */}
            <button 
              type="submit"
              className="px-8 py-4 bg-[#6322d4] hover:bg-[#5219b8] text-white font-semibold text-sm rounded-2xl shadow-lg shadow-purple-950/40 active:scale-95 transition-all flex-shrink-0"
            >
              Search
            </button>
          </form>

          {/* ৫. ট্রেন্ডিং ট্যাগস (ইনপুটের ঠিক নিচে ক্যাপসুল ডিজাইন) */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-gray-400 pl-1">
            <span className="text-gray-500 font-medium mr-1">Trending:</span>
            {trendingTags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1.5 rounded-full bg-[#0a051d] border border-purple-950/80 text-[#8b5cf6] hover:text-white hover:bg-purple-900/20 hover:border-purple-800/40 transition-all font-mono animate-in fade-in duration-300"
              >
                #{tag}
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroBanner;