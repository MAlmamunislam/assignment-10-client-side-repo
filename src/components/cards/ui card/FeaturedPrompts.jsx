import React from 'react';

const FeaturedPrompts = () => {
  // এপিআই থেকে ডাটা আনার ডামি অ্যারে
  const dummyPrompts = [
    {
      id: 1,
      title: "Elite Code Review Assistant",
      description: "A systematic prompt that conducts thorough code reviews covering security, performance, maintainability and best...",
      category: "Coding",
      model: "Claude",
      modelColor: "text-amber-500 border-amber-500/20 bg-amber-500/5",
      level: "Pro",
      levelColor: "text-red-400 border-red-500/20 bg-red-500/5",
      tags: ["code-review", "programming"],
      views: "2,847",
      rating: "4.9",
      author: "Sophia Chen",
      authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    },
    {
      id: 2,
      title: "Viral Marketing Copy Generator",
      description: "Transform any product or service into compelling, conversion-optimized marketing copy that resonates with your target...",
      category: "Marketing",
      model: "ChatGPT",
      modelColor: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      level: "Intermediate",
      levelColor: "text-amber-400 border-amber-500/20 bg-amber-400/5",
      tags: ["marketing", "copywriting"],
      views: "1,923",
      rating: "4.7",
      author: "Marcus Johnson",
      authorImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    },
    {
      id: 3,
      title: "Cinematic Scene Generator",
      description: "Create breathtaking, highly detailed AI image prompts for Midjourney that produce cinematic, professional-grade...",
      category: "Image Generation",
      model: "Midjourney",
      modelColor: "text-pink-400 border-pink-500/20 bg-pink-500/5",
      level: "Intermediate",
      levelColor: "text-amber-400 border-amber-500/20 bg-amber-400/5",
      tags: ["image-gen", "midjourney"],
      views: "3,441",
      rating: "4.8",
      author: "Liam Nguyen",
      authorImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150"
    }
  ];

  return (
    <section className="w-full bg-[#030014] py-16 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔹 সেকশন হেডার */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Featured Prompts
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Handpicked for Excellence</h2>
          </div>
          
          <a href="/all-prompts" className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-white transition-colors group">
            View all 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

        {/* 🔹 প্রম্পট কার্ডস গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyPrompts.map((prompt) => (
            <div 
              key={prompt.id} 
         
              className="group relative flex flex-col justify-between p-5 bg-[#0b081f]/60 border border-white/[0.08] hover:border-purple-500/40 rounded-2xl backdrop-blur-md shadow-xl overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 ease-out"
            >
              <div>
                {/* ১. টপ ব্যাজ সেকশন */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-600/10 border border-purple-500/30 rounded-lg text-[11px] font-bold tracking-wide text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    Featured
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 border rounded-md text-[10px] font-medium ${prompt.modelColor}`}>
                      {prompt.model}
                    </span>
                    <span className={`px-2 py-0.5 border rounded-md text-[10px] font-medium ${prompt.levelColor}`}>
                      {prompt.level}
                    </span>
                  </div>
                </div>

                {/* ২. টাইটেল ও ডেসক্রিপশন */}
                <h3 className="text-base font-semibold text-white/95 group-hover:text-purple-400 transition-colors duration-300 mb-2 line-clamp-1">
                  {prompt.title}
                </h3>
                <p className="text-xs text-gray-400/80 leading-relaxed mb-4 line-clamp-3">
                  {prompt.description}
                </p>

                {/* ৩. ট্যাগস */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {prompt.tags.map((tag, idx) => (
                    <span key={idx} className="text-[11px] text-indigo-400 bg-indigo-500/5 px-2.5 py-0.5 border border-indigo-500/20 rounded-md font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* ৪. কার্ড ফুটার */}
              <div className="border-t border-white/5 pt-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  {/* ভিউ এবং রেটিং */}
                  <div className="flex items-center gap-3.5 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      {prompt.views}
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <span className="text-gray-400">{prompt.rating}</span>
                    </div>
                  </div>

                  {/* ভিউ বাটন (স্মুথ স্কেল অ্যানিমেশনসহ) */}
                  <button className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-purple-500/10 active:scale-95 hover:scale-105 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View
                  </button>
                </div>

                {/* ক্রিয়েটর প্রোফাইল ও ক্যাটাগরি */}
                <div className="flex items-center justify-between border-t border-white/[0.03] pt-3">
                  <div className="flex items-center gap-2">
                    <img 
                      src={prompt.authorImage} 
                      alt={prompt.author} 
                      className="w-5 h-5 rounded-full object-cover border border-white/10"
                    />
                    <span className="text-xs text-gray-500 hover:text-white cursor-pointer transition-colors duration-300">
                      {prompt.author}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 bg-white/[0.02] border border-white/10 px-2 py-0.5 rounded-md">
                    {prompt.category}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedPrompts;