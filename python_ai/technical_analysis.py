import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import talib 

class TechnicalAnalyzer:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100)
        self.scalar = StandardScalar()
        self.is_trained =False
    
    def extract_features(self, price_data):
        df = pd.DataFrame(price_data)
        features={
            'rsi': talib.RSI(df['close']).iloc[-1],
            'macd': talib.MACD(df['close'])[0].iloc[-1],
            'bollinger_bands': self.get_bollinger_bands_ratio(df),
            'volume_ratio': df['volume'].iloc[-1] / df['volume'].mean(),
            'price_trend': self.calculate_trend(df['close']),
            'volatility': df['close'].pct_change().std() * np.sqrt(252)
        }
        return features
    
    def predict_direction(self, features):
        if not self.is_trained:
            return self.heuristic_prediction(features)
       
        X = self.scalar.transform([list(features.values())])
        return self.model.predict(X)[0]
    
    def train_model(self, historical_data):
        
        pass