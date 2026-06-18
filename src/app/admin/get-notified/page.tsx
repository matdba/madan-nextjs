"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import {
  AddSquare,
  ArrowDown,
  ArrowUp,
  Bus,
  CloseCircle,
  Filter,
  Magnifer,
  MagniferZoomIn,
  MapPoint,
  NotificationUnread,
  SortVertical,
  TrashBinMinimalistic,
} from "@solar-icons/react";
import toast from "react-hot-toast";

import CustomButton from "@/components/widgets/CustomButton";
import CustomDropdown from "@/components/widgets/CustomDropdown";
import Pagination from "@/components/widgets/Pagination";
import TableShimmer from "@/components/shimmers/TableShimmer";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import ConfirmDialog from "@/components/drawers/ConfirmDialog";

import { CityListType } from "@/lib/schemas/city-list.schema";
import { TruckListType } from "@/lib/schemas/truck-list.schema";
import { GetNotifiedListType } from "@/lib/schemas/get-notified.schema";

type ColumnHeadProps = {
  id: string;
  name: string;
  percent: number;
  textRight: boolean;
  sortable: boolean;
};

const columnHeads: Array<ColumnHeadProps> = [
  { id: "driver", name: "راننده", percent: 20, textRight: false, sortable: false },
  { id: "loading", name: "مبدا", percent: 20, textRight: false, sortable: false },
  { id: "discharging", name: "مقصد", percent: 20, textRight: false, sortable: false },
  { id: "truck", name: "ناوگان", percent: 20, textRight: false, sortable: false },
  { id: "created_at", name: "زمان ثبت", percent: 15, textRight: false, sortable: false },
  { id: "actions", name: "", percent: 5, textRight: false, sortable: false },
];

type GetNotifiedResponse = GetNotifiedListType;

