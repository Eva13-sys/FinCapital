import React, { useState, useEffect } from 'react';
import {Line} from 'react-chartjs-2';
import {Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);
const initialLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const initialData = [10000, 20000, 15000, 30000, 20500, 40000, 30500];
const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#4B5563',
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#6B7280' },
      grid: { display: false },
    },
    y: {
      ticks: { color: '#6B7280' },
      grid: { borderDash: [4, 4] },
      min: 0, // Set minimum value for y-axis
      max: 50000, // Set maximum value for y-axis (adjust as needed)
    },
  },
};
const AnalyticsChart = () => {
  // State for chart data
  const [labels, setLabels] = useState(() => {
    const saved = localStorage.getItem('chartLabels');
    return saved ? JSON.parse(saved) : initialLabels;
  });
  const [values, setValues] = useState(() => {
    const saved = localStorage.getItem('chartValues');
    return saved ? JSON.parse(saved) : initialData;
  });
  // State for form inputs
  const [inputLabel, setInputLabel] = useState('');
  const [inputValue, setInputValue] = useState('');
  // State for editing
  const [editIdx, setEditIdx] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editValue, setEditValue] = useState('');

  // Save to localStorage whenever labels or values change
  useEffect(() => {
    localStorage.setItem('chartLabels', JSON.stringify(labels));
    localStorage.setItem('chartValues', JSON.stringify(values));
  }, [labels, values]);

  // Chart.js expects this structure
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Portfolio Value',
        data: values,
        fill: false,
        borderColor: '#6366f1',
        tension: 0.4,
      },
    ],
  };

  // Handle form submission to add new data point
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputLabel || !inputValue) return;
    setLabels([...labels, inputLabel]);
    setValues([...values, Number(inputValue)]);
    setInputLabel('');
    setInputValue('');
  };

  // Remove a data point by index
  const handleRemove = (idx) => {
    setLabels(labels.filter((_, i) => i !== idx));
    setValues(values.filter((_, i) => i !== idx));
  };

  // Start editing a data point
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditLabel(labels[idx]);
    setEditValue(values[idx]);
  };

  // Save edited data point
  const handleEditSave = (idx) => {
    const newLabels = [...labels];
    const newValues = [...values];
    newLabels[idx] = editLabel;
    newValues[idx] = Number(editValue);
    setLabels(newLabels);
    setValues(newValues);
    setEditIdx(null);
    setEditLabel('');
    setEditValue('');
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditIdx(null);
    setEditLabel('');
    setEditValue('');
  };

  return (
    <div className='bg-white rounded-2xl shadow-md p-6 w-full'>
      <h2 className='text-xl font-semibold'>Portfolio Overview</h2>
      <Line data={data} options={options} />
      <form onSubmit={handleSubmit} className='mt-6 flex flex-col md:flex-row gap-2 items-center'>
        <input
          type='text'
          placeholder='Label (e.g. Mon)'
          value={inputLabel}
          onChange={e => setInputLabel(e.target.value)}
          className='border rounded px-2 py-1 mr-2'
        />
        <input
          type='number'
          placeholder='Value (e.g. 25000)'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className='border rounded px-2 py-1 mr-2'
        />
        <button type='submit' className='bg-indigo-500 text-white px-4 py-1 rounded'>Add Data</button>
      </form>
      {/* List of data points with remove and edit buttons */}
      <div className='mt-4'>
        <h3 className='font-semibold mb-2'>Data Points</h3>
        <ul>
          {labels.map((label, idx) => (
            <li key={idx} className='flex items-center mb-1'>
              {editIdx === idx ? (
                <>
                  <input
                    type='text'
                    value={editLabel}
                    onChange={e => setEditLabel(e.target.value)}
                    className='border rounded px-1 py-0.5 mr-2 w-20'
                  />
                  <input
                    type='number'
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className='border rounded px-1 py-0.5 mr-2 w-20'
                  />
                  <button
                    onClick={() => handleEditSave(idx)}
                    className='ml-1 px-2 py-0.5 bg-green-500 text-white rounded text-xs'
                  >Save</button>
                  <button
                    onClick={handleEditCancel}
                    className='ml-1 px-2 py-0.5 bg-gray-400 text-white rounded text-xs'
                  >Cancel</button>
                </>
              ) : (
                <>
                  <span className='mr-2'>{label}: {values[idx]}</span>
                  <button
                    onClick={() => handleEdit(idx)}
                    className='ml-2 px-2 py-0.5 bg-blue-500 text-white rounded text-xs'
                  >Edit</button>
                  <button
                    onClick={() => handleRemove(idx)}
                    className='ml-2 px-2 py-0.5 bg-red-500 text-white rounded text-xs'
                  >Remove</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AnalyticsChart;
