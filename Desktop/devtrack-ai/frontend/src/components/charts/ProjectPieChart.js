import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProjectPieChart = ({ planning, inProgress, completed, onHold }) => {
  const data = {
    labels: ['Planning', 'In Progress', 'Completed', 'On Hold'],
    datasets: [{
      data: [planning || 0, inProgress || 0, completed || 0, onHold || 0],
      backgroundColor: [
        'rgba(59,130,246,0.8)',
        'rgba(234,179,8,0.8)',
        'rgba(34,197,94,0.8)',
        'rgba(107,114,128,0.8)'
      ],
      borderColor: ['#3b82f6', '#eab308', '#22c55e', '#6b7280'],
      borderWidth: 1
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

  return <Doughnut data={data} options={options} />;
};

export default ProjectPieChart;