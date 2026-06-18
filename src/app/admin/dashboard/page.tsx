'use client';

import CustomBarChart from "@/components/widgets/BarChart";
import DonutChart, { DonutDataItem } from "@/components/widgets/DonutChart";
import RevenueChart, { RevenueItem } from "@/components/widgets/RevenueChart";
import { BoxMinimalistic, ClockCircle, UserCheckRounded, UsersGroupRounded } from "@solar-icons/react";
import { useState } from "react";

type DashboardStats = {
  totalCargos: number;
  todayCargos: number;
  drivers: number;
  operators: number;
};

type DashboardPeriod = "DAILY" | "WEEKLY" | "MONTHLY";

const operatorCargoChartData: Record<DashboardPeriod, RevenueItem[]> = {
  DAILY: [
    { operatorName: "رضایی", cargosAdded: 18 },
    { operatorName: "احمدی", cargosAdded: 14 },
    { operatorName: "محمدی", cargosAdded: 11 },
    { operatorName: "کریمی", cargosAdded: 9 },
    { operatorName: "کاظمی", cargosAdded: 7 },
    { operatorName: "نادری", cargosAdded: 6 },
    { operatorName: "صادقی", cargosAdded: 6 },
    { operatorName: "جعفری", cargosAdded: 5 },
    { operatorName: "موسوی", cargosAdded: 5 },
    { operatorName: "مرادی", cargosAdded: 4 },
    { operatorName: "یوسفی", cargosAdded: 4 },
    { operatorName: "عباسی", cargosAdded: 3 },
  ],
  WEEKLY: [
    { operatorName: "رضایی", cargosAdded: 96 },
    { operatorName: "احمدی", cargosAdded: 84 },
    { operatorName: "محمدی", cargosAdded: 73 },
    { operatorName: "کریمی", cargosAdded: 61 },
    { operatorName: "کاظمی", cargosAdded: 52 },
    { operatorName: "نادری", cargosAdded: 48 },
    { operatorName: "صادقی", cargosAdded: 43 },
    { operatorName: "جعفری", cargosAdded: 39 },
    { operatorName: "موسوی", cargosAdded: 35 },
    { operatorName: "مرادی", cargosAdded: 31 },
    { operatorName: "یوسفی", cargosAdded: 28 },
    { operatorName: "عباسی", cargosAdded: 24 },
  ],
  MONTHLY: [
    { operatorName: "رضایی", cargosAdded: 382 },
    { operatorName: "احمدی", cargosAdded: 344 },
    { operatorName: "محمدی", cargosAdded: 298 },
    { operatorName: "کریمی", cargosAdded: 246 },
    { operatorName: "کاظمی", cargosAdded: 221 },
    { operatorName: "نادری", cargosAdded: 198 },
    { operatorName: "صادقی", cargosAdded: 176 },
    { operatorName: "جعفری", cargosAdded: 159 },
    { operatorName: "موسوی", cargosAdded: 141 },
    { operatorName: "مرادی", cargosAdded: 126 },
    { operatorName: "یوسفی", cargosAdded: 112 },
    { operatorName: "عباسی", cargosAdded: 97 },
  ],
};

const fakeDashboardStats: DashboardStats = {
  totalCargos: 1280,
  todayCargos: operatorCargoChartData.DAILY.reduce((total, operator) => total + (operator.cargosAdded ?? 0), 0),
  drivers: 420,
  operators: operatorCargoChartData.DAILY.length,
};

const fakeTopDestinations: Record<string, number> = {
  تهران: 285,
  اصفهان: 214,
  مشهد: 188,
  شیراز: 142,
  تبریز: 116,
};

const fakeTopTrucks: Record<string, number> = {
  تریلی: 342,
  کامیون: 276,
  خاور: 194,
  کمپرسی: 168,
  تانکر: 132,
};

const fakeTopCargoOwners: Record<string, number> = {
  "شرکت پارس بار": 248,
  "سیمان شرق": 196,
  "نفت سپهر": 174,
  "زرین تجارت": 139,
  "فولاد آریا": 118,
};



