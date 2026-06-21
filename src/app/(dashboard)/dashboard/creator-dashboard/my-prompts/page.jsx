'use client';
import { authClient } from "@/lib/auth-client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const MyPrompts = () => {
  const router = useRouter();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📝 আপডেট মডালের স্টেট
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // 🗑️ ডিলিট মডালের স্টেট
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promptIdToDelete, setPromptIdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // BetterAuth সেশন
  const { data: session, isPending: authPending } = authClient.useSession();
  const user = session?.user || null;
  const currentUserId = user?.id || user?._id;
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // 🛡️ রোল চেক এবং ডাটা ফেচিং লজিক
  useEffect(() => {
    if (!authPending) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "creator") {
        toast.error("You are not authorized to view this page!");
        router.push("/");
      } else if (currentUserId) {
        fetchMyPrompts();
      }
    }
  }, [user, authPending, router, currentUserId]);

  const fetchMyPrompts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_URL}/api/user/my-prompts?userId=${currentUserId}`);
      if (!response.ok) throw new Error("Failed to fetch prompts");
      const data = await response.json();
      setPrompts(data);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      toast.error("Could not load your prompts!");
    } finally {
      setLoading(false);
    }
  };

  // 📝 আপডেট মডাল ওপেন
  const openUpdateModal = (prompt) => {
    setSelectedPrompt(prompt);
    setEditTitle(prompt.title);
    setEditContent(prompt.content);
    setIsEditModalOpen(true);
  };

  // 🚀 প্রম্পট আপডেট সাবমিট
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Title and Content cannot be empty!");
      return;
    }

    try {
      setIsUpdating(true);
      const response = await fetch(`${SERVER_URL}/api/prompts/update/${selectedPrompt._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Prompt updated & sent for review!");
        setIsEditModalOpen(false);
        fetchMyPrompts();
      } else {
        toast.error("Failed to update prompt");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong while updating!");
    } finally {
      setIsUpdating(false);
    }
  };

  // 🗑️ ডিলিট মডাল ওপেন
  const openDeleteModal = (id) => {
    setPromptIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // 💥 ফাইনাল ডিলিট কনফার্মেশন অ্যাকশন
  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`${SERVER_URL}/api/prompts/delete/${promptIdToDelete}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Prompt deleted successfully!");
        setPrompts(prompts.filter(p => p._id !== promptIdToDelete));
        setIsDeleteModalOpen(false);
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong while deleting!");
    } finally {
      setIsDeleting(false);
    }
  };

  if (authPending || (user && user.role === "creator" && loading)) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <span className="ml-3 font-mono text-sm text-gray-400">Loading...</span>
      </div>
    );
  }

  // যদি ইউজার ক্রিয়েটর না হয়, কিছু দেখানোর দরকার নেই (রিডাইরেক্ট হয়ে যাবে)
  if (!user || user.role !== "creator") return null;

  return (
    <div className="p-6 max-w-7xl mx-auto text-white min-h-screen relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            My Prompts
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Manage your submitted prompts and track performance
          </p>
        </div>
        <div className="bg-purple-950/40 border border-purple-800/30 text-purple-300 px-3 py-1.5 rounded-full text-xs font-mono">
          Total Prompts: {prompts.length}
        </div>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-16 border border-gray-800 rounded-2xl bg-gray-900/30 backdrop-blur-md">
          <p className="text-gray-400 font-mono text-sm">No prompts found! Please create one first.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800/60 bg-gray-900/20 backdrop-blur-md shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800/80 bg-gray-950/40 text-xs font-mono text-gray-400 tracking-wider">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">AI Tool</th>
                <th className="p-4 font-semibold">Copies</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40 text-sm">
              {prompts.map((prompt) => (
                <tr key={prompt._id} className="hover:bg-gray-800/10 transition-colors duration-200">
                  <td className="p-4 max-w-xs">
                    <div className="flex items-center space-x-3">
                      {prompt.thumbnail && <img src={prompt.thumbnail} alt="thumb" className="w-8 h-8 rounded object-cover border border-gray-800" />}
                      <div className="truncate">
                        <p className="font-medium text-gray-200 truncate">{prompt.title}</p>
                        <p className="text-xs text-gray-500 font-mono truncate">{prompt.difficulty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300 font-medium">
                    <span className="bg-gray-800/40 px-2.5 py-1 rounded-md text-xs border border-gray-700/30">{prompt.category}</span>
                  </td>
                  <td className="p-4 text-gray-400 font-mono text-xs">{prompt.aiTool}</td>
                  <td className="p-4 text-gray-300 font-mono font-bold">{prompt.copyCount || 0}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono ${prompt.status === "approved" ? "bg-green-500/10 text-green-400" : prompt.status === "rejected" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {prompt.status || "pending"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button onClick={() => openUpdateModal(prompt)} className="px-3 py-1.5 text-xs bg-blue-600/10 hover:bg-blue-600 text-blue-400 rounded-md border border-blue-500/20">Update</button>
                      <button onClick={() => openDeleteModal(prompt._id)} className="px-3 py-1.5 text-xs bg-red-600/10 hover:bg-red-600 text-red-400 rounded-md border border-red-500/20">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

       {/* 🔮 ১. আধুনিক গ্লাস-মরফিজম আপডেট মডাল */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-950/80 border border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-gray-200">Edit Prompt</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Prompt Title</label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Prompt Content</label>
                <textarea 
                  rows="5"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-800">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-xs font-medium bg-gray-800 text-gray-300 rounded-lg cursor-pointer">Cancel</button>
                <button type="submit" disabled={isUpdating} className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer">{isUpdating ? "Updating..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🚨 ২. মডার্ন গ্লাস-মরফিজম ডিলিট কনফার্মেশন মডাল */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
          <div className="bg-gray-800 border-2 border-red-950/90 rounded-2xl max-w-sm w-full p-6 shadow-2xl backdrop-blur-xl text-center">
            {/* ডিলিট ওয়ার্নিং আইকন */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-950/50 border border-red-800/30 text-red-400 mb-4">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-200 mb-2">Delete Prompt?</h3>
            <p className="text-xs text-gray-400 font-mono mb-6">
              Are you sure you want to delete this prompt? This action cannot be undone.
            </p>

            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-medium bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg transition-colors cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPrompts;