import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
);

const ProductivityLineChart = ({ productivityScore }) => {
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return days;
  };

  const score = productivityScore || 50;
  const trendData = [
    Math.max(0, score - 25), Math.max(0, score - 18),
    Math.max(0, score - 12), Math.max(0, score - 8),
    Math.max(0, score - 4), Math.max(0, score - 1), score
  ];

  const data = {
    labels: getLast7Days(),
    datasets: [{
      label: 'Productivity',
      data: trendData,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.08)',
      borderWidth: 2,
      pointBackgroundColor: '#3b82f6',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4
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

  return <Line data={data} options={options} />;
};

export default ProductivityLineChart;