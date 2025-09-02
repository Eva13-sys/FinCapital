# from flask import Flask, request, jsonify
# from transformers import AutoTokenizer, AutoModelForCausalLM
# import torch

# app = Flask(__name__)

# # Load your model (example with DialoGPT-medium)
# MODEL_NAME = "microsoft/DialoGPT-medium"
# tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
# model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

# # Limit chat history to avoid long inputs
# MAX_HISTORY = 5

# @app.route("/api/ai", methods=["POST"])
# def ai_chat():
#     try:
#         data = request.json
#         prompt = data.get("prompt", "")
#         history = data.get("history", [])[-MAX_HISTORY:]  # last N messages

#         # Build conversation string for model
#         conversation = ""
#         for msg in history:
#             role = msg["role"]
#             content = msg["content"]
#             conversation += f"{role}: {content}\n"
#         conversation += f"user: {prompt}\nmentor:"

#         # Encode input and generate response
#         input_ids = tokenizer.encode(conversation, return_tensors="pt")
#         output_ids = model.generate(
#             input_ids,
#             max_length=input_ids.shape[1] + 100,
#             pad_token_id=tokenizer.eos_token_id,
#             do_sample=True,
#             temperature=0.7,
#         )
#         output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)

#         # Extract mentor reply only
#         reply = output_text.split("mentor:")[-1].strip()
#         return jsonify({"reply": reply})

#     except Exception as e:
#         print("Error:", e)
#         return jsonify({"reply": "⚠️ Mentor could not generate advice."})

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=8000, debug=True)








# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from transformers import pipeline

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app)  # Allow frontend (React/Node) to talk to Flask

# # Load AI model (text generation)
# generator = pipeline("text-generation", model="gpt2")

# # =====================
# # Mentor AI route
# # =====================
# @app.route("/api/ai", methods=["POST"])
# def ai_api():
#     try:
#         data = request.json
#         user_message = data.get("prompt", "")

#         if not user_message:
#             return jsonify({"error": "No message provided"}), 400

#         # Generate AI response
#         response = generator(
#             user_message,
#             max_length=200,
#             num_return_sequences=1,
#             do_sample=True,
#             temperature=0.7
#         )

#         bot_reply = response[0]["generated_text"]
#         return jsonify({"reply": bot_reply})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# # =====================
# # Pre-trade Check-in route
# # =====================
# @app.route("/api/pretrade", methods=["POST"])
# def pretrade_api():
#     try:
#         data = request.json
#         prompt = data.get("prompt", "")

#         if not prompt:
#             return jsonify({"error": "No prompt provided"}), 400

#         response = generator(
#             f"Pre-trade check-in: {prompt}",
#             max_length=150,
#             num_return_sequences=1,
#             do_sample=True,
#             temperature=0.7
#         )

#         advice = response[0]["generated_text"]
#         return jsonify({"reply": advice})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)






# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)


# # @app.route("/api/ai", methods=["POST"])
# # def ai_endpoint():
# #     try:
# #         data = request.json
# #         user_message = data.get("message", "")

# #         # Dummy AI response (replace with real model logic later)
# #         response_text = f"AI Response to: {user_message}"

# #         return jsonify({"reply": response_text}), 200

# #     except Exception as e:
# #         # Always return JSON for errors too
# #         return jsonify({"error": str(e)}), 500
# @app.route("/api/ai", methods=["POST"])
# def ai_response():
#     data = request.get_json()
#     message = data.get("message", "")
#     return jsonify({"response": f"AI response to: {message}"})



# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)





from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
from textblob import TextBlob
import numpy as np
from datetime import datetime, timedelta
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

