// backend/routes/mentor.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// POST route to talk with Python AI service
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("http://localhost:5000/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    res.json({
      success: true,
      aiResponse: data.reply,
    });
  } catch (error) {
    console.error("Error in /mentor/chat:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to get AI response",
    });
  }
});

export default router;














// import express from "express";
// import fetch from "node-fetch";

// const router = express.Router();

// // Python AI service URL
// const PYTHON_AI_URL = "http://localhost:8000/api/ai"; // your Python AI microservice

// // Store chat history per user (in-memory for now, replace with DB later)
// let userHistories = {}; // { user_id: [ { role, content } ] }

// /**
//  * Call Python AI microservice
//  */
// async function queryPythonAI(prompt, user_id) {
//   const response = await fetch(PYTHON_AI_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       prompt,
//       history: userHistories[user_id] || [], // send conversation context
//     }),
//   });

//   if (!response.ok) {
//     const text = await response.text();
//     throw new Error(`Python AI Error: ${text}`);
//   }

//   const data = await response.json();
//   return data.reply || "⚠️ Mentor could not generate advice.";
// }

// /**
//  * Handle Pre-trade check-in
//  */
// router.post("/checkin", async (req, res) => {
//   try {
//     const { message, user_id } = req.body;

//     // Initialize history if first time
//     if (!userHistories[user_id]) userHistories[user_id] = [];

//     // Save user message
//     userHistories[user_id].push({ role: "user", content: message });

//     // Query AI
//     const advice = await queryPythonAI(message, user_id);

//     // Save AI response
//     userHistories[user_id].push({ role: "mentor", content: advice });

//     res.json({ success: true, advice });
//   } catch (error) {
//     console.error("❌ Check-in Error:", error.message);
//     res.status(500).json({ success: false, error: "Mentor failed to respond." });
//   }
// });

// /**
//  * Handle free chat
//  */
// router.post("/chat", async (req, res) => {
//   try {
//     const { message, user_id } = req.body;

//     if (!userHistories[user_id]) userHistories[user_id] = [];
//     userHistories[user_id].push({ role: "user", content: message });

//     const reply = await queryPythonAI(message, user_id);
//     userHistories[user_id].push({ role: "mentor", content: reply });

//     res.json({ success: true, reply });
//   } catch (error) {
//     console.error("❌ Chat Error:", error.message);
//     res.status(500).json({ success: false, error: "Mentor failed to respond." });
//   }
// });

// /**
//  * Get chat history
//  */
// router.get("/history/:user_id", (req, res) => {
//   const { user_id } = req.params;
//   res.json({ success: true, history: userHistories[user_id] || [] });
// });

// export default router;









// import express from "express";
// import fetch from "node-fetch";

// const router = express.Router();

// const HF_API_URL =
//   "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";
// const HF_API_KEY = process.env.HUGGINGFACE_API_KEY; 


// // In-memory history (later replace with DB)
// let chatHistory = [];

// /**
//  * Helper: Call Hugging Face API
//  */
// async function queryHuggingFace(prompt) {
//   const response = await fetch(HF_API_URL, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${HF_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       inputs: `<s>[INST] ${prompt} [/INST]`,
//       parameters: {
//         max_new_tokens: 200,
//         temperature: 0.7,
//         return_full_text: false,
//       },
//     }),
//   });

//   if (!response.ok) {
//     const text = await response.text();
//     throw new Error(`HuggingFace API error: ${text}`);
//   }

//   const data = await response.json();
//   return (
//     (data && data[0] && data[0].generated_text) ||
//     "⚠️ Mentor could not generate advice."
//   );
// }

// /**
//  * ✅ Pre-trade check-in
//  */
// router.post("/checkin", async (req, res) => {
//   try {
//     const { tradeType } = req.body;

//     const prompt = `I am preparing for a ${tradeType} trade. 
//     As my mentor, ask me a few thoughtful pre-trade check-in questions 
//     to clarify my mindset, strategy, and risks.`;

//     const advice = await queryHuggingFace(prompt);

//     chatHistory.push({ role: "mentor", content: advice });

//     res.json({ success: true, advice });
//   } catch (error) {
//     console.error("❌ Check-in Error:", error.message);
//     res
//       .status(500)
//       .json({ success: false, error: "Mentor failed to respond. Try again." });
//   }
// });

// /**
//  * ✅ Chat with mentor
//  */
// router.post("/chat", async (req, res) => {
//   try {
//     const { message } = req.body;

//     // Save user message
//     chatHistory.push({ role: "user", content: message });

//     // Send to Hugging Face
//     const mentorResponse = await queryHuggingFace(message);

//     // Save mentor reply
//     chatHistory.push({ role: "mentor", content: mentorResponse });

//     res.json({ success: true, reply: mentorResponse });
//   } catch (error) {
//     console.error("❌ Chat Error:", error.message);
//     res
//       .status(500)
//       .json({ success: false, error: "Mentor failed to respond. Try again." });
//   }
// });

// /**
//  * ✅ Get chat history
//  */
// router.get("/history", (req, res) => {
//   res.json({ success: true, history: chatHistory });
// });
