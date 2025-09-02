import tweepy
from transformers import pipeline

class SocialSentimentAnalyzer:
    def __init__(self):
        self.twitter_client = tweepy.Client(bearer_token= os.getenv('TWITTER_BEARER_TOKEN'))
        self.sentiment_pipeline = pipeline("sentiment-analysis")
    
    def get_twitter_sentiment(self, symbol):
        try:
            tweets= self.twitter_client.search_recent_tweets(
                query=f"${symbol} -is:retweet lang:en", max_results=100
            )
            #analyze sentiment

            sentiments=[]
            for tweet in tweets.data:
                result = self.sentiment_pipeline(tweet.text)[0]
                score = 1 if result['label'] =='POSITIVE' else -1
                sentiments.append(score * result['score'])
            return np.mean(sentiments) if sentiments else 0

        except Exception as e:
            print(f"Error fetching Twitter sentiment: {e}")
            return 0