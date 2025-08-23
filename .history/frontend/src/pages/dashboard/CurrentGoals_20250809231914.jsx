import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";

const goals = [
    { name: "Save Rs.1000000", progress: 60, color: "#3b82f6" },
    { name: "Invest in ESG Funds", progress: 40, color: "#10b981" },
    { name: "Pay off Debt", progress: 80, color: "#f59e0b" }
];

const CurrentGoals = () => {
    return (
        <div className='bg-white rounded-2xl shadow-md p-6'>
            <h2 className='text-lg font-semibold mb-6 text-center'>Current Goals</h2>
            <div className='flex flex-wrap justify-around gap-8'>
                {goals.map((goal, index) => (
                    <div key={index} className='flex flex-col items-center'>
                        <div style={{ width: 80, height: 80 }}>
                            <CircularProgressbar
                                value={goal.progress}
                                text={`${goal.progress}%`}
                                styles={buildStyles({
                                    pathColor: goal.color,
                                    textColor: "#374151",
                                    trailColor:"#e5e7eb"
                                })}
                            />
                        </div>
                        <p className='mt-2 text-sm text-gray-700 text-center'>{goal.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CurrentGoals;
