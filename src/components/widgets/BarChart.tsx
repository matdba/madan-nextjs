"use client";

import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    Cell,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

export type BarItem = {
    label?: string;
    value?: number;
};


export interface BarChartProps {
    data?: Record<string, number>;
    title?: string;
}


/* ---------------------- COMPONENT ---------------------- */

export default function CustomBarChart({
    data,
    title
}: BarChartProps) {
    const COLORS = ["#448AFF", "#B2FF59", "#FFD740", "#FF5252"];

    /* ---------------------- SANITIZE DATA ---------------------- */


    const sanitizedData = useMemo<BarItem[]>(() => {
        if (!data) return [];
        return Object.entries(data).map(([label, value]) => ({
            label,
            value,
        }));

        // return data.map((item, index) => ({
        //     label: item?.label || `${index + 1}`,
        //     value: Number(item?.value) || 0,
        // }));
    }, [data]);

    /* ---------------------- FORMATTERS ---------------------- */

    const formatNumber = (num: number | string) => {
        const n = Number(num) || 0;
        return new Intl.NumberFormat("fa-IR").format(n);
    };

    const getYAxisFormatter = () => {
        if (!sanitizedData.length) return (value: number) => formatNumber(value);

        // const maxVal = Math.max(
        //     ...sanitizedData.map((d) => Number(d.value) || 0),
        //     0
        // );

        // if (maxVal >= 1_000_000)
        //     return (v: number) => `${v} بار`;

        // if (maxVal >= 1_000)
        //     return (v: number) => `${formatNumber(Math.round(v / 1_000))} هزار تومان`;

        return (v: number) => formatNumber(v) + " بار";
    };

    // const getXAxisDataKey = () => {
    //     switch (selectedPeriod) {
    //         case "WEEKLY":
    //             return "day";
    //         case "MONTHLY":
    //             return "date";
    //         case "YEARLY":
    //             return "month";
    //         default:
    //             return "date";
    //     }
    // };

    /* ---------------------- RENDER ---------------------- */

    return (
        <div className="text-center bg-card-light dark:bg-card-dark border border-gray-light dark:border-gray-dark rounded-3xl p-4" dir="rtl">
            <p className="font-semibold text-base mb-4">{title}</p>

            <div className="h-64">
                {!sanitizedData.length ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%" style={{ direction: 'rtl' }}>
                        <BarChart
                            data={sanitizedData}
                            margin={{ top: 0, right: 0, left: 0, bottom: 0 }} // increase bottom for multiline labels
                            barGap={0}
                            barCategoryGap="15%"
                        >
                            {/* <XAxis dataKey={'label'} tick={{ fontSize: 12 }} /> */}
                            <XAxis
                                dataKey="label"
                                height={35}
                                interval={0}
                                tick={({ x, y, payload }) => {
                                    const text: string = String(payload.value ?? "");
                                    const maxChars = 10;
                                    const words = text.split(" ");
                                    const lines: string[] = [];
                                    let currentLine = "";

                                    for (const word of words) {
                                        if ((currentLine + (currentLine ? " " : "") + word).length <= maxChars) {
                                            currentLine += (currentLine ? " " : "") + word;
                                        } else {
                                            if (currentLine) lines.push(currentLine);
                                            currentLine = word;
                                        }
                                    }

                                    if (currentLine) lines.push(currentLine);

                                    const xPos = typeof x === "number" ? x : Number(x);
                                    const yPos = typeof y === "number" ? y : Number(y);

                                    return (
                                        <text x={xPos} y={yPos + 10} textAnchor="middle" fontSize={12}>
                                            {lines.slice(0, 2).map((line, i) => (
                                                <tspan key={line} x={xPos} dy={i === 0 ? 0 : 14}>
                                                    {line}
                                                </tspan>
                                            ))}
                                        </text>
                                    );
                                }}
                            />



                            <YAxis
                                tick={{ fontSize: 10, textAnchor: 'start' }}
                                dataKey={'value'}
                                width={50}
                                tickFormatter={getYAxisFormatter()}
                                padding={{ top: 10 }}
                            />

                            <Tooltip content={CustomTooltip} />

                            <Bar dataKey="value" name="درآمد سرویس" fill="#536DFE" radius={[12, 12, 12, 12]} >
                                {sanitizedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]} // repeat colors
                                    />
                                ))}
                            </Bar>
                        </BarChart>

                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
const CustomTooltip = ({ active, payload }: TooltipContentProps<ValueType, NameType>) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0]?.payload as BarItem | undefined;

    return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
            <p className="font-semibold text-gray-900 mb-2">
                {data?.label ? `${data.label}` : "نامشخص"}
            </p>

            <div className="space-y-2">
                <p className="text-sm flex items-center">
                    <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
                    تعداد بار: {data?.value ?? 0}
                </p>

                <hr className="my-2" />
            </div>
        </div>
    );
};
