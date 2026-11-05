import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { formatDay } from "../../utils/formatDate";

export default function PrecipitationChart({ weather }) {
  const daily = weather?.daily;

  if (!daily) {
    return <div className="p-7 text-center text-[#91a5bf]">Precipitation data is unavailable.</div>;
  }

  const data = (daily.time || []).map((date, index) => ({
    day: formatDay(date, { short: true }),
    precipitation: daily.precipitation_probability_max?.[index] ?? 0
  }));

  return (
    <section className="min-w-0 rounded-[20px] bg-[#111d30] p-4 sm:p-5">
      <h2 className="mb-[18px] text-lg font-semibold">Rain probability</h2>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#293a52" strokeDasharray="4 4" />
            <XAxis dataKey="day" stroke="#91a5bf" />
            <YAxis stroke="#91a5bf" domain={[0, 100]} unit="%" />
            <Tooltip
              contentStyle={{
                background: "#111d30",
                border: "1px solid #293a52",
                borderRadius: 10,
                color: "#e7edf7"
              }}
              formatter={(value) => [`${value}%`, "Rain probability"]}
            />
            <Bar dataKey="precipitation" name="Rain probability" fill="#80acd7" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
