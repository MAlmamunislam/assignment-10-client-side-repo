"use client";
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, Zap, Crown, X, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const user = session?.user;
  
  // ইউজার প্ল্যান চেক করছি (subscription বা plan যাই হোক, কন্ডিশন মিলিয়ে নিও)
  const isPremium = user?.subscription === 'premium' || user?.plan === 'premium';
  
  const [showFullImage, setShowFullImage] = useState(false);

  if (!user) return <div className="text-white p-8">Loading profile...</div>;

  return (
    <div className="p-8 text-white min-h-screen bg-[#030014] max-w-4xl mx-auto">
      
      {/* ইমেজ প্রিভিউ মোডাল */}
      {showFullImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowFullImage(false)}>
          <div className="relative max-w-lg w-full">
            <button onClick={() => setShowFullImage(false)} className="absolute -top-10 right-0 text-white"><X /></button>
            <img src={user.image} className="w-full h-auto rounded-[32px] border-2 border-white/10 shadow-2xl" />
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-8">My Profile</h1>

      <div className="bg-[#0c081e] p-8 rounded-3xl border border-white/[0.05] flex flex-col md:flex-row gap-8 items-center">
        
        {/* প্রোফাইল ইমেজ */}
        <div 
          className="w-32 h-32 rounded-full overflow-hidden bg-purple-900/30 border-4 border-purple-500/20 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setShowFullImage(true)}
        >
          {user.image ? (
            <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-full h-full p-4 text-purple-400" />
          )}
        </div>

        {/* ইউজার ইনফরমেশন */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <h2 className="text-3xl font-bold">{user.name}</h2>
            <p className="text-gray-400 flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4" /> {user.email}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.02]">
              <p className="text-[10px] uppercase text-gray-500">Role</p>
              <p className="font-semibold flex items-center gap-2"><Shield className="w-4 h-4 text-cyan-400" /> {user.role || 'User'}</p>
            </div>
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.02]">
              <p className="text-[10px] uppercase text-gray-500">Subscription</p>
              <p className="font-semibold flex items-center gap-2">
                {isPremium ? <Crown className="w-4 h-4 text-amber-400" /> : <Zap className="w-4 h-4 text-gray-400" />}
                {isPremium ? 'Premium' : 'Free'}
              </p>
            </div>
          </div>

          {/* প্রিমিয়াম ইউজার হলে স্পেশাল কার্ড, আর ফ্রি হলে আপগ্রেড বাটন */}
          {isPremium ? (
            <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="text-amber-400 w-6 h-6" />
              <div>
                <h4 className="text-amber-400 text-sm font-bold">Premium Member</h4>
                <p className="text-gray-400 text-xs">You have full access to all features.</p>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <button 
                onClick={() => router.push('/payment')}
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-900/20"
              >
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;