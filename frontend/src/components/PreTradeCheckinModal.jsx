import React, { useState } from "react";

export default function PreTradeCheckinModal({ isOpen, onClose, onSubmit }) {
  const [mood, setMood] = useState("🙂");
  const [conviction, setConviction] = useState(5);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ mood, conviction });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Pre-Trade Check-In</h2>

        {/* Mood Selector */}
        <div className="flex gap-3 mb-4 justify-center">
          {["😃", "😐", "😔", "😡"].map((emoji) => (
            <button
              key={emoji}
              onClick={() => setMood(emoji)}
              className={`text-3xl ${
                mood === emoji ? "scale-125 border-b-2 border-blue-500" : ""
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Conviction Slider */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Conviction Level: {conviction}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={conviction}
            onChange={(e) => setConviction(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
