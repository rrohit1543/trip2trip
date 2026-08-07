'use client';

import React, { useState } from 'react';
import { Review } from '../../types';
import { X, Star, Upload, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  tripId: string | null;
  operatorId: string | null;
  customerId: string;
  customerName: string;
  onClose: () => void;
  onSubmitReview: (reviewData: Omit<Review, 'id' | 'createdAt'>) => void;
}

export default function ReviewModal({
  tripId,
  operatorId,
  customerId,
  customerName,
  onClose,
  onSubmitReview,
}: ReviewModalProps) {
  const [operatorRating, setOperatorRating] = useState(5);
  const [driverRating, setDriverRating] = useState(5);
  const [guideRating, setGuideRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!tripId || !operatorId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview({
      tripId,
      operatorId,
      customerId,
      customerName,
      operatorRating,
      driverRating,
      guideRating,
      comment: comment || 'Awesome group trip experience with live tracking!',
      photos: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'],
    });
    onClose();
    alert('Thank you for rating your trip experience! Your review is now published.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-black text-white">Rate Your Trip Experience</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-950 border border-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Operator Rating */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-bold">Tour Operator Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  onClick={() => setOperatorRating(s)}
                  className={`w-6 h-6 cursor-pointer transition ${
                    s <= operatorRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Driver Rating */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-bold">Bus Driver Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  onClick={() => setDriverRating(s)}
                  className={`w-6 h-6 cursor-pointer transition ${
                    s <= driverRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Tour Guide Rating */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-bold">Tour Guide Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  onClick={() => setGuideRating(s)}
                  className={`w-6 h-6 cursor-pointer transition ${
                    s <= guideRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-bold">Write Review & Feedback</label>
            <textarea
              rows={3}
              placeholder="Tell others about the live tracking, bus comfort, and tour guide..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25 hover:scale-[1.02] transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
