import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

const topics = [
  {
    title: "What is Stock?",
    description: "Understand the basics of stocks and how they work in the market.",
    image: "stock",
    path: "/learn/what-is-stock",
  },
  {
    title: "Mutual Funds",
    description: "Learn how mutual funds pool money to invest in assets.",
    image: "https://source.unsplash.com/400x250/?finance,mutualfunds",
    path: "/learn/mutual-funds",
  },
  {
    title: "Trading Basics",
    description: "Get started with the fundamentals of trading and risk management.",
    image: "https://source.unsplash.com/400x250/?trading,finance",
    path: "/learn/trading-basics",
  },
];
const LearnPage = () => {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      LearnPage
    </div>
  )
}

export default LearnPage