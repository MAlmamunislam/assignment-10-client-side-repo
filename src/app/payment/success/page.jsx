"use client";

import { authClient } from "@/lib/auth-client";
import { CheckCircle, Loader2 } from "lucide-react"; // Loader2 ইমপোর্ট করেছি
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Success() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const user = session?.user;
  console.log(user);
  useEffect(() => {
    if (user) {
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/upgrade-to-premium`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email, // এখানে user.id এর বদলে user.email পাঠাও
          name: user.name,
          image: user.image,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setLoading(false);
          } else {
            setError(true);
          }
        })
        .catch((err) => {
          console.error("Upgrade error:", err);
          setError(true);
        });
    }
  }, [user]);
  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center p-6 text-white text-center">
      <div className="bg-[#0c081e] p-10 rounded-3xl border border-white/[0.05] max-w-md w-full shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-20 h-20 text-purple-500 animate-spin mb-6" />
            <h1 className="text-2xl font-bold">Activating Premium...</h1>
          </div>
        ) : (
          <>
            <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-2">
              {error ? "Update Failed" : "Payment Successful!"}
            </h1>

            <div className="text-gray-400 mb-8 space-y-2">
              <p>
                Hi, <strong>{user?.name || "User"}</strong>!
              </p>
              <p>
                {error
                  ? "Something went wrong while activating your plan. Please contact support."
                  : "Thank you for your purchase. Your premium access is now activated."}
              </p>
            </div>

            <button
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              className="block w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold transition"
            >
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
