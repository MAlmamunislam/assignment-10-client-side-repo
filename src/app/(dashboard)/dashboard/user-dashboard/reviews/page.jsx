"use client";
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Star, MessageSquare } from 'lucide-react';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      // সব পাবলিক প্রম্পট ফেচ করছি
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/prompts/public`)
        .then(res => res.json())
        .then(data => {
          // ইউজারের ইমেইল দিয়ে রিভিউ ফিল্টার করছি
          const myReviews = data.flatMap(prompt => 
            (prompt.reviews || [])
              .filter(r => r.email === session.user.email)
              .map(review => ({ ...review, promptTitle: prompt.title, promptId: prompt._id }))
          );
          setReviews(myReviews);
        });
    }
  }, [session]);

  return (
    <div className="p-8 text-white min-h-screen bg-[#030014]">
      <h1 className="text-2xl font-bold mb-6 tracking-wide">My Reviews</h1>
      
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
          <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
          <p>No reviews submitted yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-[#0c081e]/50 p-5 rounded-2xl border border-white/[0.04] flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg text-purple-400 cursor-pointer" onClick={() => router.push(`/all-prompts/${rev.promptId}`)}>
                    {rev.promptTitle}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-mono">Reviewed on: {new Date(rev.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md text-amber-500">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span className="text-xs font-bold">{rev.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-300 italic">"{rev.comment}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;