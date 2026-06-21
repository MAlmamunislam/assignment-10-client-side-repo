"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, FileText, CreditCard, AlertTriangle, 
  Menu, X, LogOut 
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const { data: session } = authClient.useSession();
  const user = session?.user || null;

  const menuItems = [
    { name: "Analytics", href: "/dashboard/admin-dashboard", icon: LayoutDashboard },
    { name: "All Users", href: "/dashboard/admin-dashboard/all-users", icon: Users },
    { name: "All Prompts", href: "/dashboard/admin-dashboard/all-prompts", icon: FileText },
    { name: "All Payments", href: "/dashboard/admin-dashboard/all-payments", icon: CreditCard },
    { name: "Reported Prompts", href: "/dashboard/admin-dashboard/reported-prompts", icon: AlertTriangle },
  ];

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully!");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  return (
    <>
      {/* 📱 মোবাইল স্ক্রিন হেডার */}
      <div className="lg:hidden w-full bg-[#090514]/90 border-b border-white/[0.06] backdrop-blur-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img 
            src={user?.image || "https://ui-avatars.com/api/?name=Admin&background=random"} 
            alt="profile" 
            className="w-9 h-9 rounded-full object-cover border border-indigo-500/30"
          />
          <div>
            <h4 className="text-white text-sm font-semibold">{user?.name || "Admin"}</h4>
            <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-md font-mono border border-indigo-500/20 uppercase">Admin</span>
          </div>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-1">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* 💻 সাইডবার (Desktop & Mobile Drawer) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#090514]/95 border-r border-white/[0.06] backdrop-blur-xl p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="space-y-7">
          {/* 👤 প্রোফাইল সেকশন */}
          <div className="flex items-center gap-3 px-2 py-1 mt-2">
            <img 
              src={user?.image || "https://ui-avatars.com/api/?name=Admin&background=random"} 
              alt="profile" 
              className="w-11 h-11 rounded-full object-cover border border-indigo-500/20"
            />
            <div className="flex flex-col gap-0.5">
              <h3 className="text-white text-sm font-bold truncate">{user?.name || "Admin"}</h3>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md font-mono border border-indigo-500/20 uppercase w-fit">Admin Panel</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive ? "bg-gradient-to-r from-indigo-600/15 to-purple-600/5 border border-indigo-500/20 text-indigo-400" : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]"}`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-indigo-400" : "text-gray-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium bg-red-500/5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/10">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </aside>

      {/* 🌫️ ওভারলে */}
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"></div>}
    </>
  );
};

export default AdminSidebar;