export default function Home() {
  const [currentPeriod, setCurrentPeriod] = useState<DashboardPeriod>("DAILY");
  const stats = fakeDashboardStats;

  const handlePeriodChange = (newPeriod: string) => {
    setCurrentPeriod(newPeriod as DashboardPeriod);
  };

  const [donutData] = useState<DonutDataItem[]>([
    { name: 'سوخت و فرآورده نفتی', value: 340 },
    { name: 'سیمان و مصالح', value: 270 },
    { name: 'مواد غذایی', value: 230 },
    { name: 'محصولات کشاورزی', value: 185 },
    { name: 'فلزات و آهن‌آلات', value: 145 },
    { name: 'سایر بارها', value: 110 },
  ]);

  const statCards = [
    {
      label: "بارهای ثبت شده کل",
      value: stats.totalCargos,
      icon: <BoxMinimalistic size={28} className="text-card-light" />,
    },
    {
      label: "بارهای ثبت شده امروز",
      value: stats.todayCargos,
      icon: <ClockCircle size={28} className="text-card-light" />,
    },
    {
      label: "تعداد رانندگان",
      value: stats.drivers,
      icon: <UsersGroupRounded size={28} className="text-card-light" />,
    },
    {
      label: "تعداد متصدیان",
      value: stats.operators,
      icon: <UserCheckRounded size={28} className="text-card-light" />,
    },
  ];



  return (
    <>
      <section className="container mx-auto py-3">
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="flex gap-2 items-center bg-card-light dark:bg-card-dark p-4
              border border-gray-light dark:border-gray-dark rounded-4xl"
            >
              <div className="bg-primary dark:bg-indigo-400 rounded-full p-4">
                {card.icon}
              </div>
              <div className="flex flex-col gap-1 justify-start items-start">
                <p className="text-gray-400">{card.label}</p>
                <p className="text-base font-semibold">{card.value.toLocaleString("fa-IR")}</p>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="flex items-center gap-4 mb-8">

          <div className="flex-1 flex-col items-center gap-2 bg-card-light dark:bg-card-dark
                      border border-gray-light dark:border-gray-dark p-2 rounded-3xl">
            <div className="flex items-center justify-between">
              <p className="text-base font-medium p-3">سرویس‌های اخیر</p>
              <div className="flex gap-1 items-center text-primary">
                <p className="font-medium">مشاهده بیشتر</p>
                <AltArrowLeft size={18} />
              </div>
            </div>
            {services && services.map((service, index) => (
              <div key={index}
                className=
                {`flex items-center justify-between gap-1 text-xs p-2
                            ${index === services.length - 1 ? '' : 'border-b border-gray-light dark:border-gray-dark'}
                          `}>
                <div className="flex items-center gap-2">
                  {getServiceIcon(service.type)}
                  {service.name}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{service.price?.toLocaleString()} تومان</span>
                  <p className="text-xs text-gray-500">({service.time})</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 flex-col items-center gap-2 bg-card-light dark:bg-card-dark
                                 border border-gray-light dark:border-gray-dark p-2 rounded-3xl">
            <div className="flex items-center justify-between">
              <p className="text-base font-medium p-3">فروش‌های اخیر</p>
              <div className="flex gap-1 items-center text-primary">
                <p className="font-medium">مشاهده بیشتر</p>
                <AltArrowLeft size={18} />
              </div>
            </div>            {shopItems.map((shopItem, index) => (
              <div key={index}
                className=
                {`flex items-center justify-between gap-1 text-xs p-2
                                      ${index === shopItems.length - 1 ? '' : 'border-b border-gray-light dark:border-gray-dark'}
                                    `}>
                <div className="flex flex-3 items-center gap-2">
                  {getShopItemIcon(shopItem.type)}
                  {shopItem.name}
                </div>
                <div className="flex items-center gap-2">
                  <div className="min-w-5 text-xs">{shopItem.quantity}x</div>
                  <span className="font-medium">{shopItem.price.toLocaleString()} تومان</span>
                  <p className="text-xs text-gray-500">({shopItem.time})</p>
                </div>
              </div>
            ))}

          </div>
        </div> */}

        <div className="grid grid-cols-1 items-stretch gap-3 mb-8 lg:grid-cols-4">
          <div className="min-w-0 lg:col-span-3">
            <RevenueChart
              data={operatorCargoChartData[currentPeriod]}
              // data={chartLoading ? [] : chartData}
              onPeriodChange={handlePeriodChange}
              currentPeriod={currentPeriod}
            />
          </div>

          <div className="min-w-0 lg:col-span-1">
            <DonutChart
              data={donutData}
              title="نوع بارهای انجام شده"
            />
          </div>

        </div>

        <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-3">
          <div className="min-w-0">
            <CustomBarChart
              data={fakeTopDestinations}
              title={"پربارترین مقصدها"}
            />
          </div>

          <div className="min-w-0">
            <CustomBarChart
              data={fakeTopTrucks}
              title={"پراستفاده ترین ناوها"}
            />
          </div>

          <div className="min-w-0">
            <CustomBarChart
              data={fakeTopCargoOwners}
              title={"پربارترین صاحبان بار"}
            />
          </div>


          {/* <div className="flex-1">
            <DonutChart
              data={donutData}
              title="آیتم های پرفروش"
            />
          </div> */}

        </div>
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <CustomLineChart
              data={chartData}
              // data={chartLoading ? [] : chartData}
              onPeriodChange={handlePeriodChange}
              currentPeriod={currentPeriod}
            />
          </div>
        </div> */}
      </section>
    </>
  );
}
