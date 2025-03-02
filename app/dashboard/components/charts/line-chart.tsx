"use client";

import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChart {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      tension: number;
    }[];
  };
}

const LineChart: React.FC<LineChart> = ({ data }) => {
  return (
    <Line
      data={data}
      options={{
        responsive: true,
        resizeDelay: 2000,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Loan Activity" },
        },
      }}
    />
  );
};

export default LineChart;
