'use client';

import React, { useState } from 'react';
import { ChatMessage, User } from '../../types';
import { X, Send, MessageSquare } from 'lucide-react';

interface ChatWidgetProps {
  tripId: string | null;
  currentUser: User | null;
  messages: ChatMessage[];
  onClose: () => void;
  onSendMessage: (tripId: string, text: string) => void;
}

export default function ChatWidget({ tripId, currentUser, messages, onClose, onSendMessage }: ChatWidgetProps) {
  const [text, setText] = useState('');

  if (!tripId) return null;

  const tripMessages = messages.filter((m) => m.tripId === tripId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(tripId, text);
    setText('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-black border-2 border-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in slide-in-from-bottom duration-300">
      <div className="p-4 bg-neutral-950 border-b border-neutral-900 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-600 flex items-center justify-center text-red-500">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">Live Operator Chat</h4>
            <div className="flex items-center gap-1 text-[10px] text-red-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>Operator & Driver Online</span>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-black border border-neutral-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-black">
        {tripMessages.length === 0 ? (
          <p className="text-xs text-neutral-500 text-center py-10">No messages yet. Send a message to chat with the operator!</p>
        ) : (
          tripMessages.map((msg) => {
            const isMe = currentUser && msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-neutral-400 font-bold mb-0.5">{msg.senderName} ({msg.senderRole})</span>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                    isMe
                      ? 'bg-red-600 text-white font-semibold rounded-br-none'
                      : 'bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-neutral-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend} className="p-3 bg-neutral-950 border-t border-neutral-900 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask operator about pickup, seats..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-red-600 placeholder-neutral-600"
        />
        <button
          type="submit"
          className="p-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
