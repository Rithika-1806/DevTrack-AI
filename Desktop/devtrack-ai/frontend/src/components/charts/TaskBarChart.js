import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TaskBarChart = ({ completed, pending, inProgress }) => {
  const data = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [{
      label: 'Tasks',
      data: [completed || 0, inProgress || 0, pending || 0],
      backgroundColor: ['rgba(34,197,94,0.8)', 'rgba(59,130,246,0.8)', 'rgba(239,68,68,0.8)'],
      borderColor: ['#22c55e', '#3b82f6', '#ef4444'],
      borderWidth: 1,
      borderRadius: 6
    }]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
  x: {
    ticks: { color: '#bbb', font: { size: 11 } },
    grid:  { color: '#f0f0ea' }
  },
  y: {
    ticks: { color: '#bbb', font: { size: 11 } },
    grid:  { color: '#f0f0ea' },
    beginAtZero: true
  }
}
  };

  return <Bar data={data} options={options} />;
};

export default TaskBarChart;