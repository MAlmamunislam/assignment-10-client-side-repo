import CreatorSidebar from "./CreatorSidebar";

export default function DashboardLayout({ children }) {
  return (
    // 'flex' ক্লাসটিই মূল, যা চিলড্রেনদের পাশাপাশি রাখে
    <div className="flex min-h-screen bg-[#030014]">
      
      {/* সাইডবার */}
      <div className="w-64 flex-shrink-0">
        <CreatorSidebar/>
      </div>

      {/* মেইন কন্টেন্ট */}
      <main className="flex-1 p-6">
        {children}
      </main>
      
    </div>
  );
}