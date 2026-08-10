'use client';

import React, { useState } from 'react';
import { Review } from '../../types';
import { X, Star } from 'lucide-react';

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
      photos: [],
    });
    onClose();
    alert('Thank you for rating your trip experience! Your review is now published.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-black border-2 border-neutral-900 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
          <h3 className="text-base font-black text-white">Rate Your Trip Experience</h3>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-neutral-950 border border-neutral-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-bold">Tour Operator Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  onClick={() => setOperatorRating(s)}
                  className={`w-6 h-6 cursor-pointer transition ${
                    s <= operatorRating ? 'fill-red-600 text-red-600' : 'text-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-bold">Bus Driver Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  onClick={() => setDriverRating(s)}
                  className={`w-6 h-6 cursor-pointer transition ${
                    s <= driverRating ? 'fill-red-600 text-red-600' : 'text-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-bold">Tour Guide Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  onClick={() => setGuideRating(s)}
                  className={`w-6 h-6 cursor-pointer transition ${
                    s <= guideRating ? 'fill-red-600 text-red-600' : 'text-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-bold">Write Review & Feedback</label>
            <textarea
              rows={3}
              placeholder="Tell others about the live tracking, bus comfort, and tour guide..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black shadow-lg shadow-red-600/30 transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
