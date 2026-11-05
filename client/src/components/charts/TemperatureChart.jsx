import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { useUnit } from "../../context/UnitContext";
import { convertTemp } from "../../utils/convertTemp";
import { formatDay } from "../../utils/formatDate";

export default function TemperatureChart({ weather, compact = false }) {
  const { unit } = useUnit();

  if (!weather?.daily) {
    return (
      <div className="rounded-2xl bg-[#172438] p-5 text-center text-[#91a5bf]">
        Temperature data is unavailable.
      </div>
    );
  }

  const daily = weather.daily;

  const data = (daily.time || []).map((date, index) => ({
    day: index === 0 ? "Today" : formatDay(date, { short: true }),
    maximum: convertTemp(daily.temperature_2m_max[index], unit),
    minimum: convertTemp(daily.temperature_2m_min[index], unit)
  }));

  return (
    <section className={`min-w-0 rounded-[20px] bg-[#172438] p-4 sm:p-5 ${compact ? "h-full" : ""}`}>
      <h2 className="mb-[18px] text-base font-semibold">Temperature trend, 7 days</h2>

      <div className={`w-full ${compact ? "h-[205px]" : "h-[280px]"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
            <CartesianGrid stroke="#293a52" strokeDasharray="4 4" />
            <XAxis dataKey="day" stroke="#91a5bf" tickLine={false} axisLine={false} />
            <YAxis stroke="#91a5bf" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "#111d30",
                border: "1px solid #293a52",
                borderRadius: 10,
                color: "#e7edf7"
              }}
              formatter={(value) => [`${value}°${unit}`, ""]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="maximum"
              name="High"
              stroke="#ffa52f"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="minimum"
              name="Low"
              stroke="#80acd7"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
