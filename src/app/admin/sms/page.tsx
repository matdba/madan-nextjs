"use client";

import { SetStateAction, useCallback, useEffect, useState } from "react";
import { Bus, ChatRoundCheck, CheckCircle, CloseCircle, Filter, HashtagSquare, Magnifer, MapPoint, PhoneCallingRounded, Record, UserRounded } from "@solar-icons/react";
import toast from "react-hot-toast";
import CustomButton from "@/components/widgets/CustomButton";
import CustomDropdown from "@/components/widgets/CustomDropdown";
import CustomTextarea from "@/components/widgets/CustomTextarea";
import Pagination from "@/components/widgets/Pagination";
import { DriverListResponse } from "@/lib/schemas/driver-list.schema";
import { CityListType } from "@/lib/schemas/city-list.schema";
import { TruckListType } from "@/lib/schemas/truck-list.schema";

type SelectionMode = "all" | "manual";

export default function SmsPage() {
  const [driverListData, setDriverListData] = useState<DriverListResponse | null>(null);
  const [citiesData, setCitiesData] = useState<CityListType | null>(null);
  const [trucksData, setTrucksData] = useState<TruckListType | null>(null);

  const [listLoading, setListLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("manual");
  const [selectedDriverIds, setSelectedDriverIds] = useState<number[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [filteredCityId, setFilteredCityId] = useState(0);
  const [filteredTruckId, setFilteredTruckId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const drivers = driverListData?.data.drivers ?? [];
  const hasActiveFilters = searchTerm || filteredCityId !== 0 || filteredTruckId !== 0;

  const fetchDriverList = useCallback(async () => {
    try {
      setListLoading(true);
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      if (filteredCityId) params.set("city_id", String(filteredCityId));
      if (filteredTruckId) params.set("truck_id", String(filteredTruckId));
      if (currentPage > 1) params.set("page", String(currentPage));

      const driversResponse = await fetch(`/api/drivers?${params.toString()}`);

      if (!driversResponse.ok) {
        toast.error("خطا در دریافت اطلاعات");
        return;
      }

      const driversResult = await driversResponse.json();

      setDriverListData(driversResult);
    } catch (error) {
      console.error("sms page fetch error:", error);
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setListLoading(false);
    }
  }, [searchTerm, filteredCityId, filteredTruckId, currentPage]);

  useEffect(() => {
    fetchDriverList();
  }, [fetchDriverList]);

  useEffect(() => {
    async function fetchMeta() {
      try {
        const [citiesResponse, trucksResponse] = await Promise.all([
          fetch("/api/city-list"),
          fetch("/api/truck-list"),
        ]);

        if (!citiesResponse.ok || !trucksResponse.ok) {
          toast.error("خطا در دریافت اطلاعات");
          return;
        }

        const citiesResult = await citiesResponse.json();
        const trucksResult = await trucksResponse.json();
        setCitiesData(citiesResult);
        setTrucksData(trucksResult);
      } catch (error) {
        console.error("sms page meta fetch error:", error);
        toast.error("خطا در دریافت اطلاعات");
      }
    }

    fetchMeta();
  }, []);

  const clearFilters = () => {
    setSearchTerm("");
    setTempSearchTerm("");
    setFilteredCityId(0);
    setFilteredTruckId(0);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDriverToggle = (driverId: number, checked: boolean) => {
    if (selectionMode === "all") return;
    setSelectedDriverIds((prev) => {
      if (checked) {
        if (prev.includes(driverId)) return prev;
        return [...prev, driverId];
      }
      return prev.filter((id) => id !== driverId);
    });
  };

  const fetchAllFilteredDriverIds = async () => {
    const ids: number[] = [];
    const base = new URLSearchParams();
    if (searchTerm.trim()) base.set("search", searchTerm.trim());
    if (filteredCityId) base.set("city_id", String(filteredCityId));
    if (filteredTruckId) base.set("truck_id", String(filteredTruckId));

    let page = 1;
    let lastPage = 1;

    do {
      const params = new URLSearchParams(base.toString());
      if (page > 1) params.set("page", String(page));

      const response = await fetch(`/api/drivers?${params.toString()}`);
      if (!response.ok) {
        throw new Error("fetch drivers failed");
      }

      const result: DriverListResponse = await response.json();
      ids.push(...result.data.drivers.map((driver) => driver.id));
      lastPage = result.data.pagination.last_page_number || 1;
      page += 1;
    } while (page <= lastPage);

    return ids;
  };

  async function submitSms() {
    if (!message.trim()) {
      toast.error("متن پیام را وارد کنید");
      return;
    }

    try {
      setSending(true);
      const driverIds =
        selectionMode === "all" ? await fetchAllFilteredDriverIds() : selectedDriverIds;

      if (driverIds.length === 0) {
        toast.error("حداقل یک راننده را انتخاب کنید");
        return;
      }

      const response = await fetch("/api/drivers/send-sms", {
        method: "POST",
        body: JSON.stringify({
          drivers_ids: driverIds,
          message: message.trim(),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error((result?.error || result?.message || "خطا در ارسال پیامک") as string);
        return;
      }

      toast.success((result?.message || "پیامک با موفقیت ارسال شد") as string);
      setMessage("");
      if (selectionMode === "manual") setSelectedDriverIds([]);
    } catch (error) {
      console.error("send sms error:", error);
      toast.error("خطا در ارسال پیامک");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="container mx-auto px-0 py-3 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light">
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4 lg:order-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-5">
              <div className="relative">
                <button
                  onClick={() => {
                    setSearchTerm(tempSearchTerm);
                    setCurrentPage(1);
                  }}
                  className="absolute flex items-center justify-center h-10 w-10 p-2.5 inset-y-0 left-1 top-0.5 bg-tertiary/30 rounded-full z-10 hover:text-primary cursor-pointer"
                >
                  <Magnifer size={24} />
                </button>
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام، تلفن و پلاک..."
                  value={tempSearchTerm}
                  onChange={(e: { target: { value: SetStateAction<string> } }) => setTempSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearchTerm(tempSearchTerm);
                      setCurrentPage(1);
                    }
                  }}
                  className="block w-full pr-2 py-3 bg-background-light dark:bg-background-dark border border-gray-light dark:border-gray-dark rounded-full focus:border-primary text-sm placeholder:text-xs"
                  style={{ paddingLeft: "50px" }}
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <CustomDropdown
                value={filteredCityId}
                onChange={(value) => {
                  setFilteredCityId(parseInt(value.toString()));
                  setCurrentPage(1);
                }}
                placeholder="فیلتر شهر"
                icon={<MapPoint />}
                options={
                  citiesData
                    ? [{ value: 0, label: "همه" }, ...citiesData.data.map((city) => ({ value: city.id, label: city.name }))]
                    : []
                }
              />
            </div>

            <div className="md:col-span-4">
              <CustomDropdown
                value={filteredTruckId}
                onChange={(value) => {
                  setFilteredTruckId(parseInt(value.toString()));
                  setCurrentPage(1);
                }}
                placeholder="فیلتر ناوگان"
                icon={<Bus />}
                options={
                  trucksData
                    ? [{ value: 0, label: "همه" }, ...trucksData.data.map((truck) => ({ value: truck.id, label: truck.name }))]
                    : []
                }
              />
            </div>

          </div>

          <div className="flex items-center justify-between text-sm bg-background-light dark:bg-background-dark border border-gray-light dark:border-gray-dark rounded-3xl p-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={selectionMode === "all"}
              onClick={() => setSelectionMode((prev) => (prev === "all" ? "manual" : "all"))}
              className="flex items-center gap-2 cursor-pointer"
            >
              {selectionMode === "all" ? (
                <CheckCircle size={20} weight="Bold" className="text-primary" />
              ) : (
                <Record size={20} className="text-gray-400" />
              )}
              <span>انتخاب همه رانندگان (بر اساس فیلتر)</span>
            </button>
            <span className="text-xs text-gray-500">
              {selectionMode === "all"
                ? `تعداد انتخاب‌شده: ${driverListData?.data.pagination.total ?? 0}`
                : `تعداد انتخاب‌شده: ${selectedDriverIds.length}`}
            </span>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2 items-center text-xs">
                <Filter className="h-4 w-4 text-gray-500" />
                {searchTerm && <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">جستجو: {searchTerm}</span>}
                {filteredCityId !== 0 && (
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full">
                    شهر: {citiesData?.data.find((city) => city.id === filteredCityId)?.name}
                  </span>
                )}
                {filteredTruckId !== 0 && (
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full">
                    ناوگان: {trucksData?.data.find((truck) => truck.id === filteredTruckId)?.name}
                  </span>
                )}
              </div>
              <CustomButton
                onClick={clearFilters}
                title="حذف فیلترها"
                background="bg-red-400"
                icon={<CloseCircle size={18} />}
                minWidth="min-w-32"
                lowHeight
              />
            </div>
          )}

          <div className="border border-gray-light dark:border-gray-dark rounded-3xl overflow-hidden">
            <div className="relative max-h-[470px] overflow-auto divide-y divide-gray-light dark:divide-gray-dark">
              {drivers.length > 0 ? (
                drivers.map((driver) => {
                  const checked = selectionMode === "all" || selectedDriverIds.includes(driver.id);

                  return (
                    <div
                      key={driver.id}
                      className="flex items-center gap-3 p-3 hover:bg-secondary/10 transition-colors"
                      onClick={() => {
                        if (selectionMode === "all") return;
                        handleDriverToggle(driver.id, !checked);
                      }}
                    >
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        disabled={selectionMode === "all"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDriverToggle(driver.id, !checked);
                        }}
                        className="disabled:opacity-60 cursor-pointer"
                      >
                        {checked ? (
                          <CheckCircle size={20} weight="Bold" className="text-primary" />
                        ) : (
                          <Record size={20} className="text-gray-400" />
                        )}
                      </button>
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <UserRounded size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-sm font-medium">
                          {driver.user.name} {driver.user.last_name}
                        </p>
                        <div className="mt-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <PhoneCallingRounded size={14} />
                            <span>{driver.user.mobile_number}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <HashtagSquare size={14} />
                            <span>{driver.license_plate}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Bus size={14} />
                            <span>{driver.truck.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPoint size={14} />
                            <span>{driver.city.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : !listLoading ? (
                <div className="p-8 text-center text-sm text-gray-500">راننده‌ای برای انتخاب یافت نشد</div>
              ) : null}

              {listLoading && (
                <div className="absolute inset-0 bg-card-light/70 dark:bg-card-dark/70 backdrop-blur-[1px] flex items-center justify-center text-sm text-gray-500">
                  در حال بارگذاری لیست رانندگان...
                </div>
              )}
            </div>

            {driverListData && (
              <Pagination
                pageCount={driverListData.data.pagination.last_page_number}
                currentPage={driverListData.data.pagination.current_page_number}
                currentItemCount={driverListData.data.pagination.current_count}
                handlePageChange={handlePageChange}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-5 border border-gray-light dark:border-gray-dark rounded-3xl p-4 flex flex-col gap-4 lg:order-1">
          <div className="text-right">
            <p className="text-lg font-semibold">ارسال پیامک</p>
            <p className="text-xs text-gray-500 mt-1">متن پیام را وارد کنید و ارسال بزنید.</p>
          </div>

          <CustomTextarea
            value={message}
            setValue={setMessage}
            placeholder="متن پیام..."
            rows={12}
            maxLength={500}
            background="bg-background-light dark:bg-background-dark"
            handleAction={() => {
              if (!sending) submitSms();
            }}
          />

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{message.length} / 500</span>
            <span>
              {selectionMode === "all" ? "ارسال به همه رانندگان فیلترشده" : "ارسال به رانندگان انتخاب‌شده"}
            </span>
          </div>

          <CustomButton
            onClick={submitSms}
            title="ارسال پیامک"
            icon={<ChatRoundCheck size={18} />}
            loading={sending}
            disabled={
              sending ||
              !message.trim() ||
              (selectionMode === "manual" && selectedDriverIds.length === 0) ||
              (selectionMode === "all" && (driverListData?.data.pagination.total ?? 0) === 0)
            }
            minWidth="w-full"
          />
        </div>
      </div>
    </section>
  );
}
