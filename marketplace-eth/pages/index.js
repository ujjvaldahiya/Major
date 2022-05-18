import { Hero } from "@components/ui/common"
import { CourseList } from "@components/ui/course"
import { BaseLayout } from "@components/ui/layout"
import { getAllCourses } from "@content/courses/fetcher"
import { CourseCard } from "@components/ui/course"
import React from 'react';
import {Line} from 'react-chartjs-2';
import {CategoryScale} from 'chart.js'; 
import Chart from 'chart.js/auto';

import chartData from "../content/chart/data.json"

Chart.register(CategoryScale);


const data = {
  labels: chartData.Date.reverse(),
  datasets: [
    {
      label: 'ETH Price',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: chartData.Value.reverse()
    }
  ]
};

export default function Home({courses}) {
  return (
    <>
      <Hero />
      <div className = "lineGraph">
      <Line
        data={data}
        width={1200}
        height={1200}
        options = {{
          responsive: true,
          maintainAspectRatio: false
        }}
      />
      </div>
      
      <CourseList courses={courses}>
        {
          course => <CourseCard
          key={course.id} 
          course={course} 
          />
        }
      </CourseList>
    </>
  )
}

export function getStaticProps() {
  const {data} = getAllCourses()
  return {
    props: {
      courses: data
    }
  }
}

Home.Layout = BaseLayout