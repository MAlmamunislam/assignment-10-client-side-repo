'use client';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const AdminDashboard = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user || null;

  useEffect(() => {
    // লোডিং শেষ হওয়া পর্যন্ত অপেক্ষা করবে
    if (isPending) return;

    // যদি লগইন করাই না থাকে
    if (!user) {
      router.replace('/signin');
      return;
    }

    // যদি সে অ্যাডমিন না হয়, তবে রোল অনুযায়ী রিডাইরেক্ট করবে
    if (user.role !== 'admin') {
      if (user.role === 'creator') {
        router.replace('/dashboard/creator-dashboard');
      } else {
        router.replace('/dashboard/user-dashboard');
      }
    }
  }, [user, isPending, router]);

  // লোড হওয়ার সময় খালি বা একটা সিম্পল লোডিং দেখাবে
  if (isPending || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center text-gray-400 font-mono text-sm">
        Checking admin permissions...
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>
      <p className="text-gray-400 mt-2">হ্যালো অ্যাডমিন, আপনার প্যানেল সুরক্ষিত।</p>
    </div>
  );
};

export default AdminDashboard;