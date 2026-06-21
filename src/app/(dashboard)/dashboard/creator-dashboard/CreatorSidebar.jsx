"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusSquare, 
  FolderKanban, 
  Menu, 
  X,
  LogOut
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const CreatorSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // BetterAuth থেকে ইউজারের সেশন ও ডাটা নেওয়া
  const { data: session } = authClient.useSession();
  const user = session?.user || null;

  // ক্রিয়েটর ড্যাশবোর্ডের মেনু আইটেমসমূহ
  const menuItems = [
    { name: "Overview", href: "/dashboard/creator-dashboard", icon: LayoutDashboard },
    { name: "Add Prompt", href: "/dashboard/creator-dashboard/add-prompt", icon: PlusSquare },
    { name: "My Prompts", href: "/dashboard/creator-dashboard/my-prompts", icon: FolderKanban },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully!");
    window.location.href = "/login";
  };

  return (
    <>
      {/* 📱 মোবাইল স্ক্রিন হেডার (ইউজার ইনফো ও হ্যামবার্গার) */}
      <div className="lg:hidden w-full bg-[#090514]/90 border-b border-white/[0.06] backdrop-blur-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img 
            src={user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"} 
            alt="profile" 
            className="w-9 h-9 rounded-full object-cover border border-purple-500/30"
          />
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wide">{user?.name || "demo"}</h4>
            <span className="text-[9px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded-md font-mono border border-purple-500/20 lowercase">
              {user?.role || "creator"}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-purple-400 transition-colors p-1"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* 💻 মেইন রেসপনসিভ সাইডবার */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#090514]/95 border-r border-white/[0.06] backdrop-blur-xl p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="space-y-7">
          
          {/* 👤 টপ প্রোফাইল সেকশন */}
          <div className="flex items-center gap-3 px-2 py-1 mt-2">
            <div className="relative">
              <img 
                src={user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"} 
                alt="profile" 
                className="w-11 h-11 rounded-full object-cover border border-purple-500/20 bg-gray-800"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#090514] rounded-full"></span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-white text-sm font-bold tracking-wide max-w-[140px] truncate">
                {user?.name || "demo"}
              </h3>
              <div>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md font-mono border border-purple-500/20 font-medium lowercase">
                  {user?.role || "creator"}
                </span>
              </div>
            </div>
          </div>

          {/* নেভিগেশন লিংকসমূহ */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 group relative
                    ${isActive 
                      ? "bg-gradient-to-r from-purple-600/15 to-indigo-600/5 border border-purple-500/20 text-purple-400" 
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.02] border border-transparent"}
                  `}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-purple-400" : "text-gray-400 group-hover:text-purple-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 👑 নিচের সেকশন: সাইন আউট */}
        <div className="space-y-3 pt-4 border-t border-white/[0.06] mb-2">
          {/* Sign Out বাটন */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium bg-amber-100 text-black hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all duration-300 cursor-pointer group"
          >
            <LogOut className="h-4 w-4 text-gray-500 group-hover:text-red-400 transition-transform duration-300 group-hover:translate-x-0.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* মোবাইল ড্রয়ার ব্লার ওভারলে */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        ></div>
      )}
    </>
  );
};

export default CreatorSidebar;