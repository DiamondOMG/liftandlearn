"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B89B3",
  "#22EAAA",
  "#347474",
  "#0E34A0",
];

export default function DisplayCSVData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/display-summary");

        // Group data by screenId
        const groupedData = {};
        response.data.forEach((item) => {
          const { screenId, screenLabel, itemLabel, displayCount } = item;
          if (!groupedData[screenId]) {
            groupedData[screenId] = {
              screenLabel: screenLabel,
              data: [],
            };
          }
          // Check if item already exists
          const existingItem = groupedData[screenId].data.find(
            (d) => d.itemLabel === itemLabel
          );
          if (existingItem) {
            existingItem.displayCount = parseInt(displayCount);
          } else {
            groupedData[screenId].data.push({
              itemLabel,
              displayCount: parseInt(displayCount),
            });
          }
        });

        setData(groupedData);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin" />
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center p-4 bg-black">{error}</div>;

  return (
    <div className="min-h-screen bg-black p-6 space-y-8">
      {Object.entries(data).map(([screenId, screenData], index) => (
        <div
          key={screenId}
          className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-xl"
        >
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-bold text-white">
              {screenData.screenLabel}
            </h2>
            <p className="text-gray-400 text-sm">Screen ID: {screenId}</p>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={screenData.data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="itemLabel"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  stroke="#fff"
                  tick={{ fill: "#fff", fontSize: 12 }}
                />
                <YAxis
                  stroke="#fff"
                  tick={{ fill: "#fff" }}
                  label={{
                    value: "Display Count",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#fff" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid #333",
                    borderRadius: "4px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`${value}`, "Display Count"]}
                  labelFormatter={(label) => `Item: ${label}`}
                />
                <Bar
                  dataKey="displayCount"
                  fill={colors[index % colors.length]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4">
            <h3 className="text-white text-lg font-semibold mb-2">Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {screenData.data.map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-gray-300 text-sm truncate">
                    {item.itemLabel} ({item.displayCount})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
