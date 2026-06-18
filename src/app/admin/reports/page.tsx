"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import {
  AddSquare,
  AltArrowLeft,
  ArrowDown,
  ArrowUp,
  Card2,
  CloseCircle,
  Filter,
  Magnifer,
  PhoneCallingRounded,
  SortVertical,
  UserRounded,
  WalletMoney,
} from "@solar-icons/react";
import CustomButton from "@/components/widgets/CustomButton";
import LeftDrawer from "@/components/drawers/LeftDrawer";
import CustomInput from "@/components/widgets/CustomInput";
import CustomDropdown from "@/components/widgets/CustomDropdown";

const columnHeads = [
  { id: "name", name: "مشتری", percent: 25, textRight: false, sortable: true },
  { id: "totalCost", name: "مبلغ فاکتور", percent: 15, textRight: false, sortable: true },
  { id: "tip", name: "انعام", percent: 15, textRight: false, sortable: true },
  { id: "date", name: "تاریخ", percent: 20, textRight: false, sortable: true },
  { id: "serviceCount", name: "سرویس‌ها", percent: 10, textRight: false, sortable: true },
  { id: "shopItemCount", name: "اقلام", percent: 10, textRight: false, sortable: true },
  { id: "actions", name: "", percent: 5, textRight: false, sortable: false },
];

export default function ReportsPage() {
  const [formData, setFormData] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    vehicleType: "",
    plaque: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [tempSearchTerm, setTempSearchTerm] = useState(searchParams.get("search") || "");

  const [addCustomerDrawerOpen, setAddCustomerDrawerOpen] = useState(false);


  // Get sorting from URL params
  const currentSortBy = searchParams.get("sortBy") || "";
  const currentSortDirection = searchParams.get("sortDirection") || "";
  // const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => { }, [searchParams]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchTerm(searchParams.get("search") || "");
    setTempSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const updateFilters = (newFilters: { search: string }) => {
    const params = new URLSearchParams();

    params.delete("page"); // Reset to first page when filtering

    if (newFilters.search && newFilters.search.trim()) {
      params.set("search", newFilters.search.trim());
    }

    if (currentSortBy) {
      params.set("sortBy", currentSortBy);
      params.set("sortDirection", currentSortDirection);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const updateSorting = (sortBy: string, sortDirection: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page"); // Reset to first page when sorting

    if (sortBy && sortDirection) {
      params.set("sortBy", sortBy);
      params.set("sortDirection", sortDirection);
    } else {
      params.delete("sortBy");
      params.delete("sortDirection");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSearchInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setTempSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchTerm(tempSearchTerm);
    updateFilters({
      search: tempSearchTerm,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTempSearchTerm("");
    router.push("/users", { scroll: false });
  };

  const hasActiveFilters = searchTerm;
  const hasActiveSorting = currentSortBy && currentSortDirection;

  const requestSort = (key: string) => {
    if (!columnHeads.find((col) => col.id === key)?.sortable) return;

    let direction = "asc";

    if (currentSortBy === key) {
      if (currentSortDirection === "asc") {
        direction = "desc";
      } else if (currentSortDirection === "desc") {
        // Third click - reset to default (no sorting)
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
      return currentSortDirection === "asc" ? (
        <ArrowUp size={14} className="text-primary" />
      ) : (
        <ArrowDown size={14} className="text-primary" />
      );
    }

    return <SortVertical size={18} className="text-gray-500" />;
  };

  return (
    <>
      <section className="flex flex-col container mx-auto gap-8  text-background-dark dark:text-background-light">
        <div className="p-2 bg-card-light dark:bg-card-dark rounded-4xl">
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <CustomDropdown
                options={[{ label: '1404/09/01', value: '1404/09/01' }]}
                value={'1404/09/01'}
                onChange={() => { }}
                placeholder="تاریخ شروع"
                background="bg-background-light dark:bg-background-dark"
              />
            </div>
            <div className="flex-1">
              <CustomDropdown
                options={[{ label: '1404/09/30', value: '1404/09/30' }]}
                value={'1404/09/30'}
                onChange={() => { }}
                placeholder="تاریخ پایان"
                background="bg-background-light dark:bg-background-dark"
              />
            </div>

            <CustomButton
              onClick={() => setAddCustomerDrawerOpen(true)}
              title="جستجو"
              icon={<Magnifer size={18} />}
            />

          </div>


          <div className="flex items-center gap-4 mt-6">
            <div className="flex flex-1 gap-2 items-center bg-secondary/10 p-1.5
              border border-gray-light dark:border-gray-dark rounded-full">
              <div className="bg-secondary rounded-full p-2">
                <WalletMoney size={20} className="text-card-dark" />
              </div>
              <p className="text-gray-400">تعداد:</p>
              <p className="text-base font-semibold">543<span className="text-xs font-medium">فاکتور</span></p>
            </div>

            <div className="flex flex-1 gap-2 items-center bg-secondary/10 p-1.5
              border border-gray-light dark:border-gray-dark rounded-full">
              <div className="bg-secondary rounded-full p-2">
                <WalletMoney size={20} className="text-card-dark" />
              </div>
              <p className="text-gray-400">سرویس:</p>
              <p className="text-base font-semibold">{(23500000).toLocaleString()} <span className="text-xs font-medium">تومان</span></p>
            </div>

            <div className="flex flex-1 gap-2 items-center bg-secondary/10 p-1.5
              border border-gray-light dark:border-gray-dark rounded-full">
              <div className="bg-secondary rounded-full p-2">
                <WalletMoney size={20} className="text-card-dark" />
              </div>
              <p className="text-gray-400">فروشگاه:</p>
              <p className="text-base font-semibold">{(3500000).toLocaleString()} <span className="text-xs font-medium">تومان</span></p>
            </div>

            <div className="flex flex-1 gap-2 items-center bg-secondary/10 p-1.5
              border border-gray-light dark:border-gray-dark rounded-full">
              <div className="bg-secondary rounded-full p-2">
                <WalletMoney size={20} className="text-card-dark" />
              </div>
              <p className="text-gray-400">جمع کل:</p>
              <p className="text-base font-semibold">{(27000000).toLocaleString()} <span className="text-xs font-medium">تومان</span></p>
            </div>

          </div>

        </div>
        <div className="bg-card-light dark:bg-card-dark rounded-4xl">
          {/* Filters Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Search Bar */}
              <div className="lg:col-span-4">
                {/* <label className="block text-sm font-medium text-secondary mb-2">جستجو</label> */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <button
                      onClick={handleSearchSubmit}
                      className="absolute flex items-center justify-center h-10 w-10 p-2.5 inset-y-0 left-1 top-0.5 bg-tertiary/30 rounded-full z-10"
                    >
                      <Magnifer size={24} />
                    </button>
                    <input
                      type="text"
                      placeholder="جستجو بر اساس نام و شماره تماس..."
                      value={tempSearchTerm}
                      // onKeyPress={handleSearchSubmit}
                      onChange={handleSearchInputChange}
                      className="block w-full pr-2 py-3 bg-background-light dark:bg-background-dark border border-gray-light dark:border-gray-dark
                      rounded-full focus:border-primary text-sm"
                      style={{ paddingLeft: "50px" }}
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="lg:col-span-2">
                {(hasActiveFilters || hasActiveSorting) && (
                  <CustomButton
                    onClick={clearFilters}
                    title="حذف فیلترها"
                    background="bg-red-400"
                    icon={<CloseCircle size={18} />}
                  />
                )}
              </div>

            </div>

            {/* Active Filters Summary */}
            {(hasActiveFilters || hasActiveSorting) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2 items-center">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 font-medium">فیلترهای فعال:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      جستجو: {searchTerm}
                    </span>
                  )}
                  {hasActiveSorting && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                      مرتب‌سازی: {columnHeads.find((col) => col.id === currentSortBy)?.name}(
                      {currentSortDirection === "asc" ? "صعودی" : "نزولی"})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Table */}
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
                      <div className={`flex items-center gap-2 ${head.textRight ? "justify-start" : "justify-center"}`}>
                        {head.name}
                        {getSortIcon(head.id)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-light dark:divide-gray-dark">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) =>
                  <tr
                    className={`hover:bg-secondary/20 hover:rounded-full cursor-pointer transition-colors group`}
                    key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ml-3">
                          <span className="text-sm font-medium text-primary">ع</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">علی اسماعیلی</div>
                          <div className="text-xs text-gray-500">09123456789</div>
                        </div>
                      </div>
                    </td>
                    <td className="flex px-6 py-4 whitespace-nowrap text-center justify-center">
                      <div className="flex max-w-fit items-center gap-2 px-2 py-1 text-sm
                        font-medium bg-accent/10 text-accent rounded-full border border-accent/20">
                        {(280000).toLocaleString()} <span className="text-xs font-medium">تومان</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center pr-16">
                      <div className="flex max-w-fit items-center gap-2 px-2 py-1 text-sm
                        font-medium bg-accent/10 text-accent rounded-full border border-accent/20">
                        {(50000).toLocaleString()} <span className="text-xs font-medium">تومان</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div>1404/08/29</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div>{2}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div>{1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <AltArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {/* {pagination.totalPages > 1 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              نمایش <span className="font-semibold">{pagination.firstIndex + 1}</span> تا{" "}
              <span className="font-semibold">{Math.min(pagination.lastIndex, pagination.totalCount)}</span> از{" "}
              <span className="font-semibold">{pagination.totalCount}</span> نتیجه
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
                  currentPage === 1
                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-primary/10 hover:border-primary/50"
                }`}
              >
                <AltArrowRight className="w-5 h-5" />
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return page === 1 || page === pagination.totalPages || Math.abs(page - currentPage) <= 1;
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center gap-2">
                    {index > 0 && array[index - 1] !== page - 1 && <span className="text-gray-400 text-sm">...</span>}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-primary/10 hover:border-primary/50"
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                ))}

              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
                  currentPage === pagination.totalPages
                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-primary/10 hover:border-primary/50"
                }`}
              >
                <AltArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )} */}
        </div>

      </section>

      <LeftDrawer isOpen={addCustomerDrawerOpen} onClose={() => setAddCustomerDrawerOpen(false)} >
        <div className="flex flex-col h-full space-y-4">
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-bold">افزودن پرسنل</h2>
          </div>
          <div className="flex-1 overflow-auto flex flex-col space-y-0 p-1">

            <CustomInput
              placeholder="نام"
              icon={<UserRounded />}
              value={formData.firstName}
              setValue={(value) => setFormData({ ...formData, firstName: value })}
              handleAction={() => { }}
            />

            <CustomInput
              placeholder="نام خانوادگی"
              icon={<UserRounded />}
              value={formData.lastName}
              setValue={(value) => setFormData({ ...formData, lastName: value })}
              handleAction={() => { }}
            />

            <CustomInput
              placeholder="شماره تماس"
              icon={<PhoneCallingRounded />}
              value={formData.phoneNumber}
              setValue={(value) => setFormData({ ...formData, phoneNumber: value })}
              handleAction={() => { }}
              type="number"
            />

            <CustomInput
              placeholder="درصد پورسانت"
              icon={<Card2 />}
              value={formData.plaque}
              setValue={(value) => setFormData({ ...formData, plaque: value })}
              handleAction={() => { }}
              type="number"
            />

            {/* <CustomDropdown
              options={vehicleTypeOptions}
              value={''}
              onChange={() => { }}
              placeholder="انتخاب نوع خودرو"
            /> */}
          </div>

          <div className="flex gap-2 w-full">

            <div className="flex-1">
              <CustomButton
                onClick={() => setAddCustomerDrawerOpen(false)}
                title="لغو"
                minWidth="w-full"
                background="bg-gray-200"
                foreground="text-gray-700"
              />
            </div>

            <div className="flex-1">
              <CustomButton
                onClick={() => setAddCustomerDrawerOpen(false)}
                title="افزودن"
                minWidth="w-full"
                icon={<AddSquare size={18} />} />
            </div>

          </div>

        </div>

      </LeftDrawer>
    </>
  );
}
