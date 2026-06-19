'use client';
import { motion } from 'framer-motion';
import { Code, Palette, BookOpen, Brain, TrendingUp, Sparkles, Users, Layers, Star } from 'lucide-react';

const StatsAndCategories = () => {
  // ১. টপ স্ট্যাটস ডাটা
  const stats = [
    { icon: <Layers className="w-5 h-5 text-purple-400" />, count: "12,400+", label: "Active Prompts" },
    { icon: <Users className="w-5 h-5 text-cyan-400" />, count: "3,200+", label: "Creators" },
    { icon: <TrendingUp className="w-5 h-5 text-emerald-400" />, count: "890K+", label: "Copies Made" },
    { icon: <Star className="w-5 h-5 text-amber-400" fill="currentColor" />, count: "4.8★", label: "Avg Rating" }
  ];

  // ২. ক্যাটাগরি ডাটা (এখানে সরাসরি href প্রপার্টি যোগ করা হয়েছে)
  const categories = [
    { name: "Coding", count: "2,400 prompts", icon: <Code className="w-5 h-5 text-purple-400" />, href: "/all-prompts?category=coding" },
    { name: "Creative", count: "1,800 prompts", icon: <Palette className="w-5 h-5 text-pink-400" />, href: "/all-prompts?category=creative" },
    { name: "Writing", count: "3,100 prompts", icon: <BookOpen className="w-5 h-5 text-cyan-400" />, href: "/all-prompts?category=writing" },
    { name: "Research", count: "980 prompts", icon: <Brain className="w-5 h-5 text-emerald-400" />, href: "/all-prompts?category=research" },
    { name: "Marketing", count: "1,600 prompts", icon: <TrendingUp className="w-5 h-5 text-amber-400" />, href: "/all-prompts?category=marketing" },
    { name: "Image Gen", count: "2,200 prompts", icon: <Sparkles className="w-5 h-5 text-violet-400" />, href: "/all-prompts?category=image-gen" }
  ];

  // 🔮 অ্যানিমেশন ভ্যারিয়েন্টস (Stagger Effect)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  return (
    <div className="w-full bg-[#030014] pt-1 pb-16 px-6 flex flex-col items-center">
      
      {/* 📊 ১. স্ট্যাটস কাউন্টার সেকশন */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto mb-10"
      >
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="flex flex-col items-center justify-center p-5 bg-[#090616]/40 border border-white/10 rounded-2xl backdrop-blur-md shadow-xl"
          >
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 mb-3">
              {stat.icon}
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">{stat.count}</span>
            <span className="text-xs text-gray-500 mt-1">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* 📁 ২. ক্যাটাগরি ব্রাউজ সেকশন হেডিং */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold text-white tracking-tight">Browse by Category</h2>
        <p className="text-gray-500 text-sm mt-2 font-light">Find the perfect prompt for every use case</p>
      </motion.div>

      {/* ৩. ক্যাটাগরি গ্রিড */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-7xl mx-auto"
      >
        {categories.map((cat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            whileTap={{ scale: 0.98 }}
            
            // 🎯 সরাসরি অবজেক্ট থেকে href নিয়ে রিডাইরেক্ট করা হচ্ছে
            onClick={() => {
              window.location.href = cat.href;
            }}
            
            className="group flex flex-col items-center justify-center p-6 bg-[#090611]/30 border border-white/20 rounded-2xl hover:border-purple-500/30 hover:bg-purple-950/10 transition-all duration-300 cursor-pointer shadow-lg backdrop-blur-sm"
          >
            {/* আইকন বক্স */}
            <div className="p-3.5 bg-white/5 group-hover:bg-purple-500/10 rounded-2xl border border-white/5 group-hover:border-purple-500/20 transition-all mb-4">
              {cat.icon}
            </div>
            
            {/* ক্যাটাগরি নাম */}
            <span className="text-sm font-semibold text-white/90 group-hover:text-purple-400 transition-colors">
              {cat.name}
            </span>
            
            {/* প্রম্পট কাউন্ট */}
            <span className="text-[11px] text-gray-500 mt-1.5 font-light">
              {cat.count}
            </span>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
};

export default StatsAndCategories;