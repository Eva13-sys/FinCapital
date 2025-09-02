from transformers import pipeline
from textblob import TextBlob
import numpy as np
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class SentimentAnalyzer:
    def __init__(self):
        self.finbert = pipeline("sentiment-analysis", model="ProsusAI/finbert")
        self.vander = SentimentIntensityAnalyzer()
        self.custom_model = self.load_custom_model()

    def analyze_news_sentiment(self, headline):
        try:
            results = self.finbert(headline)
            scores = [1 if result['label'] == 'positive' else
                      -1 if result['label']== 'negative' else
                      0 for result in results]
            return np.mean(scores)
        except:
            return self.analyze_with_vader([headline])

    def analyze_with_vader(self, tweets):
        """twitter"""
        sentiments = [self.vader.polarity_scores(tweet)['compound'] for tweet in tweets]
        return np.mean(sentiments)
    def load_custom_model(self):
        
        pass