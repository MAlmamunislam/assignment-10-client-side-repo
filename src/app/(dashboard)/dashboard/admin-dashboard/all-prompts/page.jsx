"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2, Star, Loader2 } from "lucide-react";

const ManagePrompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [actionType, setActionType] = useState(""); // 'delete' or 'reject'
  const [feedback, setFeedback] = useState("");

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${SERVER_URL}/api/admin/prompts`)
      .then((res) => res.json())
      .then((data) => {
        setPrompts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, [SERVER_URL]);

  const handleAction = async (id, payload) => {
    await fetch(`${SERVER_URL}/api/admin/update-prompt/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setPrompts(prompts.map(p => p._id === id ? { ...p, ...payload } : p));
  };

  const handleDelete = async (id) => {
    await fetch(`${SERVER_URL}/api/admin/delete-prompt/${id}`, { method: 'DELETE' });
    setPrompts(prompts.filter(p => p._id !== id));
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500 h-10 w-10" /></div>;

  return (
    <div className="bg-[#090514]/80 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
      <h3 className="text-2xl font-bold text-white mb-6">Prompt Management</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-white/10">
              <th className="pb-4">Prompt Title</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {prompts.map((prompt) => (
              <tr key={prompt._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 font-medium">{prompt.title}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    prompt.status === 'approved' ? 'bg-green-500/20 text-green-400' : 
                    prompt.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {prompt.status || 'pending'}
                  </span>
                </td>
                <td className="py-4 flex items-center gap-3">
                  <button onClick={() => handleAction(prompt._id, { status: 'approved' })} className="text-green-400 hover:bg-green-400/10 p-2 rounded-lg transition-all"><CheckCircle size={20}/></button>
                  <button onClick={() => { setSelectedPrompt(prompt); setActionType('reject'); setIsModalOpen(true); }} className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all"><XCircle size={20}/></button>
                  <button onClick={() => handleAction(prompt._id, { isFeatured: !prompt.isFeatured })} className={`${prompt.isFeatured ? 'text-yellow-400' : 'text-gray-500'} hover:bg-yellow-400/10 p-2 rounded-lg transition-all`}><Star size={20}/></button>
                  <button onClick={() => { setSelectedPrompt(prompt); setActionType('delete'); setIsModalOpen(true); }} className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"><Trash2 size={20}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Modal */}
  {/* Custom Modal */}
{isModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
    {/* মডালের কন্টেইনারটি একটু উপরে ফিক্সড করার জন্য 'mt-[-100px]' ব্যবহার করতে পারো */}
    <div className="bg-[#1a1625] border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300">
      <h3 className="text-xl font-bold text-white mb-4">
        {actionType === 'delete' ? 'Confirm Deletion' : 'Rejection Reason'}
      </h3>
      
      {actionType === 'reject' && (
        <textarea 
          className="w-full bg-[#090514] border border-white/10 rounded-xl p-3 text-white mb-4 h-24" 
          placeholder="Why are you rejecting this?" 
          onChange={(e) => setFeedback(e.target.value)} 
        />
      )}

      <div className="flex gap-3 justify-end">
        <button 
          onClick={() => setIsModalOpen(false)} 
          className="px-4 py-2 text-gray-400 hover:text-white transition"
        >
          Cancel
        </button>
        <button 
          onClick={() => { 
            actionType === 'delete' ? handleDelete(selectedPrompt._id) : handleAction(selectedPrompt._id, { status: 'rejected', rejectionFeedback: feedback }); 
            setIsModalOpen(false); 
          }} 
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ManagePrompts;