"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export interface DonutDataItem {
  name: string;
  value: number;
}

interface DonutChartProps {
  data: DonutDataItem[];
  title: string;
  subtitle?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: DonutDataItem;
  }>;
  total: number;
}

const CustomTooltip = ({ active, payload, total }: CustomTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;
  const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
      <div className="text-sm font-medium text-gray-900 mb-1">{item.name}</div>
      <div className="text-sm text-gray-700">تعداد: {item.value.toLocaleString("fa-IR")}</div>
      <div className="text-sm text-gray-700">درصد: {percent}%</div>
    </div>
  );
};

export default function DonutChart({ data, title }: DonutChartProps) {
  const COLORS = ["#448AFF", "#B2FF59", "#FFD740", "#FF5252", "#7C4DFF", "#00BCD4"];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const mainValue = data[0]?.value || 0;
  const percentage = total > 0 ? ((mainValue / total) * 100).toFixed(1) : "0";

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-3xl p-4 border border-gray-light dark:border-gray-dark text-center">
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      {/* {subtitle && <p className="text-xs text-gray-500 mb-4">{subtitle}</p>} */}

      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart data={data}>
            <Pie
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip total={total} />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold">{percentage}%</div>
            <div className="text-sm text-gray-500">بیشترین</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full ml-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm">{item.name}</span>
            </div>

            <span className="text-sm font-medium">
              {new Intl.NumberFormat("fa-IR").format(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
