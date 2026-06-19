import React from 'react';

const TopCreators = () => {
  // 💡 এপিআই থেকে রিয়েল ডাটা আসার পর এই অ্যারেটি রিপ্লেস করে দেবে
  const creatorsData = [
    {
      id: 1,
      name: "Alex Rivera",
      role: "admin",
      roleBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", // ডামি প্রোফাইল ইমেজ
      promptsCount: "0",
      copiesCount: "0.0K",
      hasBadge: true // প্রথম ইউজারের মাথায় যেমন একটা ছোট ক্রাউন/ব্যাজ আছে
    },
    {
      id: 2,
      name: "Sophia Chen",
      role: "creator",
      roleBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      promptsCount: "2",
      copiesCount: "4.5K",
      hasBadge: false
    },
    {
      id: 3,
      name: "Marcus Johnson",
      role: "creator",
      roleBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      promptsCount: "2",
      copiesCount: "4.1K",
      hasBadge: false
    },
    {
      id: 4,
      name: "Liam Nguyen",
      role: "creator",
      roleBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
      promptsCount: "2",
      copiesCount: "4.5K",
      hasBadge: false
    }
  ];

  return (
    <section className="w-full bg-[#030014] py-20 px-6 text-white select-none">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* 🔹 সেকশন হেডার */}
        <div className="text-center mb-12">
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400 block mb-3 font-mono">
            COMMUNITY LEADERS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white/95">
            Top Creators
          </h2>
        </div>

        {/* 🔹 ক্রিয়েটর কার্ডস গ্রিড কন্টেইনার */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {creatorsData.map((creator) => (
            <div
              key={creator.id}
         
              className="group relative flex flex-col items-center p-6 bg-[#0b081f]/40 border border-white/[0.08] hover:border-purple-500/40 rounded-2xl backdrop-blur-md shadow-xl transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/[0.06] transition-all duration-300 ease-out"
            >
              
              {/* ১. অ্যাভাটার বা প্রোফাইল ইমেজ সেকশন */}
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-b from-white/10 to-transparent group-hover:from-purple-500/40 transition-all duration-300">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name} 
                    className="w-full h-full rounded-full object-cover border border-[#030014]"
                  />
                </div>
                
                {/* গোল্ডেন ক্রাউন ব্যাজ (যদি ট্রু থাকে) */}
                {creator.hasBadge && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center border-2 border-[#030014] shadow-md animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* ২. নাম এবং রোল/ব্যাজ */}
              <h3 className="text-base font-bold text-white/90 group-hover:text-purple-400 transition-colors duration-300 mb-1.5">
                {creator.name}
              </h3>
              
              <span className={`px-3 py-0.5 border text-[10px] font-semibold uppercase tracking-wider rounded-md mb-6 ${creator.roleBg}`}>
                {creator.role}
              </span>

              {/* ৩. স্ট্যাটিস্টিকস রো (Prompts & Copies কাউন্টার) */}
              <div className="grid grid-cols-2 gap-3 w-full mt-auto">
                
                {/* প্রম্পট কাউন্ট বক্স */}
                <div className="flex flex-col items-center justify-center py-2.5 px-3 bg-[#0d0a26]/50 border border-white/[0.03] rounded-xl text-center">
                  <span className="text-sm font-bold text-white/90">{creator.promptsCount}</span>
                  <span className="text-[10px] text-gray-500 font-medium mt-0.5">Prompts</span>
                </div>

                {/* কপি কাউন্ট বক্স */}
                <div className="flex flex-col items-center justify-center py-2.5 px-3 bg-[#0d0a26]/50 border border-white/[0.03] rounded-xl text-center">
                  <span className="text-sm font-bold text-white/90">{creator.copiesCount}</span>
                  <span className="text-[10px] text-gray-500 font-medium mt-0.5">Copies</span>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TopCreators;