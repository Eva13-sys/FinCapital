// src/pages/landing/home/HomePage.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  LineSeries,
} from "lightweight-charts";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { 
  Star, 
  TrendingUp, 
  Users, 
  Globe, 
  Shield, 
  Brain, 
  Zap, 
  BarChart3,
  ChevronRight,
  Play,
  Award,
  Clock,
  MessageSquare
} from "lucide-react";

export default function HomePage() {
  const chartContainerRef = useRef(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Features with icons
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Mentor",
      description: "Get personalized trading insights and emotional trading checks from our advanced AI system.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Global Community",
      description: "Connect with traders worldwide, share strategies, and learn from experienced professionals.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Live Markets",
      description: "Real-time candlestick charts with advanced technical indicators and drawing tools.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Trading",
      description: "Bank-level security with encryption and two-factor authentication for all transactions.",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Execute trades in milliseconds with our high-performance trading infrastructure.",
      color: "from-red-500 to-rose-500"
    }
  ];

  // Chart setup with more realistic data
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { 
        background: { type: ColorType.Solid, color: "transparent" }, 
        textColor: "#6B7280",
        fontSize: 12,
      },
      crosshair: { 
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#374151',
          width: 1,
          style: 2,
          labelBackgroundColor: '#3B82F6',
        },
        horzLine: {
          color: '#374151',
          width: 1,
          style: 2,
          labelBackgroundColor: '#3B82F6',
        }
      },
      grid: {
        vertLines: {
          color: 'rgba(156, 163, 175, 0.2)',
          style: 1,
          visible: true,
        },
        horzLines: {
          color: 'rgba(156, 163, 175, 0.2)',
          style: 1,
          visible: true,
        }
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(156, 163, 175, 0.2)',
      },
      rightPriceScale: {
        borderColor: 'rgba(156, 163, 175, 0.2)',
      },
    });

    // Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10B981",
      borderUpColor: "#10B981",
      wickUpColor: "#10B981",
      downColor: "#EF4444",
      borderDownColor: "#EF4444",
      wickDownColor: "#EF4444",
      priceLineVisible: false,
    });

    // Generate more realistic sample data
    const generateSampleData = () => {
      const data = [];
      let time = new Date("2024-01-01");
      let price = 100;
      
      for (let i = 0; i < 100; i++) {
        const volatility = Math.random() * 4;
        const change = (Math.random() - 0.5) * volatility;
        
        const open = price;
        const close = price * (1 + change);
        const high = Math.max(open, close) * (1 + Math.random() * 0.02);
        const low = Math.min(open, close) * (1 - Math.random() * 0.02);
        
        data.push({
          time: time.getTime() / 1000,
          open,
          high,
          low,
          close,
        });
        
        // Move to next day
        time.setDate(time.getDate() + 1);
        price = close;
      }
      
      return data;
    };

    candleSeries.setData(generateSampleData());

    // Add a moving average line
    const lineSeries = chart.addSeries(LineSeries, {
      color: '#3B82F6',
      lineWidth: 2,
      priceLineVisible: false,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });

    // Calculate simple moving average data
    const candleData = generateSampleData();
    const smaData = [];
    const period = 20;
    
    for (let i = period - 1; i < candleData.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += candleData[i - j].close;
      }
      smaData.push({
        time: candleData[i].time,
        value: sum / period,
      });
    }
    
    lineSeries.setData(smaData);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // Testimonials
  const reviews = [
    { 
      name: "Rahul Mehta", 
      role: "Day Trader",
      text: "The AI mentor has completely transformed my trading strategy. I've seen a 35% increase in profitable trades since I started using FinCapital.", 
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
    },
    { 
      name: "Ananya Sharma", 
      role: "Swing Trader",
      text: "Love the real-time insights and the community features. It's like having a trading desk right in my pocket!", 
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80"
    },
    { 
      name: "David Johnson", 
      role: "Investment Analyst",
      text: "The charting tools are exceptional. I particularly appreciate the technical indicators and the ability to backtest strategies.", 
      rating: 4,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
    },
    { 
      name: "Sophia Chen", 
      role: "Crypto Investor",
      text: "As someone who trades both traditional markets and crypto, FinCapital's unified platform is a game-changer.", 
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
    },
  ];

  const sliderSettings = { 
    dots: true, 
    infinite: true, 
    autoplay: true, 
    autoplaySpeed: 5000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: true
  };

  return (
    <div className="overflow-hidden w-full">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden w-full">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Trade Smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400">FinCapital</span>
              </h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto lg:mx-0 opacity-90">
                AI-powered insights, real-time market data, and a global community to help you make better investment decisions.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
                <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1">
                  Start Trading Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-bold py-3 px-8 rounded-xl">
                  <Play className="w-5 h-5 mr-2" /> Watch Demo
                </Button>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-900 bg-gray-200"></div>
                    ))}
                  </div>
                  <span className="ml-3">Join 10K+ traders</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-amber-400" />
                  <span>Rated 4.9/5 by investors</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative mx-auto lg:mx-0 lg:ml-auto max-w-md">
                <div className="absolute -inset-3 bg-gradient-to-r from-amber-400 to-rose-400 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-gray-900 rounded-2xl shadow-2xl p-1">
                  <div ref={chartContainerRef} className="rounded-xl overflow-hidden"></div>
                  <div className="p-4 bg-gray-800 rounded-b-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-400 text-sm">BTC/USD</span>
                        <div className="text-white font-bold text-xl">$42,367.89 <span className="text-green-500 text-sm">+2.4%</span></div>
                      </div>
                      <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium">
                        Trade Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100 w-full">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-xl mb-4">
                <Users className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10K+</h3>
              <p className="text-gray-600">Active Traders</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-xl mb-4">
                <Globe className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Countries</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 rounded-xl mb-4">
                <TrendingUp className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">$1B+</h3>
              <p className="text-gray-600">Transactions</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-100 rounded-xl mb-4">
                <Star className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">4.9/5</h3>
              <p className="text-gray-600">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white w-full">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern Traders</h2>
            <p className="text-xl text-gray-600">Everything you need to succeed in today's fast-paced markets</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12 w-full">
            <div className="lg:w-2/5">
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${activeFeature === index ? 'bg-gradient-to-r ' + feature.color + ' text-white shadow-xl' : 'bg-gray-50 hover:bg-gray-100'}`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg ${activeFeature === index ? 'bg-white/20' : 'bg-white shadow-md'}`}>
                        {feature.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                        <p className={activeFeature === index ? 'text-white/90' : 'text-gray-600'}>{feature.description}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 ml-auto ${activeFeature === index ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-3/5 flex items-center justify-center">
              <div className="relative w-full max-w-2xl">
                <div className="absolute -inset-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
                    <h3 className="font-bold text-xl">{features[activeFeature].title}</h3>
                    <p className="text-indigo-100">See how our {features[activeFeature].title.toLowerCase()} can transform your trading</p>
                  </div>
                  <div className="p-8 bg-gray-800">
                    <div className="bg-gray-700 rounded-lg p-4 mb-6">
                      <div className="flex space-x-2 mb-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="bg-gray-900 rounded p-4 font-mono text-sm text-green-400 h-40 overflow-auto">
                        {activeFeature === 0 && (
                          <div>
                            <div>{"> Analyzing market sentiment..."}</div>
                            <div>{"> Detected bullish pattern on BTC/USD"}</div>
                            <div>{"> Confidence level: 82%"}</div>
                            <div>{"> Recommended action: LONG position"}</div>
                            <div>{"> Stop loss: $41,200 | Take profit: $44,500"}</div>
                          </div>
                        )}
                        {activeFeature === 1 && (
                          <div>
                            <div>{"> Connecting to global network..."}</div>
                            <div>{"> 12 traders discussing BTC strategy"}</div>
                            <div>{"> Top performer: SarahK_TC (+37% YTD)"}</div>
                            <div>{"> Latest insight: 'Expect volatility around FOMC'"}</div>
                            <div>{"> Join conversation about ETH breakout"}</div>
                          </div>
                        )}
                        {activeFeature === 2 && (
                          <div>
                            <div>{"> Loading real-time data..."}</div>
                            <div>{"> BTC/USD: $42,367.89 (+2.4%)"}</div>
                            <div>{"> RSI: 62 | MACD: Bullish crossover"}</div>
                            <div>{"> Volume: 28% above average"}</div>
                            <div>{"> Pattern: Bull flag forming on 4H chart"}</div>
                          </div>
                        )}
                        {activeFeature === 3 && (
                          <div>
                            <div>{"> Security status: All systems normal"}</div>
                            <div>{"> Last login: New Delhi, India (2 mins ago)"}</div>
                            <div>{"> 2FA: Enabled | Encryption: AES-256"}</div>
                            <div>{"> Funds protected by cold storage insurance"}</div>
                            <div>{"> Regular security audits completed"}</div>
                          </div>
                        )}
                        {activeFeature === 4 && (
                          <div>
                            <div>{"> Performance check: Optimal"}</div>
                            <div>{"> Order execution: 98% under 50ms"}</div>
                            <div>{"> API latency: 12ms average"}</div>
                            <div>{"> System uptime: 99.99% (30 days)"}</div>
                            <div>{"> Next upgrade: Scheduled for maintenance"}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-bold">
                      Try {features[activeFeature].title} Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 w-full">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Traders Worldwide</h2>
            <p className="text-xl text-gray-600">See what our community members are saying about their experience</p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <Slider {...sliderSettings}>
              {reviews.map((review, i) => (
                <div key={i} className="px-4 focus:outline-none">
                  <Card className="p-8 rounded-2xl shadow-xl border-0">
                    <CardContent className="p-0">
                      <div className="flex items-start mb-6">
                        <img 
                          src={review.avatar} 
                          alt={review.name}
                          className="w-14 h-14 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h4 className="font-bold text-lg">{review.name}</h4>
                          <p className="text-gray-600">{review.role}</p>
                        </div>
                        <div className="ml-auto flex">
                          {[...Array(review.rating)].map((_, idx) => (
                            <Star key={idx} className="w-5 h-5 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-lg italic mb-6">"{review.text}"</p>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">Posted 2 days ago</span>
                        <MessageSquare className="w-4 h-4 ml-4 mr-1" />
                        <span className="text-sm">12 comments</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </Slider>
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" className="border-gray-300 text-gray-700 rounded-xl py-3 px-8">
              View All Testimonials
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 to-purple-700 text-white w-full">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Trading?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 opacity-90">Join thousands of successful traders who are already using FinCapital to maximize their profits.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-4 px-10 rounded-xl text-lg">
              Create Free Account
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-10 rounded-xl text-lg">
              Schedule a Demo
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold mb-1">$0</div>
              <div className="text-sm opacity-80">Commission</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-sm opacity-80">Support</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold mb-1">100+</div>
              <div className="text-sm opacity-80">Markets</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold mb-1">1M+</div>
              <div className="text-sm opacity-80">Traders</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};