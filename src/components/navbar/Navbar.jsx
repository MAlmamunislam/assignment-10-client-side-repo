'use client';

import { authClient } from '@/lib/auth-client';
import { Menu, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // 🎯 ১. এই হুকটি ইমপোর্ট করো
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // 💡 পরবর্তীতে এই স্টেটটি তোমার Auth Context থেকে আসবে
const userData = authClient.useSession();

const user =
  userData?.data?.user ||
  userData?.data?.session?.user ||
  null;


  

  // 🎯 ২. window.location.pathname বাদ দিয়ে usePathname() ব্যবহার করো
  const currentPath = usePathname();

  // লিংকগুলোর অ্যারে
  const links = [
    { label: "Home", path: "/" },
    { label: "All Prompts", path: "/all-prompts" },
    ...(user 
      ? [{ label: "Dashboard", path: "/dashboard" }] 
      : [
          { label: "Login", path: "/login" },
          { label: "Register", path: "/signup" }
        ]
    )
  ];
const router = useRouter();
//   handle signuout 
const handleSignOut =  async () => {
    await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push("/login"); // redirect to login page
    },
  },
});
}

  return (
    <nav className="sticky top-0 z-50 bg-[#090514]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* ১. লোগো এবং ওয়েবসাইটের নাম */}
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <div className="p-2 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span>Prompt<span className="text-[#a855f7]">Hub</span></span>
        </Link>

        {/* ২. ডেস্কটপ নেভিগেশন */}
        <div className="hidden md:flex items-center gap-1 bg-[#0d091f] p-1.5 rounded-2xl border border-white/5">
          {links.map((link, idx) => {
            const isActive = currentPath === link.path;
            return (
              <Link 
                key={idx}
                href={link.path} 
                className={`px-4 py-2 text-sm rounded-xl transition-all ${isActive ? 'bg-[#1e1b4b] text-[#a855f7] font-medium' : 'text-gray-400 hover:text-white'}`}
              >
                {link.label}
              </Link>
            );
          })}
          {user && (
            <button onClick={handleSignOut} className="px-4 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors">
              Logout
            </button>
          )}
        </div>

        {/* ৩. অ্যাকশন বাটন (ডেস্কটপ) */}
        <div className="hidden md:block">
          <Link href={user ? "/dashboard" : "/login"} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-95 text-sm">
            Get Started
          </Link>
        </div>

        {/* ৪. মোবাইল মেনু বাটন */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-400 hover:text-white transition-colors focus:outline-none">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ৫. মোবাইল ড্রপডাউন মেনু */}
      {isOpen && (
        <div className="md:hidden mt-4 p-4 bg-[#0d091f] border border-white/5 rounded-2xl flex flex-col gap-1">
          {links.map((link, idx) => {
            const isActive = currentPath === link.path;
            return (
              // 🎯 ৩. এখানে <a> ট্যাগ বদলে <Link> ট্যাগ ব্যবহার করা হয়েছে যেন SPA ফ্লেভার বজায় থাকে
              <Link 
                key={idx}
                href={link.path} 
                onClick={() => setIsOpen(false)} // মোবাইল মেনু অটো বন্ধ হওয়ার জন্য
                className={`px-4 py-2.5 text-base rounded-xl block transition-all ${isActive ? 'bg-[#1e1b4b] text-[#a855f7] font-medium' : 'text-gray-400 hover:text-white'}`}
              >
                {link.label}
              </Link>
            );
          })}
          {user && (
            <button onClick={handleSignOut} className="px-4 py-2.5 text-base text-left text-gray-400 hover:text-red-400 transition-colors w-full">
              Logout
            </button>
          )}
          <hr className="border-white/5 my-2" />
          <Link href={user ? "/dashboard" : "/login"} onClick={() => setIsOpen(false)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-center text-white font-medium rounded-xl text-sm block">
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;