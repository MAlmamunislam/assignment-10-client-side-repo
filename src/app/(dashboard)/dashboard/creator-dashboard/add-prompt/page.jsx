"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Crown,
} from "lucide-react";
import toast from "react-hot-toast";

const AddPrompt = () => {
  const router = useRouter();
  const { data: session, isPending: authPending } = authClient.useSession();
  const user = session?.user || null;

  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("Beginner");
  const [previewUrl, setPreviewUrl] = useState("");

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
  

  useEffect(() => {
    if (authPending) return;
    if (!user) {
      router.replace("/login");
    }
  }, [user, authPending, router]);

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        e.target.value = "";
        setPreviewUrl("");
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
  if (!authPending) {
    if (!user) {
      router.push("/login"); // লগইন না থাকলে
    } else if (user.role !== "creator") {
      toast.error("You are not authorized!");
      router.push("/"); // ক্রিয়েটর না হলে হোমপেজে পাঠিয়ে দেবে
    }
  }
}, [user, authPending, router]);

// ৪. রেন্ডারিংয়ের সময় এই চেকটি দেবেন
if (authPending) return <div>Loading...</div>;
if (!user || user.role !== "creator") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.target;
    const formDataInstance = new FormData(formElement);
    const rawUserData = Object.fromEntries(formDataInstance.entries());

    setLoading(true);
    try {
      const imgbbFormData = new FormData();
      imgbbFormData.append("image", rawUserData.thumbnail);

      const imgbbRes = await fetch("https://api.imgbb.com/1/upload?key=dd7b4d125163f0ed5537537a55851bab", {
        method: "POST",
        body: imgbbFormData,
      });

      if (!imgbbRes.ok) throw new Error("Thumbnail upload failed!");
      const imgbbData = await imgbbRes.json();
      const thumbnailLink = imgbbData.data.url;

      const finalPromptData = {
        userId: user.id || user._id,
        userName: user.name || "Creator",
        userImage: user.image || "",
        title: rawUserData.title,
        description: rawUserData.description,
        content: rawUserData.content,
        category: rawUserData.category,
        aiTool: rawUserData.aiTool,
        tags: rawUserData.tags,
        difficulty: difficulty,
        visibility: rawUserData.visibility,
        thumbnail: thumbnailLink,
        copyCount: 0,
        status: "pending",
      };

      const response = await fetch(`${SERVER_URL}/api/prompts/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPromptData),
      });

      if (!response.ok) throw new Error("Failed to submit prompt");

      toast.success("Prompt Posted Successfully!");
      formElement.reset();
      setPreviewUrl("");
      setDifficulty("Beginner");
      router.push("/dashboard/creator-dashboard/my-prompts");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (authPending) return <div className="min-h-[60vh] flex items-center justify-center text-purple-400 font-mono text-xs">LOADING...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" /> Add New Prompt
        </h1>
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md">
        <Crown className="h-6 w-6 text-purple-400 fill-purple-400" />
        <div>
          <h4 className="text-purple-300 text-sm font-semibold">Creator Mode Active</h4>
          <p className="text-gray-400 text-xs">You have unlimited prompt submission access.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#0c081e]/40 border border-white/[0.04] backdrop-blur-xl rounded-2xl p-6 lg:p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Prompt Title <span className="text-purple-500">*</span></label>
            <input type="text" name="title" required className="w-full bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Description <span className="text-purple-500">*</span></label>
            <textarea name="description" required rows={3} className="w-full bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Content <span className="text-purple-500">*</span></label>
            <textarea name="content" required rows={6} className="w-full bg-black/30 border border-white/[0.06] rounded-xl p-4 text-sm text-purple-200 font-mono focus:border-purple-500/50 outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Category <span className="text-purple-500">*</span></label>
              <select name="category" required className="w-full bg-[#0c081e] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer">
                <option value="">Select Category</option>
                <option value="Graphics">Graphics & Design</option>
                <option value="Coding">Coding & Dev</option>
                <option value="Copywriting">Copywriting</option>
                <option value="Marketing">SEO & Marketing</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">AI Tool <span className="text-purple-500">*</span></label>
              <select name="aiTool" required className="w-full bg-[#0c081e] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer">
                <option value="">Select AI Tool</option>
                <option value="Midjourney">Midjourney</option>
                <option value="ChatGPT">ChatGPT / GPT-4</option>
                <option value="Claude">Claude AI</option>
                <option value="Stable Diffusion">Stable Diffusion</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Tags <span className="text-purple-500">*</span></label>
            <input type="text" name="tags" required className="w-full bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Difficulty <span className="text-purple-500">*</span></label>
            <div className="grid grid-cols-3 gap-2 bg-black/20 p-1 border border-white/[0.04] rounded-xl">
              {["Beginner", "Intermediate", "Pro"].map((level) => (
                <button key={level} type="button" onClick={() => setDifficulty(level)} className={`py-2 text-xs font-medium rounded-lg ${difficulty === level ? "bg-purple-600/20 border border-purple-500/30 text-purple-400" : "text-gray-400"}`}>{level}</button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Thumbnail <span className="text-purple-500">*</span></label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="md:col-span-2 flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/[0.06] bg-black/20 rounded-xl cursor-pointer">
                <ImageIcon className="h-6 w-6 text-gray-500 mb-2" />
                <span className="text-xs text-gray-400">Click to upload</span>
                <input type="file" name="thumbnail" accept="image/*" onChange={handleImagePreview} className="hidden" />
              </label>
              <div className="h-32 border border-white/[0.06] rounded-xl bg-black/40 flex items-center justify-center relative">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover rounded-xl" /> : <span className="text-[10px] text-gray-600">No Preview</span>}
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Visibility <span className="text-purple-500">*</span></label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer"><input type="radio" name="visibility" value="Public" defaultChecked className="accent-purple-500" /> Public</label>
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer"><input type="radio" name="visibility" value="Private" className="accent-purple-500" /> Private</label>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-semibold flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <PlusCircle />} Submit Prompt
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPrompt;