"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AddSquare,
  AltArrowLeft,
  ArrowDown,
  ArrowUp,
  Card2,
  ChatRoundMoney,
  CheckCircle,
  CloseCircle,
  Filter,
  MagniferZoomIn,
  PhoneCallingRounded,
  SortVertical,
  UserRounded,
} from "@solar-icons/react";
import CustomButton from "@/components/widgets/CustomButton";
import LeftDrawer from "@/components/drawers/LeftDrawer";
import CustomInput from "@/components/widgets/CustomInput";
import CustomDropdown from "@/components/widgets/CustomDropdown";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import CustomTextarea from "@/components/widgets/CustomTextarea";

const columnHeads = [
  { id: "type", name: "نوع", percent: 20, textRight: false, sortable: true },
  { id: "start", name: "شروع", percent: 15, textRight: false, sortable: true },
  { id: "end", name: "پایان", percent: 15, textRight: false, sortable: true },
  { id: "amount", name: "میزان", percent: 15, textRight: false, sortable: true },
  { id: "additionalInfo", name: "توضیحات", percent: 30, textRight: false, sortable: true },
  { id: "actions", name: "", percent: 5, textRight: false, sortable: false },
];

export default function AdminUsers() {
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

  const [addCustomerDrawerOpen, setAddCustomerDrawerOpen] = useState(false);


  // Get sorting from URL params
  const currentSortBy = searchParams.get("sortBy") || "";
  const currentSortDirection = searchParams.get("sortDirection") || "";
  // const currentPage = parseInt(searchParams.get("page")) || 1;

  const campaignOptions = [
    {
      value: '1',
      label: 'تخفیف زمان دار'
    },
    {
      value: '2',
      label: 'تخفیف مناسبتی'
    },
    {
      value: '3',
      label: 'تخفیف روی سرویس'
    },
    {
      value: '4',
      label: 'پیشنهاد ترکیبی'
    }
  ];

  const [selectedCampaign, setSelectedCampaign] = useState('1');

  const [campaigns] = useState<Campaign[]>([
    {
      id: 1,
      type: 'تخفیف زمان دار',
      start: '1404/09/20',
      end: '1404/09/25',
      offAmount: 20,
    },
    {
      id: 2,
      type: 'تخفیف مناسبتی',
      start: '1404/09/20',
      end: '1404/09/25',
      offAmount: 20,
      additionalInfo: 'بلک فرایدی'
    },
    {
      id: 3,
      type: 'تخفیف روی سرویس',
      start: '1404/09/20',
      end: '1404/09/25',
      offAmount: 20,
      additionalInfo: 'روشویی'
    },
  ]);

  useEffect(() => { }, [searchParams]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);


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


  const clearFilters = () => {
    setSearchTerm("");
    router.push("/campaigns", { scroll: false });
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
      <section className="container mx-auto px-0 py-3 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light text-xs">
        {/* Filters Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Search Bar */}
            <div className="lg:col-span-4">
              <div className="flex bg-background-light dark:bg-background-dark rounded-full p-1">
                <button
                  key={'1'}
                  onClick={() => { }}
                  className={`flex-1 min-h-full rounded-full items-center justify-center text-sm font-medium py-3
                    ${true ? "text-card-dark bg-secondary shadow-xs" : "text-gray-500"}
                `}>
                  {'فعال'}
                </button>

                <button
                  key={'2'}
                  onClick={() => { }}
                  className={`flex-1 min-h-full rounded-full items-center justify-center text-sm font-medium py-3
                    ${false ? "text-card-dark bg-secondary shadow-xs" : "text-gray-500"}
                `}>
                  {'غیرفعال'}
                </button>

              </div>
            </div>

            <div className="lg:col-span-1" />

            <div className="lg:col-span-3">
              {/* <label className="block text-sm font-medium text-secondary mb-2">جستجو</label> */}
              <CustomDropdown
                options={[{ value: 'all', label: 'همه' }, ...campaignOptions]}
                value={'all'}
                background="bg-background-light dark:bg-background-dark"
                onChange={(value) => { setSelectedCampaign(value as string) }}
                placeholder="انتخاب نوع کمپین"
              />


              {/* <div className="flex gap-2">
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
              </div> */}
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

            <div className="lg:col-span-2 flex justify-end">
              <CustomButton
                onClick={() => setAddCustomerDrawerOpen(true)}
                title="ایجاد کمپین"
                icon={<AddSquare size={18} />}
              />
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
              {campaigns && campaigns.length > 0 ? (
                campaigns.map((campaign) => {
                  return (
                    <tr
                      className={`hover:bg-secondary/20 hover:rounded-full cursor-pointer transition-colors group`}
                      key={campaign.id}
                      onClick={() => {
                        useBreadcrumbStore.getState().setName(campaign.type);
                        router.push(`/campaigns/${campaign.id}`)
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ml-3">
                            <span className="text-sm font-medium text-primary">{campaign.type.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{campaign.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div>{campaign.start}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div>{campaign.end}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div>{campaign.offAmount} درصد</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div>{campaign.additionalInfo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <AltArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columnHeads.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MagniferZoomIn className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {hasActiveFilters ? "نتیجه‌ای یافت نشد" : "هیچ کاربری یافت نشد"}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {hasActiveFilters ? "لطفاً فیلترهای خود را تغییر دهید" : "هنوز کاربری در سیستم ثبت نشده است"}
                      </p>
                    </div>
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
      </section>

      <LeftDrawer isOpen={addCustomerDrawerOpen} onClose={() => setAddCustomerDrawerOpen(false)} >
        <div className="flex flex-col h-full space-y-4">
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-bold">ایجاد کمپین</h2>
          </div>
          <div className="flex-1 overflow-auto flex flex-col space-y-0 p-1">

            <CustomDropdown
              options={campaignOptions}
              value={selectedCampaign}
              onChange={(value) => { setSelectedCampaign(value as string) }}
              placeholder="انتخاب نوع کمپین"
            />

            <div className="h-6"></div>

            <CustomInput
              placeholder="شروع کمپین"
              icon={<UserRounded />}
              value={formData.firstName}
              setValue={(value) => setFormData({ ...formData, firstName: value })}
              handleAction={() => { }}
            />

            <CustomInput
              placeholder="پایان کمپین"
              icon={<UserRounded />}
              value={formData.lastName}
              setValue={(value) => setFormData({ ...formData, lastName: value })}
              handleAction={() => { }}
            />

            <CustomInput
              placeholder="میزان تخفیف"
              icon={<PhoneCallingRounded />}
              value={formData.phoneNumber}
              setValue={(value) => setFormData({ ...formData, phoneNumber: value })}
              handleAction={() => { }}
              type="number"
            />

            <CustomTextarea
              placeholder="متن پیامک"
              // icon={<Card2 />}
              value={formData.plaque}
              setValue={(value) => setFormData({ ...formData, plaque: value })}
              handleAction={() => { }}
            />

            <div className="flex flex-col items-start justify-center gap-2 p-3 rounded-3xl border
                border-gray-light dark:border-gray-dark bg-card-light dark:bg-background-dark">
              <p className="text-base font-medium">مخاطب کمپین</p>
              <div className="flex items-center gap-1 justify-center mb-2 font-medium">
                <label className="inline-flex items-center cursor-pointer text-center">
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => { }}
                    className="sr-only peer" // Hide default checkbox
                  />
                  <div className="relative bg-background-light dark:bg-card-dark border border-gray-light dark:border-gray-dark rounded-full peer-checked:bg-accent peer-checked:border-accent transition-all">
                    <CheckCircle size={16} className="text-background-light dark:text-card-dark" />
                  </div>
                </label>
                <p>همه کاربران (۵۰۳ نفر)</p>
              </div>

              <div className="flex justify-between min-w-full">
                <div className="flex items-center gap-1 justify-center">
                  <label className="inline-flex items-center cursor-pointer text-center">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => { }}
                      className="sr-only peer" // Hide default checkbox
                    />
                    <div className="relative bg-background-light dark:bg-card-dark border border-gray-light dark:border-gray-dark rounded-full peer-checked:bg-primary peer-checked:border-primary transition-all">
                      <CheckCircle size={16} className="text-background-light dark:text-card-dark" />
                    </div>
                  </label>
                  <p>طلایی(۴۳)</p>
                </div>

                <div className="flex items-center gap-1 justify-center">
                  <label className="inline-flex items-center cursor-pointer text-center">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => { }}
                      className="sr-only peer" // Hide default checkbox
                    />
                    <div className="relative bg-background-light dark:bg-card-dark border border-gray-light dark:border-gray-dark rounded-full peer-checked:bg-primary peer-checked:border-primary transition-all">
                      <CheckCircle size={16} className="text-background-light dark:text-card-dark" />
                    </div>
                  </label>
                  <p>نقره‌ای(۱۲۰)</p>
                </div>

                <div className="flex items-center gap-1 justify-center">
                  <label className="inline-flex items-center cursor-pointer text-center">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => { }}
                      className="sr-only peer" // Hide default checkbox
                    />
                    <div className="relative bg-background-light dark:bg-card-dark border border-gray-light dark:border-gray-dark rounded-full peer-checked:bg-primary peer-checked:border-primary transition-all">
                      <CheckCircle size={16} className="text-background-light dark:text-card-dark" />
                    </div>
                  </label>
                  <p>برنزی(۳۴۰)</p>
                </div>
              </div>

            </div>

          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center text-xs gap-2 bg-accent/10 border border-accent/20 p-3 rounded-full">
              <ChatRoundMoney size={24} className="text-accent" weight="Bold" />
              هزینه ارسال پیامک
              <span className="flex-1 font-semibold text-accent text-base text-left">
                {(35000).toLocaleString() + ' تومان'}
              </span>
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
                  title="ایجاد"
                  minWidth="w-full"
                  icon={<AddSquare size={18} />} />
              </div>

            </div>
          </div>



        </div>

      </LeftDrawer>
    </>
  );
}
