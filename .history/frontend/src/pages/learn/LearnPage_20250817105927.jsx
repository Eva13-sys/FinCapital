import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

const topics = [
  {
    title: "What is Stock?",
    description: "Understand the basics of stocks and how they work in the market.",
    image: "stock.html",
    path: "/learn/what-is-stock",
  },
  {
    title: "Mutual Funds",
    description: "Learn how mutual funds pool money to invest in assets.",
    image: "mutual-funds.html",
    path: "/learn/mutual-funds",
  },
  {
    title: "Trading Basics",
    description: "Get started with the fundamentals of trading and risk management.",
    image: "trading.html",
    path: "/learn/trading-basics",
  },
];
const LearnPage = () => {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      <h1>Learn Finance & Trading</h1>
      <div className=''>
        {topics.map((topic, index)=>(
          <div key={index}>
          <h2>{topic.title}</h2>
          <p>{topic.description}</p>
          <img src={topic.image} alt={topic.title} />
          <Link to={topic.path}>Learn More</Link>
        </div>)}
        )
        
      </div>
    </div>
  )
}

export default LearnPage