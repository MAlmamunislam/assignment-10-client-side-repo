"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, CheckCircle2, X } from "lucide-react";

const PaymentPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center p-6">
      {/* ব্যাক বাটন */}
      <button
        onClick={() => router.back()}
        className="absolute top-8 left-8 text-gray-500 hover:text-white transition"
      >
        <X className="w-8 h-8" />
      </button>

      {/* মেইন কার্ড */}
      <div className="max-w-lg w-full bg-[#0c081e] rounded-[32px] p-8 border border-white/[0.06] shadow-2xl relative overflow-hidden">
        {/* টপ সেকশন */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Crown className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Upgrade to Premium
          </h1>
          <p className="text-gray-400">
            Unlock full potential for a one-time fee
          </p>
        </div>

        {/* প্রাইস সেকশন */}
        <div className="bg-white/[0.02] rounded-2xl p-6 mb-8 text-center border border-white/[0.03]">
          <span className="text-5xl font-bold text-white">$5</span>
          <span className="text-gray-500"> / lifetime access</span>
        </div>

        {/* বেনিফিট লিস্ট */}
        <div className="space-y-4 mb-8">
          {[
            "Full access to all private prompts",
            "Unlimited prompt generation",
            "Priority support & updates",
            "Advanced search & filtering",
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* পেমেন্ট বাটন (এখানেই পরে Stripe ইন্টিগ্রেশন হবে) */}
        <form action="/api/checkout_sessions" method="POST">
          <section>
            <button
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-amber-900/20"
              type="submit"
              role="link"
            >
              Checkout
            </button>
          </section>
        </form>

        <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-widest">
          Secure Payment via Stripe
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
