"use client";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js"; // นำเข้า registerables

// ลงทะเบียนวัตถุที่จำเป็น
Chart.register(...registerables);

const ChartComponent = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // ดึงข้อมูลจาก API
    const fetchData = async () => {
      try {
        const response = await fetch("/api/display-summary");
        const data = await response.json();

        // จัดกลุ่มข้อมูลตาม screenId
        const groupedData = data.reduce((acc, item) => {
          const screenId = item.screenId;
          if (!acc[screenId]) {
            acc[screenId] = {
              screenLabel: item.screenLabel,
              items: [],
            };
          }
          acc[screenId].items.push({
            itemLabel: item.itemLabel,
            displayCount: parseInt(item.displayCount, 10),
          });
          return acc;
        }, {});

        // กำหนดสีสำหรับแต่ละแท่งกราฟ
        const colors = [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ];

        // แปลงข้อมูลที่จัดกลุ่มแล้วเป็นรูปแบบที่เหมาะกับ Chart.js
        const formattedData = Object.keys(groupedData).map((screenId) => ({
          screenId,
          screenLabel: groupedData[screenId].screenLabel,
          chartData: {
            labels: groupedData[screenId].items.map((item) => item.itemLabel),
            datasets: [
              {
                data: groupedData[screenId].items.map(
                  (item) => item.displayCount
                ),
                backgroundColor: groupedData[screenId].items.map(
                  (_, index) => colors[index % colors.length] // ใช้สีที่วนรอบ
                ),
              },
            ],
          },
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-4/5 mx-auto pt-12">
      <h2 className="text-2xl font-bold text-center mb-6">
        Display Count by Item for Each Screen
      </h2>
      {chartData.length > 0 ? (
        chartData.map(({ screenId, screenLabel, chartData }) => (
          <div key={screenId} className="mb-12">
            <h3 className="text-xl font-semibold text-center mb-4">
              {screenLabel} (Screen ID: {screenId})
            </h3>
            <div className="h-96">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: false, // ซ่อน legend
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        maxTicksLimit: 5,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
};

export default ChartComponent;
