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

  // লোডিং ও প্রম্পট কাউন্ট চেক স্টেট
  const [loading, setLoading] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [isCheckingCount, setIsCheckingCount] = useState(true);

  // কাস্টম বাটন স্টেট
  const [difficulty, setDifficulty] = useState("Beginner");
  const [previewUrl, setPreviewUrl] = useState("");

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // ১. সিকিউরিটি এবং রোল ভ্যালিডেশন ইফেক্ট
  useEffect(() => {
    if (authPending) return;
    if (!user || user.role !== "user") {
      router.replace("/login");
    }
  }, [user, authPending, router]);

  // ২. ফ্রি ইউজারের প্রম্পট কাউন্ট চেক
  useEffect(() => {
    const checkUserPromptLimit = async () => {
      try {
        const currentUserId = user?.id || user?._id;
        const res = await fetch(
          `${SERVER_URL}/api/user/prompt-count?userId=${currentUserId}`,
        );
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

  // ইমেজ প্রিভিউ হ্যান্ডলার
  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        e.target.value = ""; // রিসেট ইনপুট
        setPreviewUrl("");
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 🎯 ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (promptCount >= 3) {
      toast.error(
        "Free users can add only up to 3 prompts! Please upgrade to premium.",
      );
      return;
    }

    const formElement = e.target;
    const formDataInstance = new FormData(formElement);
    const rawUserData = Object.fromEntries(formDataInstance.entries());

    // 🔒 টেক্সট ও ড্রপডাউন ফিল্ডের জন্য ম্যানুয়াল ব্যাকআপ ভ্যালিডেশন
    if (
      !rawUserData.title?.trim() ||
      !rawUserData.description?.trim() ||
      !rawUserData.content?.trim() ||
      !rawUserData.category ||
      !rawUserData.aiTool ||
      !rawUserData.tags?.trim() ||
      !difficulty ||
      !rawUserData.visibility
    ) {
      toast.error("Please fill in all the required fields!");
      return;
    }

    // 📸 ইমেজ সিলেক্ট করা হয়েছে কিনা তা স্ট্রিল্টলি চেক করা (Fixes the blank file issue)
    const imageFile = rawUserData.thumbnail;
    if (!imageFile || imageFile.size === 0 || !imageFile.name) {
      toast.error("Please upload a thumbnail image!");
      return;
    }

    setLoading(true);

    try {
      // ১. 📸 ImgBB-তে ইমেজ আপলোড প্রসেস
      let thumbnailLink = "";
      const imgbbFormData = new FormData();
      imgbbFormData.append("image", imageFile);

      const imgbbRes = await fetch(
        "https://api.imgbb.com/1/upload?key=dd7b4d125163f0ed5537537a55851bab",
        {
          method: "POST",
          body: imgbbFormData,
        },
      );

      if (!imgbbRes.ok) throw new Error("ImgBB upload failed!");

      const imgbbData = await imgbbRes.json();
      thumbnailLink = imgbbData.data.url;

// final data 
  const finalPromptData = {
  userId: user.id || user._id,
  userName: user.name || "Anonymous User",       // 👈 ইউজারের নাম যোগ করা হলো
  userImage: user.image || user.avatar || "",    // 👈 ইউজারের প্রোফাইল পিকচার যোগ করা হলো
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

      console.log("🚀 Submitting Final Prompt Data to Database:", finalPromptData);

      // 🎯 ব্যাকএন্ড এপিআই-তে ডেটা পাঠানো
      const response = await fetch(`${SERVER_URL}/api/prompts/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPromptData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit prompt");
      }

      toast.custom((t) => (
        <div className="bg-[#0c081e] border border-purple-500/30 p-4 rounded-xl text-white flex items-center gap-3 shadow-2xl">
          <CheckCircle2 className="text-purple-400 h-5 w-5" />
          <div>
            <p className="font-semibold text-sm">Prompt Submitted for Review!</p>
            <p className="text-xs text-gray-400 mt-0.5">An admin will verify it shortly.</p>
          </div>
        </div>
      ));

      formElement.reset();
      setPreviewUrl("");
      setDifficulty("Beginner");

      router.push("/dashboard/user-dashboard/my-prompts");
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authPending || isCheckingCount) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-purple-400 font-mono text-xs tracking-widest animate-pulse">
        LOADING COMPONENT...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* হেডার পার্ট */}
      <div>
        <h1 className="text-2xl font-bold tracking-wide text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" /> Add New Prompt
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Share your masterpiece with the world. Submitted prompts go to review panel.
        </p>
      </div>

      {/* ⚠️ ফ্রি ইউজার লিমিট ও আপগ্রেড বাটন */}
      {promptCount >= 3 ? (
        <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-amber-500 text-sm font-semibold">Prompt Limit Reached</h4>
              <p className="text-gray-400 text-xs mt-1 max-w-xl">
                Free tier users can add only{" "}
                <span className="text-amber-400 font-bold">3 prompts</span>. You have already used all your slots. Please upgrade your plan to enjoy unlimited submissions.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/pricing")}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-400/30 transition-all duration-300 cursor-pointer flex-shrink-0"
          >
            <Crown className="h-4 w-4 text-black fill-black" />
            Upgrade to Pro
          </button>
        </div>
      ) : (
        <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl px-4 py-2 text-xs text-purple-300 font-mono w-fit">
          Slots Used: <span className="font-bold text-white">{promptCount}</span> / 3
        </div>
      )}

      {/* 📝 মেইন প্রম্পট ফর্ম */}
      <form
        onSubmit={handleSubmit}
        className={`space-y-6 ${promptCount >= 3 ? "opacity-30 pointer-events-none select-none" : ""}`}
      >
        <div className="bg-[#0c081e]/40 border border-white/[0.04] backdrop-blur-xl rounded-2xl p-6 lg:p-8 space-y-5">
          {/* প্রম্পট টাইটেল */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wide text-gray-300">
              Prompt Title <span className="text-purple-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g., Ultra-Realistic Cyberpunk Character Generator"
              className="w-full bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* প্রম্পট ডেসক্রিপশন */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wide text-gray-300">
              Prompt Description <span className="text-purple-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Briefly explain what this prompt does and its use case..."
              className="w-full bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            />
          </div>

          {/* প্রম্পট কন্টেন্ট */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wide text-gray-300">
              Prompt Content <span className="text-purple-500">*</span>
            </label>
            <textarea
              name="content"
              required
              rows={6}
              placeholder="Paste your exact working prompt here. Use brackets [like this] for dynamic variables..."
              className="w-full bg-black/30 border border-white/[0.06] rounded-xl p-4 text-sm text-purple-200 font-mono focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* ক্যাটাগরি ও এআই টুল গ্রিড */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide text-gray-300">
                Category <span className="text-purple-500">*</span>
              </label>
              <select
                name="category"
                required
                className="w-full bg-[#0c081e] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
              >
                <option value="">Select Category</option>
                <option value="Graphics">Graphics & Design</option>
                <option value="Coding">Coding & Dev</option>
                <option value="Copywriting">Copywriting</option>
                <option value="Marketing">SEO & Marketing</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide text-gray-300">
                AI Tool <span className="text-purple-500">*</span>
              </label>
              <select
                name="aiTool"
                required
                className="w-full bg-[#0c081e] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
              >
                <option value="">Select AI Tool</option>
                <option value="Midjourney">Midjourney</option>
                <option value="ChatGPT">ChatGPT / GPT-4</option>
                <option value="Claude">Claude AI</option>
                <option value="Stable Diffusion">Stable Diffusion</option>
              </select>
            </div>
          </div>

          {/* ট্যাগ ও ডিফিকাল্টি লেভেল */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide text-gray-300">
                Tags <span className="text-purple-500">*</span>
              </label>
              <input
                type="text"
                name="tags"
                required
                placeholder="cyberpunk, realistic, 8k (comma separated)"
                className="w-full bg-black/30 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wide text-gray-300">
                Difficulty Level <span className="text-purple-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 bg-black/20 p-1 border border-white/[0.04] rounded-xl">
                {["Beginner", "Intermediate", "Pro"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-2 text-xs font-medium rounded-lg transition-all ${
                      difficulty === level
                        ? "bg-purple-600/20 border border-purple-500/30 text-purple-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* থাম্বনেইল ইমেজ আপলোডার */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wide text-gray-300">
              Thumbnail Image <span className="text-purple-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/[0.06] hover:border-purple-500/30 bg-black/20 rounded-xl cursor-pointer transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <ImageIcon className="h-6 w-6 text-gray-500 group-hover:text-purple-400 transition-colors mb-2" />
                    <p className="text-xs text-gray-400 font-medium">Click to upload thumbnail</p>
                    <p className="text-[10px] text-gray-600 mt-1">PNG, JPG or WEBP (Max 2MB)</p>
                  </div>
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleImagePreview}
                    className="hidden" // 👈 হিডেন থাকার কারণে ব্রাউজার পপআপ দেখাত না
                  />
                </label>
              </div>

              {/* ইমেজ প্রিভিউ উইন্ডো */}
              <div className="h-32 border border-white/[0.06] rounded-xl overflow-hidden bg-black/40 flex items-center justify-center relative group">
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl("");
                        // ডোম থেকে ফাইল ইনপুট রিসেট করা
                        const input = document.querySelector('input[name="thumbnail"]');
                        if (input) input.value = "";
                      }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-red-400 font-semibold transition-opacity"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] text-gray-600 uppercase font-mono tracking-wider">No Preview</span>
                )}
              </div>
            </div>
          </div>

          {/* ভিজিবিলিটি (Public / Private) */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold tracking-wide text-gray-300">
              Visibility <span className="text-purple-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-400 hover:text-white select-none">
                <input
                  type="radio"
                  name="visibility"
                  value="Public"
                  defaultChecked
                  className="accent-purple-500 w-4 h-4"
                />
                <Globe className="h-4 w-4 text-gray-500" /> Public (Marketplace)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-400 hover:text-white select-none">
                <input
                  type="radio"
                  name="visibility"
                  value="Private"
                  className="accent-purple-500 w-4 h-4"
                />
                <Lock className="h-4 w-4 text-gray-500" /> Private (Only Me)
              </label>
            </div>
          </div>
        </div>

        {/* সাবমিট বাটন */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold tracking-wide rounded-xl shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" /> Submit Prompt
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPrompt;