"use client";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${SERVER_URL}/api/admin/payments`)
      .then((res) => res.json())
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, [SERVER_URL]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500 h-10 w-10" /></div>;

  return (
    <div className="bg-[#090514]/80 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
      <h3 className="text-2xl font-bold text-white mb-6">Payment History</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-white/10">
              <th className="pb-4">User</th>
              <th className="pb-4">Email</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 flex items-center gap-3">
                    <img 
                      src={payment.image || "/default-avatar.png"} 
                      alt={payment.name} 
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <span className="font-medium">{payment.name}</span>
                  </td>
                  <td className="py-4 text-gray-300">{payment.email}</td>
                  <td className="py-4 text-gray-300">
                    {new Date(payment.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                      Success
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">No payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePayments; 