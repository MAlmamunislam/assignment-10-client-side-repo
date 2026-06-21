"use client";
import React, { useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  FaBookmark,
  FaRegBookmark,
  FaFlag,
  FaCopy,
  FaLock,
  FaStar,
} from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

const PromptDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);

  // for redirect user to login page
  const pathname = usePathname();
  
  
  // Review States
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const userData = authClient.useSession();
  const user = userData?.data?.user || userData?.data?.session?.user || null;
  const API = process.env.NEXT_PUBLIC_SERVER_URL;
// callback url 
const isLoadingSession = userData?.isPending;

useEffect(() => {
  if (!isLoadingSession && !user) {
    // বর্তমান ইউআরএলটি এনকোড করে পাঠাচ্ছি যাতে রিডাইরেক্ট করতে সুবিধা হয়
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
  }
}, [isLoadingSession, user, pathname, router]);






  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await axios.get(`${API}/api/prompts/${id}`);
        setPrompt(res.data);
        setReviews(res.data.reviews || []);
      } catch (err) {
        toast.error("Failed to load prompt");
      } finally {
        setLoading(false);
      }
    };
    fetchPrompt();
  }, [id]);

  
const isLocked =
  user?.role === 'user' &&
  prompt?.visibility?.toLowerCase() === 'private' &&
  user?.plan !== 'premium';
  const handleCopy = async () => {
    if (isLocked) return;
    navigator.clipboard.writeText(prompt.content);
    try {
      const res = await axios.patch(`${API}/api/prompts/copy/${id}`);
      toast.success("Copied!");
      setPrompt((prev) => ({ ...prev, copyCount: res.data.copyCount || prev.copyCount + 1 }));
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleBookmark = async () => {
    try {
      if (!isBookmarked) {
        await axios.post(`${API}/api/bookmarks`, { promptId: id, userId: user.id, userEmail: user.email });
        setIsBookmarked(true);
        toast.success("Bookmarked!");
      } else {
        await axios.delete(`${API}/api/bookmarks`, { data: { promptId: id, userId: user.id } });
        setIsBookmarked(false);
        toast.success("Removed bookmark");
      }
    } catch {
      toast.error("Bookmark failed");
    }
  };

  const handleReport = async () => {
    try {
      await axios.post(`${API}/api/reports`, { promptId: id, userId: user.id, userName: user.name, reason: reportReason, description: reportDesc });
      toast.success("Report submitted");
      setShowReportModal(false);
    } catch {
      toast.error("Report failed");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to review");
    
    try {
      const res = await axios.post(`${API}/api/prompts/${id}/review`, { 
          name: user.name, 
          image: user.image || "/default-avatar.png", 
          email: user.email, 
          rating, 
          comment 
      });
      
      setReviews([{ 
          name: user.name, 
          image: user.image || "/default-avatar.png", 
          rating, 
          comment, 
          date: new Date() 
      }, ...reviews]);
      
      setComment("");
      setRating(0);
      toast.success("Review added!");
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  if (loading) return <div className="text-white text-center p-20">Loading...</div>;
  if (!prompt) return <div className="text-white text-center p-20">Prompt not found</div>;

  return (
    <div className="min-h-screen bg-[#070514] text-white p-6 md:p-10">
      <button onClick={() => router.back()} className="text-gray-400 hover:text-white mb-5">← Back</button>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold">{prompt.title}</h1>
            <div className="flex gap-2">
              <button onClick={handleBookmark}>{isBookmarked ? <FaBookmark /> : <FaRegBookmark />}</button>
              <button onClick={() => setShowReportModal(true)}><FaFlag /></button>
            </div>
          </div>
          <p className="text-gray-400 mt-2">{prompt.description}</p>

          <div className="mt-6 p-5 bg-[#0d0a21] rounded-lg relative">
            <div className="flex justify-between mb-3">
              <h2>Prompt</h2>
              <button onClick={handleCopy} disabled={isLocked} className="flex gap-2 items-center bg-blue-600 px-3 py-1 rounded">
                <FaCopy /> {isLocked ? "Locked" : "Copy"}
              </button>
            </div>
            <pre className={`whitespace-pre-wrap ${isLocked ? "blur-sm" : ""}`}>{prompt.content}</pre>
            {isLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                <FaLock className="text-3xl text-yellow-400" />
                <p className="mt-2">Premium Prompt</p>
                <button onClick={() => router.push("/payment")} className="mt-3 bg-yellow-500 px-4 py-2 text-black rounded">Subscribe</button>
              </div>
            )}
          </div>

          {!isLocked && (
            <div className="mt-10 bg-[#0d0a21] p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-6">Reviews & Comments</h2>
              <form onSubmit={handleReviewSubmit} className="mb-8 bg-[#161330] p-4 rounded-lg">
                <div required className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar  key={star} className={`cursor-pointer ${rating >= star ? "text-yellow-400" : "text-gray-600"}`} onClick={() => setRating(star)} />
                  ))}
                </div>
                <textarea required className="w-full bg-[#070514] p-3 rounded text-white" placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
                <button type="submit" className="mt-3 bg-blue-600 px-4 py-2 rounded">Submit Review</button>
              </form>

              <div className="space-y-4">
                {reviews.map((rev, index) => (
                  <div key={index} className="flex gap-4 border-b border-gray-800 pb-4 mb-4">
                    <img src={rev.image || "/default-avatar.png"} alt={rev.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold">{rev.name}</h4>
                        <div className="flex text-yellow-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < rev.rating ? "text-yellow-400" : "text-gray-600"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{rev.comment}</p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {rev.date ? new Date(rev.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Just now"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#0d0a21] p-6 rounded-lg space-y-6 self-start">
          <div>
            <p className="text-gray-400 text-sm mb-3">Created by</p>
            <div className="flex items-center gap-3">
              <img src={prompt.userImage || "/default-avatar.png"} alt={prompt.userName} className="w-12 h-12 rounded-full border border-gray-700" />
              <div>
                <h3 className="font-semibold">{prompt.userName}</h3>
                <p className="text-xs text-gray-500">{prompt.createdAt ? new Date(prompt.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}</p>
              </div>
            </div>
          </div>
          <hr className="border-gray-800" />
          <div className="space-y-4">
            <h2 className="font-bold">Prompt Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-500">AI Tool</p><p className="text-gray-200">{prompt.aiTool}</p></div>
              <div><p className="text-gray-500">Category</p><p className="text-gray-200">{prompt.category}</p></div>
              <div><p className="text-gray-500">Difficulty</p><p className="text-gray-200">{prompt.difficulty}</p></div>
              <div><p className="text-gray-500">Visibility</p><p className="text-gray-200 capitalize">{prompt.visibility}</p></div>
              <div className="col-span-2 mt-2 p-3 bg-[#161330] rounded-md flex justify-between items-center">
                <p className="text-gray-400 text-sm">Total Copies</p>
                <p className="text-blue-400 font-bold text-lg">{prompt.copyCount || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d0a21] p-6 rounded-lg w-96 border border-gray-800">
            <h2 className="mb-3 text-lg font-bold">Report Prompt</h2>
            <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full p-2 bg-[#161330] text-white border border-gray-700 rounded mb-2">
              <option value="">Select reason</option>
              <option>Spam</option>
              <option>Inappropriate</option>
              <option>Copyright</option>
            </select>
            <textarea className="w-full p-2 bg-[#161330] text-white border border-gray-700 rounded h-24" placeholder="Description" value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowReportModal(false)} className="px-4 py-1 text-gray-400 hover:text-white">Close</button>
              <button onClick={handleReport} className="bg-red-500 px-4 py-1 rounded text-white font-semibold">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptDetailsPage;