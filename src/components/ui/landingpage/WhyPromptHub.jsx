import React from 'react';

const WhyPromptHub = () => {
  // স্ক্রিনশট অনুযায়ী ৬টি স্ট্যাটিক ফিচারের ডাটা সেট
  const features = [
    {
      title: "Quality Moderated",
      description: "Every prompt is reviewed by our editorial team before going live. No spam, no junk.",
      // পার্পল আইকন বক্স ও বর্ডার গ্লো
      iconBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    },
    {
      title: "Instant Results",
      description: "Copy any prompt to your clipboard with one click and use it immediately in your favorite AI tool.",
      // সায়ান/ব্লু আইকন বক্স ও বর্ডার গ্লো
      iconBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      )
    },
    {
      title: "Trending Insights",
      description: "Discover what prompts are generating the most results in the community right now.",
      // গ্রিন আইকন বক্স ও বর্ডার গ্লো
      iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      )
    },
    {
      title: "AI-Powered Search",
      description: "Find exactly what you need with semantic search that understands intent, not just keywords.",
      // অরেঞ্জ/অ্যাম্বার আইকন বক্স ও বর্ডার গ্লো
      iconBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
        </svg>
      )
    },
    {
      title: "Creator Economy",
      description: "Earn recognition and build an audience by sharing your best prompts with the community.",
      // পিঙ্ক/ম্যাজেন্টা আইকন বক্স ও বর্ডার গ্লো
      iconBg: "bg-pink-500/10 border-pink-500/30 text-pink-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      title: "Multi-Model Support",
      description: "Prompts optimized for ChatGPT, Claude, Gemini, Midjourney, and many more AI tools.",
      // ইন্ডিগো/ভায়োলেট আইকন বক্স ও বর্ডার গ্লো
      iconBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z"></path>
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z"></path>
        </svg>
      )
    }
  ];

  return (
    <section className="w-full bg-[#030014] py-20 px-6 text-white select-none">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* 🔹 সেকশন হেডার (কুচকুচে স্টাইলিশ সাবটাইটেল এবং মেইন টাইটেল) */}
        <div className="text-center max-w-2xl mb-16">
          <span className="text-[10px] md:text-11px font-bold uppercase tracking-[0.2em] text-cyan-500 block mb-3 font-mono">
            WHY PROMPTHUB
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white/95">
            Built for Serious AI Users
          </h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            Everything you need to unlock the full potential of AI tools, in one place.
          </p>
        </div>

        {/* 🔹 ফিচার কার্ডস গ্রিড (৩ কলামে ভাগ করা) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {features.map((feature, idx) => (
            <div
              key={idx}
              
              className="group relative flex flex-col items-start p-7 bg-[#0b081f]/40 border border-white/[0.08] hover:border-purple-500/30 rounded-2xl backdrop-blur-md shadow-xl overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/[0.05] transition-all duration-300 ease-out"
            >
              
              {/* কাস্টম আইকন কন্টেইনার */}
              <div className={`p-3 border rounded-xl mb-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${feature.iconBg}`}>
                {feature.icon}
              </div>

              {/* টাইটেল */}
              <h3 className="text-base md:text-lg font-bold text-white/90 group-hover:text-purple-400 transition-colors duration-300 mb-2.5">
                {feature.title}
              </h3>

              {/* ডেসক্রিপশন */}
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-normal">
                {feature.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyPromptHub;