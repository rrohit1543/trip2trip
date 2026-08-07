'use client';

import React, { useState } from 'react';
import { ChatMessage, User } from '../../types';
import { X, Send, MessageSquare, Bus, ShieldCheck } from 'lucide-react';

interface ChatWidgetProps {
  tripId: string | null;
  currentUser: User;
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
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">Live Operator Chat</h4>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Operator & Driver Online</span>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-950/40">
        {tripMessages.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-10">No messages yet. Send a message to chat with the operator!</p>
        ) : (
          tripMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-slate-400 font-bold mb-0.5">{msg.senderName} ({msg.senderRole})</span>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                    isMe
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold rounded-br-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask operator about pickup, seats, meal stop..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
        />
        <button
          type="submit"
          className="p-2.5 bg-emerald-500 text-slate-950 rounded-xl font-bold hover:bg-emerald-400 transition shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
