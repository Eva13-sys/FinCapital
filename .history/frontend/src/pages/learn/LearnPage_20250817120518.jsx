import React from 'react'
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
    <div className="p-10">
      <h1 className='text'>Learn Finance & Trading</h1>
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