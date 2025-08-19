import React from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const StatsCard = ({ title, value, change, isPositive, className = '' }) => {
  return (
    <div className={`rounded-2xl shadow-md p-4 flex flex-col gap-2 ${className}`}>
      <div className='text-gray-500 text-sm'>{title}</div>
      <div className='text-2xl font-semibold text-gray-800'>{value}</div>
      <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span className='ml-1'>{change}</span>
      </div>
    </div>
  )
}

export default StatsCard;
