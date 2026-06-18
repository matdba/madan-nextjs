"use client";

import { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import CustomDropdown from "../widgets/CustomDropdown";

/* ---------------------- TYPES ---------------------- */

export type RevenueItem = {
    operatorName?: string;
    cargosAdded?: number;
};

export type TimePeriod = "DAILY" | "WEEKLY" | "MONTHLY";

interface RevenueChartProps {
    data?: RevenueItem[];
    currentPeriod?: string;
    onPeriodChange?: (p: string) => void;
}

/* ---------------------- CONSTANTS ---------------------- */

const timePeriodFilters = [
    { value: "DAILY", label: "روزانه" },
    { value: "WEEKLY", label: "هفتگی" },
    { value: "MONTHLY", label: "ماهانه" },
];

/* ---------------------- COMPONENT ---------------------- */


type OperatorCargoTooltipProps = {
    active?: boolean;
    payload?: Array<{ payload: RevenueItem }>;
};

const CustomTooltip = ({ active, payload }: OperatorCargoTooltipProps) => {
    if (!active || !payload?.length) {
        return null;
    }

    const data = payload[0].payload;

    return (
        <div className="bg-background-dark dark:bg-background-dark p-4 border border-gray-200 rounded-lg shadow-lg">
            <p className="font-semibold text-gray-900 mb-2">
                {data.operatorName || 'نامشخص'}
            </p>

            <div className="space-y-2">
                <p className="text-sm flex items-center">
                    <span className="inline-block w-3 h-3 bg-primary dark:bg-indigo-400 rounded-full mr-2"></span>
                    تعداد بار ثبت شده: {(data?.cargosAdded || 0).toLocaleString("fa-IR")}
                </p>
            </div>
        </div>
    );
};

export default function RevenueChart({
    data = [],
    onPeriodChange,
    currentPeriod = "DAILY",
}: RevenueChartProps) {
    const [selectedPeriod, setSelectedPeriod] =
        useState<string>(currentPeriod);

    /* ---------------------- SANITIZE DATA ---------------------- */

    const sanitizedData = useMemo<RevenueItem[]>(() => {
        if (!Array.isArray(data) || data.length === 0) return [];

        return data.map((item, index) => ({
            operatorName: item?.operatorName || `متصدی ${index + 1}`,
            cargosAdded: Number(item?.cargosAdded) || 0,
        }));
    }, [data]);

    /* ---------------------- PERIOD CHANGE ---------------------- */

    const handlePeriodChange = (newPeriod: string) => {
        setSelectedPeriod(newPeriod);
        onPeriodChange?.(newPeriod);
    };

    /* ---------------------- FORMATTERS ---------------------- */

    const formatNumber = (num: number | string) => {
        const n = Number(num) || 0;
        return new Intl.NumberFormat("fa-IR").format(n);
    };

    const getYAxisFormatter = () => {
        if (!sanitizedData.length) return (value: number) => formatNumber(value);
        return (v: number) => formatNumber(v);
    };

    /* ---------------------- SUMMARY ---------------------- */

    const summaryStats = useMemo(() => {
        if (!sanitizedData.length)
            return {
                totalCargosAdded: 0,
                topOperator: "نامشخص",
                topOperatorCargos: 0,
            };

        const topOperator = sanitizedData.reduce((top, item) => (
            (item.cargosAdded || 0) > (top.cargosAdded || 0) ? item : top
        ), sanitizedData[0]);

        return {
            totalCargosAdded: sanitizedData.reduce((sum, item) => sum + (item.cargosAdded || 0), 0),
            topOperator: topOperator.operatorName || "نامشخص",
            topOperatorCargos: topOperator.cargosAdded || 0,
        };
    }, [sanitizedData]);

    /* ---------------------- RENDER ---------------------- */

    return (
        <div className="w-full min-w-0 text-center bg-card-light dark:bg-card-dark border border-gray-light dark:border-gray-dark rounded-3xl p-4" dir="rtl">
            <p className="font-semibold text-base">بارهای ثبت شده توسط متصدیان</p>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                <div className="grid grid-cols-1 gap-2 text-right sm:grid-cols-2 md:flex md:flex-1 md:items-center">
                    <div className="flex gap-2 items-center md:flex-1">
                        <p className="text-gray-400">کل بارهای ثبت شده:</p>
                        <p className="text-sm font-medium">{formatNumber(summaryStats.totalCargosAdded)}</p>
                    </div>

                    <div className="flex gap-2 items-center md:flex-1">
                        <p className="text-gray-400">بیشترین ثبت:</p>
                        <p className="text-sm font-medium">{summaryStats.topOperator} ({formatNumber(summaryStats.topOperatorCargos)})</p>
                    </div>
                </div>

                <div className="flex justify-start md:shrink-0">
                    <CustomDropdown
                        options={timePeriodFilters}
                        value={selectedPeriod}
                        onChange={(val: string | number) => handlePeriodChange(val as string)}
                        background="bg-background-light dark:bg-background-dark"
                    />
                </div>
            </div>

            <div className="h-80 w-full min-w-0">
                {!sanitizedData.length ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%" style={{ direction: 'rtl' }}>
                        <BarChart
                            data={sanitizedData}
                            margin={{ top: 0, right: 0, left: 0, bottom: 8 }}
                            barGap={8}
                            barCategoryGap="20%"
                            className="h-80 w-full min-w-0 [--revenue-bar-fill:#536DFE] dark:[--revenue-bar-fill:#818CF8]"
                        >
                            <XAxis dataKey="operatorName" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} height={38} />
                            <YAxis
                                tick={{ fontSize: 10, textAnchor: 'start' }}
                                width={36}
                                tickFormatter={getYAxisFormatter()}
                                padding={{ top: 10 }}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            <Bar dataKey="cargosAdded" name="تعداد بار ثبت شده" fill="var(--revenue-bar-fill)" radius={[12, 12, 12, 12]} />
                        </BarChart>

                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
