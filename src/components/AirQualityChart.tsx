import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const sampleData = [
  { time: "10am", AQI: 42 },
  { time: "11am", AQI: 48 },
  { time: "12pm", AQI: 53 },
  { time: "1pm", AQI: 49 },
  { time: "2pm", AQI: 55 },
];

export function AirQualityChart() {
  return (
    <div className="p-4 border rounded-xl bg-card">
      <h3 className="font-semibold text-lg mb-4">Air Quality Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={sampleData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="AQI" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
