import React from 'react'

const tips=[
    "Set clear financial goals",
    "Diversify your investment portfolio",
    "Keep track of your expenses",
    "Stay informed about market trends",
    "Consult with a financial advisor"
]
const AiTips = () => {
  return (
    <div className='bg-white -4 shadow-md rounded-md'>
        <h2 className='text-lg font-semibold mb-3'>AI Tips</h2>
        <div className='space-y-2 max-h-32 overflow-y-auto'>
            {tips.map((tip, index) => (
                <div key={index} className='p-2 bg-gray-200 rounded text-sm text-gray-800'>
                    {tip}
                </div>
            ))}
        </div>
    </div>
  )
}

export default AiTips;