def analyze_stock_sentiment(symbol):
    """Enhanced sentiment analysis with real data"""
    try:
        # Get real stock data
        stock = yf.Ticker(symbol)
        info = stock.info
        history = stock.history(period="1mo")
        
        if history.empty:
            return {
                "symbol": symbol,
                "error": "No historical data available",
                "analysis": f"No historical data found for {symbol}. Please check the symbol.",
                "timestamp": datetime.now().isoformat(),
                "recommendation": "NEUTRAL",
                "confidence": 0.3
            }
        
        # Basic technical analysis
        current_price = info.get('currentPrice', info.get('regularMarketPrice', 0))
        previous_close = info.get('previousClose', current_price)
        price_change = ((current_price - previous_close) / previous_close) * 100 if previous_close else 0
        
        # Calculate simple moving averages
        if len(history) > 20:
            sma_20 = history['Close'].tail(20).mean()
            sma_50 = history['Close'].tail(50).mean() if len(history) > 50 else sma_20
            trend = "bullish" if current_price > sma_20 > sma_50 else "bearish"
        else:
            trend = "neutral"
        
        # Simple sentiment based on price action and trend
        if price_change > 2 and trend == "bullish":
            sentiment = "strongly bullish"
            confidence = 0.8
            recommendation = "STRONG_BUY"
        elif price_change > 0 and trend == "bullish":
            sentiment = "bullish"
            confidence = 0.7
            recommendation = "BUY"
        elif price_change < -2 and trend == "bearish":
            sentiment = "strongly bearish"
            confidence = 0.8
            recommendation = "STRONG_SELL"
        elif price_change < 0 and trend == "bearish":
            sentiment = "bearish"
            confidence = 0.7
            recommendation = "SELL"
        else:
            sentiment = "neutral"
            confidence = 0.5
            recommendation = "HOLD"
        
        # Generate analysis text
        analysis_text = f"""
{symbol} Technical Analysis:
- Current Price: ₹{current_price:.2f}
- Price Change: {price_change:+.2f}%
- Trend: {trend.upper()}
- Sentiment: {sentiment.upper()}

Recommendation: {recommendation.replace('_', ' ')}
Key Factors: 
• Price momentum: {price_change:+.2f}%
• Trend alignment: {trend}
• Market sentiment: {sentiment}

Risk Level: {'MODERATE' if abs(price_change) < 5 else 'HIGH'}
"""

        return {
            "symbol": symbol,
            "current_price": current_price,
            "price_change": round(price_change, 2),
            "sentiment": sentiment,
            "confidence": confidence,
            "recommendation": recommendation,
            "analysis": analysis_text,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error analyzing {symbol}: {str(e)}")
        return {
            "symbol": symbol,
            "error": str(e),
            "analysis": "Unable to analyze stock data. Please check the symbol and try again.",
            "timestamp": datetime.now().isoformat(),
            "recommendation": "NEUTRAL",
            "confidence": 0.3
        }

@app.route("/api/ai", methods=["POST"])
def ai_response():
    try:
        data = request.get_json()
        message = data.get("message", "")
        user_id = data.get("userId")
        
        logger.info(f"AI request from user {user_id}: {message[:100]}...")
        
        # Check if this is a stock analysis request
        if any(keyword in message.lower() for keyword in ['stock:', 'symbol:', 'analyze', 'trade', 'buy', 'sell']):
            # Extract stock symbol from message
            symbol = None
            lines = message.split('\n')
            for line in lines:
                if 'stock:' in line.lower():
                    parts = line.split(':')
                    if len(parts) > 1:
                        symbol = parts[1].strip()
                elif 'symbol:' in line.lower():
                    parts = line.split(':')
                    if len(parts) > 1:
                        symbol = parts[1].strip()
            
            # If no symbol found, try to extract from the message
            if not symbol:
                words = message.split()
                for word in words:
                    if word.isupper() and 2 <= len(word) <= 5 and not word.isdigit():
                        symbol = word
                        break
            
            if symbol:
                logger.info(f"Analyzing symbol: {symbol}")
                analysis = analyze_stock_sentiment(symbol)
                return jsonify(analysis)
        
        # Default response for other messages
        return jsonify({
            "response": f"AI analysis: {message}",
            "timestamp": datetime.now().isoformat(),
            "type": "general_response"
        })
        
    except Exception as e:
        logger.error(f"AI endpoint error: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "Python AI Service",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.route("/api/stocks/<symbol>", methods=["GET"])
def get_stock_info(symbol):
    try:
        analysis = analyze_stock_sentiment(symbol)
        return jsonify(analysis)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    logger.info("Starting Python AI Service...")
    app.run(host="0.0.0.0", port=5000, debug=False)