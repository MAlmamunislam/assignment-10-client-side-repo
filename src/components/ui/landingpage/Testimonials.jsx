import React from 'react';

const Testimonials = () => {
  // 💡 এপিআই থেকে ডাটা এলে এই ডামি অ্যারেটি পরিবর্তন করে দেবে
  const testimonialsData = [
    {
      id: 1,
      rating: 5,
      text: `"Absolutely game-changing for my code reviews! Catches issues I consistently miss. The structured output format makes it easy to share with the team."`,
      author: "Priya Sharma",
      date: "2024-12-15",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    },
    {
      id: 2,
      rating: 5,
      text: `"Generated copy that actually converted! My ad CTR went up 34% in the first week using prompts from this template."`,
      author: "Emma Wilson",
      date: "2024-12-18",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    {
      id: 3,
      rating: 5,
      text: `"The cinematic quality of images using this prompt is unreal. Worth every penny of premium."`,
      author: "Alex Rivera",
      date: "2024-12-22",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    },
    {
      id: 4,
      rating: 4, // এটি ৪ স্টার, ১টি স্টার খালি থাকবে
      text: `"Really thorough review format. Would love a version specifically for React/TypeScript but works well as-is."`,
      author: "Emma Wilson",
      date: "2024-12-23",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
    }
  ];

  // ⭐️ ডাইনামিক স্টার রেটিং রেন্ডার করার হেল্পার ফাংশন
  const renderStars = (rating) => {
    const totalStars = 5;
    return Array.from({ length: totalStars }, (_, index) => {
      const isFilled = index < rating;
      return (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={isFilled ? "currentColor" : "none"}
          className={isFilled ? "text-amber-500" : "text-gray-600 stroke-gray-600"}
          strokeWidth={isFilled ? "0" : "2"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      );
    });
  };

  return (
    <section className="w-full bg-[#030014] py-20 px-6 text-white select-none">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* 🔹 সেকশন হেডার */}
        <div className="text-center mb-14">
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-pink-500 block mb-3 font-mono">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white/95">
            Loved by the Community
          </h2>
        </div>

        {/* 🔹 টেস্টিমোনিয়াল কার্ডস গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-7xl">
          {testimonialsData.map((testimonial) => (
            <div
              key={testimonial.id}
         
              className="group relative flex flex-col justify-between p-6 bg-[#0b081f]/40 border border-white/[0.08] hover:border-purple-500/30 rounded-2xl backdrop-blur-md shadow-xl transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/[0.04] transition-all duration-300 ease-out"
            >
              <div>
                {/* ১. ডাইনামিক স্টার রেটিং সেকশন */}
                <div className="flex items-center gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* ২. রিভিউ টেক্সট */}
                <p className="text-xs md:text-[13px] text-gray-400 leading-relaxed font-normal mb-6">
                  {testimonial.text}
                </p>
              </div>

              {/* ৩. রিভিউ দাতার প্রোফাইল (ফুটার) */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.03]">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-8 h-8 rounded-full object-cover border border-white/10 group-hover:border-purple-500/40 transition-colors duration-300"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white/90 group-hover:text-purple-400 transition-colors duration-300">
                    {testimonial.author}
                  </span>
                  <span className="text-[10px] text-gray-600 font-medium mt-0.5 font-mono">
                    {testimonial.date}
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

export default Testimonials;