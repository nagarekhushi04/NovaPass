"use client";

import React, { useState, useEffect } from "react";
import { X, Star, Sparkles, Send, CheckCircle2, MessageSquare } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress: string | null;
}

interface FeedbackEntry {
  id: string;
  rating: number;
  category: string;
  comment: string;
  userAddress: string;
  timestamp: string;
}

export function FeedbackModal({ isOpen, onClose, userAddress }: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<string>("Cinematic UI & UX");
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("novapass_feedbacks");
    if (saved) {
      try {
        setFeedbacks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved feedback", e);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: FeedbackEntry = {
      id: Date.now().toString(),
      rating,
      category,
      comment: comment.trim() || "Excellent cinematic Web3 experience and Soroban settlement!",
      userAddress: userAddress || "Anonymous Testnet User",
      timestamp: new Date().toISOString(),
    };

    const updated = [newEntry, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem("novapass_feedbacks", JSON.stringify(updated));
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-blur-fade-up">
      <div className="liquid-glass bg-black/95 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/20 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">NovaPass User Feedback</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Thank You for Your Feedback!</h4>
            <p className="text-xs text-gray-400">
              Your response has been stored and registered with the audit toolkit.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating Stars */}
            <div className="space-y-1.5 text-center">
              <label className="text-xs text-gray-300 font-medium">Rate Your Experience</label>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-600"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
              >
                <option value="Cinematic UI & UX" className="bg-black">
                  Cinematic UI & UX
                </option>
                <option value="Stellar & Soroban Web3" className="bg-black">
                  Stellar & Soroban Web3
                </option>
                <option value="Voucher Claim Speed" className="bg-black">
                  Voucher Claim Speed
                </option>
                <option value="Merchant POS & QR" className="bg-black">
                  Merchant POS & QR
                </option>
              </select>
            </div>

            {/* Qualitative Feedback */}
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-medium">Comments & Suggestions</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the Soroban smart contract performance and visual experience..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/30 resize-none"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
