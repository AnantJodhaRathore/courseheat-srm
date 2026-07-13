import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import type { Course, GradeKey, Review } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      suggestedMax: 70,
      ticks: { callback: (value: string | number) => `${value}%` }
    }
  }
};

type GradeDistributionChartProps = {
  course: Course;
};

export function GradeDistributionChart({ course }: GradeDistributionChartProps) {
  const labels = Object.keys(course.gradeDistribution);
  const values = Object.values(course.gradeDistribution);

  return (
    <section className="chart-card">
      <div className="chart-heading">
        <h3>Grade distribution</h3>
        <span>% of class</span>
      </div>
      <div className="chart-wrap">
        <Bar
          options={chartOptions}
          data={{
            labels,
            datasets: [
              {
                label: 'Students',
                data: values,
                borderRadius: 12,
                backgroundColor: ['#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444']
              }
            ]
          }}
        />
      </div>
    </section>
  );
}

type ReviewGradeChartProps = {
  reviews: Review[];
};

export function ReviewGradeChart({ reviews }: ReviewGradeChartProps) {
  const gradeKeys: GradeKey[] = ['A', 'B', 'C', 'D', 'F'];
  const gradeCounts = gradeKeys.map((grade) => reviews.filter((review) => review.grade === grade).length);

  return (
    <section className="chart-card small-chart">
      <div className="chart-heading">
        <h3>Review grades</h3>
        <span>{reviews.length} reviews</span>
      </div>
      <div className="chart-wrap doughnut-wrap">
        <Doughnut
          data={{
            labels: gradeKeys,
            datasets: [
              {
                label: 'Reviews',
                data: gradeCounts,
                backgroundColor: ['#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444'],
                borderWidth: 0
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' as const }
            }
          }}
        />
      </div>
    </section>
  );
}
