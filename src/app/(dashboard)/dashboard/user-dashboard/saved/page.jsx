"use client";
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { FileText, Trash2, ArrowRight } from 'lucide-react'; // আইকনগুলো ইমপোর্ট করলাম

const SavedPrompts = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookmarks/my-bookmarks?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => setBookmarks(data));
    }
  }, [session]);

  const removeBookmark = async (promptId) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookmarks`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId, userId: session.user.id })
    });
    
    if ((await res.json()).success) {
      setBookmarks(bookmarks.filter(b => b.promptId !== promptId));
    }
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#030014]">
      <h1 className="text-2xl font-bold mb-6 tracking-wide">Saved Prompts</h1>
      
      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
          <FileText className="w-12 h-12 mb-2 opacity-20" />
          <p>No saved prompts found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookmarks.map((item) => (
            <div key={item._id} className="bg-[#0c081e]/50 p-5 rounded-2xl border border-white/[0.04] flex justify-between items-center gap-4 hover:border-purple-500/20 transition-all">
              <div className="flex items-center gap-4">
                {/* আইকন বক্স */}
                <div className="w-14 h-14 rounded-xl bg-[#1a162e] flex items-center justify-center border border-white/[0.05]">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                
                {/* টাইটেল এবং ডেট */}
                <div>
                  <h2 className="font-bold text-lg text-white">{item.promptDetails?.title || "Untitled Prompt"}</h2>
                  <p className="text-[11px] text-gray-500 uppercase font-mono">
                    Saved on: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* অ্যাকশন বাটন */}
              <div className="flex gap-3">
                <button 
                  onClick={() => removeBookmark(item.promptId)} 
                  className="p-2 text-gray-400 hover:text-red-400 transition"
                  title="Remove Bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => router.push(`/all-prompts/${item.promptId}`)} 
                  className="flex items-center gap-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 px-4 py-2 rounded-lg text-xs font-semibold transition"
                >
                  View Details <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPrompts;