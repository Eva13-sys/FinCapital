import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

const topics = [
  {
    title: "What is Stock?",
    description: "Understand the basics of stocks and how they work in the market.",
    image: "stock.html",
    path: "https://www.investopedia.com/terms/s/stock.asp",
  },
  {
    title: "Mutual Funds",
    description: "Learn how mutual funds pool money to invest in assets.",
    image: "mutual-funds.html",
    path: "https://www.investopedia.com/terms/m/mutualfund.asp#:~:text=Mutual%20funds%20pool%20money%20from,expenses%20divided%20by%20total%20shares.",
  },
  {
    title: "Trading Basics",
    description: "Get started with the fundamentals of trading and risk management.",
    image: "trading.html",
    path: "https://www.investopedia.com/articles/trading/05/011705.asp",
  },
];
const LearnPage = () => {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      <h1>Learn Finance & Trading</h1>
      <div className=''>
        {topics.map((topic, index)=>(
          <div key={index}
          className=''>
          <img src={topic.image} alt={topic.title} className='w-full h-48 object-cover' />  
          <div className='p-4'>
            <h2 className='text-xl font-semibold mb-2'>{topic.title}</h2>
            <p className="text-gray-600 mb-4">{topic.description}</p>
            <Link to={topic.path} className='text-indigo-500 font-medium hover:underline'>
            Learn More
            </Link>
          </div>
        </div>))}
      </div>
    </div>
  )
}

export default LearnPage