// ইম্পোর্ট ঠিক করো (ফাইলটি যেখানে আছে সেই পাথ দাও)

import AdminSidebar from "./AdminSidebar";


export default function DashboardLayout({ children }) {
  return (
  <div className="min-h-screen bg-[#030014] text-white flex flex-col lg:flex-row overflow-hidden">
      
      {/* সাইডবার (AdminSidebar ব্যবহার করা ভালো) */}
      <div className="w-64 flex-shrink-0">
        <AdminSidebar/>
      </div>

      {/* মেইন কন্টেন্ট */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
      
    </div>
  );
}