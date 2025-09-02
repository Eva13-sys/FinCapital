import React, { useState, useEffect } from "react";
import PreTradeCheckinModal from "../../components/PreTradeCheckinModal";

export default function MentorPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const userId = "demoUser"; // Replace with logged-in user id later

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/mentor/history/${userId}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, []);

  const handleSendMessage = async (prompt) => {
    try {
      const res = await fetch("http://localhost:5000/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, user_id: userId }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handlePreTradeCheckin = async (prompt) => {
    try {
      const res = await fetch("http://localhost:5000/api/mentor/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, user_id: userId }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "user", content: `Pre-trade: ${prompt}` },
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      console.error("Error in PreTradeCheckin:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">AI Mentor</h1>

      <div className="border p-4 h-96 overflow-y-scroll bg-gray-50 rounded">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 my-1 rounded ${
              msg.role === "user"
                ? "bg-blue-100 text-blue-900 self-end"
                : "bg-green-100 text-green-900 self-start"
            }`}
          >
            <strong>{msg.role === "user" ? "You" : "Mentor"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => handleSendMessage("What’s your advice on today’s market?")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Ask AI
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Pre-Trade Check-in
        </button>
      </div>

      <PreTradeCheckinModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePreTradeCheckin}
      />
    </div>
  );
}
















// import React, { useState, useEffect, useRef } from "react";
// import PreTradeCheckinModal from "../../components/PreTradeCheckinModal";

// export default function MentorPage() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [tradeType, setTradeType] = useState(""); // Buy or Sell
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const chatEndRef = useRef(null);

//   // Auto-scroll
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Load history on page load
//   useEffect(() => {
//     fetch("http://localhost:5000/api/mentor/history")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success && data.history) {
//           setMessages(
//             data.history.map((msg) => ({
//               from: msg.role,
//               text: msg.content,
//               timestamp: new Date().toISOString(),
//             }))
//           );
//         }
//       })
//       .catch((err) => console.error("History fetch error:", err));
//   }, []);

//   // Open modal when Buy/Sell clicked
//   const handleTradeClick = (type) => {
//     setTradeType(type);
//     setIsModalOpen(true);
//   };

//   // Send message to Python AI microservice
//   const fetchAIResponse = async (prompt) => {
//     try {
//       const res = await fetch("http://localhost:8000/api/ai", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt, history: messages }),
//       });
//       const data = await res.json();
//       return data.reply || "⚠️ Mentor could not generate advice.";
//     } catch (err) {
//       console.error("AI microservice error:", err);
//       return "⚠️ Mentor failed to respond.";
//     }
//   };

//   // Handle Pre-trade modal submission
//   const handleCheckinSubmit = async ({ mood, conviction }) => {
//     setIsModalOpen(false);

//     // Add user input for pre-trade check-in
//     const userMessage = `${tradeType} | Mood: ${mood} | Conviction: ${conviction}/10`;
//     setMessages((prev) => [
//       ...prev,
//       { from: "user", text: userMessage, timestamp: new Date().toISOString() },
//     ]);

//     // Get AI advice
//     const advice = await fetchAIResponse(
//       `I am preparing for a ${tradeType} trade. My mood is "${mood}" and conviction is ${conviction}/10. Ask me a few thoughtful pre-trade check-in questions or give advice.`
//     );

//     setMessages((prev) => [
//       ...prev,
//       { from: "mentor", text: advice, timestamp: new Date().toISOString() },
//     ]);
//   };

//   // Handle free text chat
//   const handleSend = async () => {
//     if (!input.trim()) return;

//     // Add user message
//     setMessages((prev) => [
//       ...prev,
//       { from: "user", text: input, timestamp: new Date().toISOString() },
//     ]);

//     // Get AI response
//     const reply = await fetchAIResponse(input);

//     setMessages((prev) => [
//       ...prev,
//       { from: "mentor", text: reply, timestamp: new Date().toISOString() },
//     ]);

//     setInput("");
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">AI Mentor</h2>

//       {/* Trade buttons */}
//       <div className="flex gap-4 mb-4">
//         <button
//           onClick={() => handleTradeClick("Buy")}
//           className="px-4 py-2 bg-green-600 text-white rounded-lg"
//         >
//           Buy
//         </button>
//         <button
//           onClick={() => handleTradeClick("Sell")}
//           className="px-4 py-2 bg-red-600 text-white rounded-lg"
//         >
//           Sell
//         </button>
//       </div>

//       {/* Chat window */}
//       <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50 mb-4">
//         {messages.map((msg, idx) => {
//           const isTradeMessage = msg.text?.includes("Mood:") || false;
//           let isEmotional = false;
//           if (isTradeMessage) {
//             if (msg.text?.includes("😡") || msg.text?.includes("😔")) {
//               isEmotional = true;
//             }
//           }

//           return (
//             <div
//               key={idx}
//               className={`mb-2 flex ${
//                 msg.from === "mentor" ? "justify-start" : "justify-end"
//               }`}
//             >
//               <div
//                 className={`max-w-[70%] p-2 rounded-lg shadow ${
//                   msg.from === "mentor"
//                     ? "bg-blue-100 text-blue-800"
//                     : isEmotional
//                     ? "bg-red-200 text-red-800"
//                     : "bg-green-100 text-green-800"
//                 }`}
//               >
//                 <span className="font-semibold">
//                   {msg.from === "mentor" ? "Mentor: " : "You: "}
//                 </span>
//                 {msg.text || "(empty)"}
//                 <div className="text-xs text-gray-500 mt-1">
//                   {msg.timestamp
//                     ? new Date(msg.timestamp).toLocaleTimeString()
//                     : ""}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Free text input */}
//       <div className="flex gap-2 mb-6">
//         <input
//           type="text"
//           placeholder="Type your question..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           className="flex-1 border rounded px-3 py-2"
//         />
//         <button
//           onClick={handleSend}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Send
//         </button>
//       </div>

//       <PreTradeCheckinModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleCheckinSubmit}
//       />
//     </div>
//   );
// }
