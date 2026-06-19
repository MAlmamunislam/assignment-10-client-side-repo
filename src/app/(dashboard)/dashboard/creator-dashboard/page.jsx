'use client';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const CreatorDashboard = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user || null;

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace('/signin');
      return;
    }

    // যদি সে ক্রিয়েটর না হয়
    if (user.role !== 'creator') {
      if (user.role === 'admin') {
        router.replace('/dashboard/admin-dashboard');
      } else {
        router.replace('/dashboard/user-dashboard');
      }
    }
  }, [user, isPending, router]);

  if (isPending || !user || user.role !== 'creator') {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center text-gray-400 font-mono text-sm">
        Checking creator permissions...
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold">Welcome to Creator Dashboard</h1>
      <p className="text-gray-400 mt-2">হ্যালো ক্রিয়েটর, আপনার প্যানেল সুরক্ষিত।</p>
    </div>
  );
};

export default CreatorDashboard; 