function formatJalaliDateTime(value?: string | number | Date | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function GetNotifiedPage() {
  const [data, setData] = useState<GetNotifiedResponse | null>(null);
  const [citiesData, setCitiesData] = useState<CityListType | null>(null);
  const [trucksData, setTrucksData] = useState<TruckListType | null>(null);
  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false);
  const [deletionLoading, setDeletionLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [tempSearchTerm, setTempSearchTerm] = useState(searchParams.get("search") || "");

  const currentSortBy = searchParams.get("sort_by") || "";
  const currentSortDir = searchParams.get("dir") || "";
  const filteredLoadingCityId = Number(searchParams.get("loading_city_id") ?? 0);
  const filteredDischargingCityId = Number(searchParams.get("discharging_city_id") ?? 0);
  const filteredTruckId = Number(searchParams.get("truck_id") ?? 0);

  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const listResponse = await fetch(`/api/get-notified?${searchParams}`);
      const citiesResponse = await fetch("/api/city-list");
      const trucksResponse = await fetch("/api/truck-list");

      if (!listResponse.ok || !citiesResponse.ok || !trucksResponse.ok) {
        toast.error("خطا در دریافت اطلاعات");
        return;
      }

      const listResult = await listResponse.json();
      const citiesResult = await citiesResponse.json();
      const trucksResult = await trucksResponse.json();

      setData(listResult);
      setCitiesData(citiesResult);
      setTrucksData(trucksResult);
    } catch (error) {
      console.error("Error fetching get-notified data:", error);
      toast.error("خطا در دریافت اطلاعات داشبورد");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  async function deleteItem() {
    if (!selectedId) return;

    try {
      setDeletionLoading(true);
      const response = await fetch(`/api/get-notified/${selectedId}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        toast.error((result?.error || result?.message || "خطا در حذف مورد") as string);
        return;
      }

      toast.success(result?.message || "با موفقیت حذف شد");
      setDeletionDialogOpen(false);
      setSelectedId(null);
      await fetchData();
    } catch (error) {
      console.error("Error deleting get-notified:", error);
      toast.error("خطا در حذف مورد");
    } finally {
      setDeletionLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [searchParams, fetchData]);

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setTempSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const updateFilters = (
    search: string,
    loading_city_id: number,
    discharging_city_id: number,
    truck_id: number
  ) => {
    const params = new URLSearchParams();

    params.delete("page");

    if (search && search.trim()) {
      params.set("search", search.trim());
    }

    if (loading_city_id) {
      params.set("loading_city_id", loading_city_id.toString());
    }

    if (discharging_city_id) {
      params.set("discharging_city_id", discharging_city_id.toString());
    }

    if (truck_id) {
      params.set("truck_id", truck_id.toString());
    }

    if (currentSortBy) {
      params.set("sort_by", currentSortBy);
      params.set("dir", currentSortDir);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const updateSorting = (sortBy: string, sortDirection: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");

    if (sortBy && sortDirection) {
      params.set("sort_by", sortBy);
      params.set("dir", sortDirection);
    } else {
      params.delete("sort_by");
      params.delete("dir");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSearchInputChange = (e: { target: { value: SetStateAction<string> } }) => {
    setTempSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchTerm(tempSearchTerm);
    updateFilters(tempSearchTerm, filteredLoadingCityId, filteredDischargingCityId, filteredTruckId);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTempSearchTerm("");
    router.push("/get-notified", { scroll: false });
  };

  const hasActiveFilters =
    searchTerm ||
    filteredLoadingCityId !== 0 ||
    filteredDischargingCityId !== 0 ||
    filteredTruckId !== 0;
  const hasActiveSorting = currentSortBy && currentSortDir;
  const cities = Array.isArray(citiesData?.data) ? citiesData.data : [];
  const trucks = Array.isArray(trucksData?.data) ? trucksData.data : [];
  const cityOptions = [
    { value: 0, label: "همه" },
    ...cities.map((city) => ({
      value: city.id,
      label: city.name,
    })),
  ];
  const truckOptions = [
    { value: 0, label: "همه" },
    ...trucks.map((truck) => ({
      value: truck.id,
      label: truck.name,
    })),
  ];

  const requestSort = (key: string) => {
    if (!columnHeads.find((col) => col.id === key)?.sortable) return;

    let direction = "asc";

    if (currentSortBy === key) {
      if (currentSortDir === "asc") {
        direction = "desc";
      } else if (currentSortDir === "desc") {
        updateSorting("", "");
        return;
      }
    }

    updateSorting(key, direction);
  };

  const getSortIcon = (columnId: string) => {
    if (!columnHeads.find((col) => col.id === columnId)?.sortable) {
      return null;
    }

    if (currentSortBy === columnId) {
      return currentSortDir === "asc" ? (
        <ArrowUp size={14} className="text-primary" />
      ) : (
        <ArrowDown size={14} className="text-primary" />
      );
    }

    return <SortVertical size={18} className="text-gray-500" />;
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (loading) {
    return <TableShimmer columnHeads={columnHeads} />;
  }

  return (
    <>
      <section className="container mx-auto px-0 py-3 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-3">
              <div className="relative flex-1">
                <button
                  onClick={handleSearchSubmit}
                  className="absolute flex items-center justify-center h-10 w-10 p-2.5 inset-y-0
                    left-1 top-0.5 bg-tertiary/30 rounded-full z-10 hover:text-primary cursor-pointer"
                >
                  <Magnifer size={24} />
                </button>
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام ..."
                  value={tempSearchTerm}
                  onChange={handleSearchInputChange}
                  onKeyDown={(e) => (e.key === "Enter" ? handleSearchSubmit() : null)}
                  className="block w-full pr-2 py-3 bg-background-light dark:bg-background-dark border border-gray-light dark:border-gray-dark
                    rounded-full focus:border-primary text-sm placeholder:text-xs"
                  style={{ paddingLeft: "50px" }}
                />
              </div>
            </div>

            <div className="lg:col-span-1" />

            <div className="lg:col-span-2">
              <CustomDropdown
                value={filteredLoadingCityId}
                onChange={(value) => {
                  if (value !== filteredLoadingCityId)
                    updateFilters(
                      tempSearchTerm,
                      parseInt(value.toString()),
                      parseInt(filteredDischargingCityId.toString()),
                      parseInt(filteredTruckId.toString())
                    );
                }}
                placeholder="فیلتر مبدا"
                icon={<MapPoint />}
                options={cityOptions}
              />
            </div>

            <div className="lg:col-span-2">
              <CustomDropdown
                value={filteredDischargingCityId}
                onChange={(value) => {
                  if (value !== filteredDischargingCityId)
                    updateFilters(
                      tempSearchTerm,
                      parseInt(filteredLoadingCityId.toString()),
                      parseInt(value.toString()),
                      parseInt(filteredTruckId.toString())
                    );
                }}
                placeholder="فیلتر مقصد"
                icon={<MapPoint />}
                options={cityOptions}
              />
            </div>

            <div className="lg:col-span-2">
              <CustomDropdown
                value={filteredTruckId}
                onChange={(value) => {
                  if (value !== filteredTruckId)
                    updateFilters(
                      tempSearchTerm,
                      parseInt(filteredLoadingCityId.toString()),
                      parseInt(filteredDischargingCityId.toString()),
                      parseInt(value.toString())
                    );
                }}
                placeholder="فیلتر ناوگان"
                icon={<Bus />}
                options={truckOptions}
              />
            </div>

            <div className="lg:col-span-2 flex justify-end">
              <CustomButton
                onClick={() => router.push("/get-notified/new")}
                title="ثبت جدید"
                icon={<AddSquare size={18} />}
              />
            </div>
          </div>

          {(hasActiveFilters || hasActiveSorting) && (
            <div className="mt-4 pt-4 border-t border-gray-light dark:border-gray-dark">
              <div className="flex flex-wrap gap-2 items-center">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="font-medium">فیلترهای فعال:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    جستجو: {searchTerm}
                  </span>
                )}
                {filteredLoadingCityId !== 0 && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                    مبدا: {cities.find((opt) => opt.id === filteredLoadingCityId)?.name}
                  </span>
                )}
                {filteredDischargingCityId !== 0 && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-red-400/10 text-red-400 rounded-full text-xs font-medium">
                    مقصد: {cities.find((opt) => opt.id === filteredDischargingCityId)?.name}
                  </span>
                )}
                {filteredTruckId !== 0 && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-medium">
                    ناوگان: {trucks.find((opt) => opt.id === filteredTruckId)?.name}
                  </span>
                )}
                {hasActiveSorting && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                    مرتب‌سازی: {columnHeads.find((col) => col.id === currentSortBy)?.name}(
                    {currentSortDir === "asc" ? "صعودی" : "نزولی"})
                  </span>
                )}
                <div className="lg:col-span-1">
                  {(hasActiveFilters || hasActiveSorting) && (
                    <CustomButton
                      onClick={clearFilters}
                      title="حذف فیلترها"
                      background="bg-red-400"
                      lowHeight={true}
                      icon={<CloseCircle size={18} />}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto px-4">
          <table className="min-w-full rounded-full">
            <thead className="bg-background-light dark:bg-background-dark rounded-full text-gray-500">
              <tr>
                {columnHeads.map((head, index) => (
                  <th
                    key={head.id}
                    scope="col"
                    className={`px-6 py-4 w-[${head.percent}%]
                      text-xs font-semibold uppercase tracking-wider hover:rounded-full
                      ${head.sortable ? "cursor-pointer hover:bg-secondary/20" : ""}
                      ${index === 0 ? "rounded-r-full" : ""}
                      ${index === columnHeads.length - 1 ? "rounded-l-full" : ""}
                    `}
                    onClick={() => head.sortable && requestSort(head.id)}
                  >
                    <div
                      className={`flex items-center gap-2 ${head.textRight ? "justify-start" : "justify-center"
                        }`}
                    >
                      {head.name}
                      {getSortIcon(head.id)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-light dark:divide-gray-dark">
              {data && data.data.let_me_knows.length > 0 ? (
                data.data.let_me_knows.map((item) => (
                  <tr
                    className="hover:bg-secondary/20 hover:rounded-full transition-colors group"
                    key={item.id}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ml-3">
                          <span className="text-sm font-medium text-primary">
                            {(item.user?.name ?? "").charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{(item.user?.name ?? "-") + " " + (item.user?.last_name ?? "")}</div>
                          {item.user?.mobile_number && (
                            <div className="text-xs text-gray-500">{item.user.mobile_number}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="bg-green-100 rounded-full text-green-400">
                        {item.loading_city?.name ?? "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="bg-red-50 rounded-full text-red-400">
                        {item.discharging_city?.name ?? "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div>{item.truck?.name ?? "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div>{formatJalaliDateTime(item.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        onClick={() => {
                          setSelectedId(item.id);
                          setDeletionDialogOpen(true);
                          useBreadcrumbStore.getState().setName(item.user?.name ?? "");
                        }}
                      >
                        <TrashBinMinimalistic size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columnHeads.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-background-dark border border-transparent dark:border-gray-dark rounded-full flex items-center justify-center mb-4">
                        {hasActiveFilters ? (
                          <MagniferZoomIn className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <NotificationUnread className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-card-dark dark:text-card-light mb-1">
                        {hasActiveFilters ? "نتیجه‌ای یافت نشد" : "هیچ درخواست اطلاع‌رسانی یافت نشد"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {hasActiveFilters ? "لطفاً فیلترهای خود را تغییر دهید" : "هنوز درخواست اطلاع‌رسانی باری ثبت نشده است"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && data && data.data.let_me_knows.length > 0 && (
          <Pagination
            pageCount={1}
            currentPage={1}
            currentItemCount={data.data.let_me_knows.length}
            handlePageChange={handlePageChange}
          />
        )}
      </section>

      <ConfirmDialog
        isOpen={deletionDialogOpen}
        onClose={() => setDeletionDialogOpen(false)}
        onConfirm={deleteItem}
        title="حذف با خبر شو"
        message="آیا از حذف این مورد اطمینان دارید؟ این عملیات غیرقابل بازگشت است!"
        isDestructive={true}
        loading={deletionLoading}
      />
    </>
  );
}
