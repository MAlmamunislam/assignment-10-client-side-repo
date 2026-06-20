"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Image as ImageIcon,
  Sparkles,
  Lock,
  Globe,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Crown,
} from "lucide-react";
import toast from "react-hot-toast";

const AddPrompt = () => {
  const router = useRouter();
  const { data: session, isPending: authPending } = authClient.useSession();
  const user = session?.user || null;
  const isPremium = user?.plan === "premium";

  const [loading, setLoading] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [isCheckingCount, setIsCheckingCount] = useState(true);
  const [difficulty, setDifficulty] = useState("Beginner");
  const [previewUrl, setPreviewUrl] = useState("");

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    if (authPending) return;
    if (!user || user.role !== "user") {
      router.replace("/login");
    }
  }, [user, authPending, router]);

  useEffect(() => {
    const checkUserPromptLimit = async () => {
      try {
        const currentUserId = user?.id || user?._id;
        const res = await fetch(`${SERVER_URL}/api/user/prompt-count?userId=${currentUserId}`);
        if (res.ok) {
          const data = await res.json();
          setPromptCount(data.count || 0);
        }
      } catch (error) {
        console.error("Error fetching prompt count:", error);
      } finally {
        setIsCheckingCount(false);
      }
    };
    if (user) checkUserPromptLimit();
  }, [user, SERVER_URL]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPremium && promptCount >= 3) {
      toast.error("Free users can add only 3 prompts! Please upgrade to premium.");
      return;
    }

    const formElement = e.target;
    const formDataInstance = new FormData(formElement);
    const rawUserData = Object.fromEntries(formDataInstance.entries());

    if (!rawUserData.title?.trim() || !rawUserData.description?.trim() || !rawUserData.content?.trim() || !rawUserData.category || !rawUserData.aiTool || !rawUserData.tags?.trim() || !rawUserData.visibility) {
      toast.error("Please fill in all the required fields!");
      return;
    }

    const imageFile = rawUserData.thumbnail;
    if (!imageFile || imageFile.size === 0 || !imageFile.name) {
      toast.error("Please upload a thumbnail image!");
      return;
    }

    setLoading(true);
    try {
      let thumbnailLink = "";
      const imgbbFormData = new FormData();
      imgbbFormData.append("image", imageFile);

      const imgbbRes = await fetch("https://api.imgbb.com/1/upload?key=dd7b4d125163f0ed5537537a55851bab", {
        method: "POST",
        body: imgbbFormData,
      });

      if (!imgbbRes.ok) throw new Error("ImgBB upload failed!");
      const imgbbData = await imgbbRes.json();
      thumbnailLink = imgbbData.data.url;

      const finalPromptData = {
        userId: user.id || user._id,
        userName: user.name || "Anonymous User",
        userImage: user.image || user.avatar || "",
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

      toast.success("Prompt Submitted for Review!");
      formElement.reset();
      setPreviewUrl("");
      setDifficulty("Beginner");
      router.push("/dashboard/user-dashboard/my-prompts");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (authPending || isCheckingCount) return <div className="min-h-[60vh] flex items-center justify-center text-purple-400 font-mono text-xs animate-pulse">LOADING...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Sparkles className="h-5 w-5 text-purple-500" /> Add New Prompt</h1>
      </div>

      {isPremium ? (
        <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md">
          <Crown className="h-6 w-6 text-purple-400 fill-purple-400" />
          <div>
            <h4 className="text-purple-300 text-sm font-semibold">Premium Account Active</h4>
            <p className="text-gray-400 text-xs">You have unlimited prompt submission access.</p>
          </div>
        </div>
      ) : promptCount >= 3 ? (
        <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-500 mt-0.5" />
            <div>
              <h4 className="text-amber-500 text-sm font-semibold">Prompt Limit Reached</h4>
              <p className="text-gray-400 text-xs mt-1">Free users can add only 3 prompts. Upgrade to Pro for unlimited access.</p>
            </div>
          </div>
          <button onClick={() => (router.push("/payment"), router.refresh())} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs rounded-xl">
            <Crown className="h-4 w-4" /> Upgrade to Pro
          </button>
        </div>
      ) : (
        <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl px-4 py-2 text-xs text-purple-300 font-mono w-fit">
          Slots Used: {promptCount} / 3
        </div>
      )}

      <form onSubmit={handleSubmit} className={`space-y-6 ${!isPremium && promptCount >= 3 ? "opacity-30 pointer-events-none" : ""}`}>
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