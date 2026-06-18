"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import {
  AddSquare,
  AltArrowLeft,
  ArrowDown,
  ArrowUp,
  CloseCircle,
  Filter,
  Magnifer,
  MagniferZoomIn,
  MoneyBag,
  PhoneCallingRounded,
  SortVertical,
  TrashBinMinimalistic,
  PenNewRound,
  UserCheckRounded,
  UserRounded,
} from "@solar-icons/react";
import CustomButton from "@/components/widgets/CustomButton";
import LeftDrawer from "@/components/drawers/LeftDrawer";
import CustomInput from "@/components/widgets/CustomInput";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import toast from "react-hot-toast";
import Pagination from "@/components/widgets/Pagination";
import TableShimmer from "@/components/shimmers/TableShimmer";
import { isPhoneNumberValid } from "@persian-tools/persian-tools";
import { AddOperatorRequestType, OperatorsListType } from "@/lib/schemas/operators.schema";
import ConfirmDialog from "@/components/drawers/ConfirmDialog";

const columnHeads = [
  { id: "name", name: "اپراتور", percent: 30, textRight: false, sortable: false },
  { id: "title", name: "عنوان", percent: 20, textRight: false, sortable: false },
  { id: "today_cargos_count", name: "سرویس امروز", percent: 20, textRight: false, sortable: true },
  { id: "total_cargos_count", name: "کل سرویس‌ها", percent: 20, textRight: false, sortable: true },
  { id: "actions", name: "", percent: 5, textRight: false, sortable: false },
];

export default function AdminUsers() {
  const [operatorsData, setOperatorsData] = useState<OperatorsListType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [addOperatorLoading, setAddOperatorLoading] = useState<boolean>(false);
  const [editOperatorId, setEditOperatorId] = useState<number | null>(null);
  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false);
  const [deletionLoading, setDeletionLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [formData, setFormData] = useState<AddOperatorRequestType>({
    name: "",
    last_name: "",
    mobile_number: "",
    // title: "",
    // avatar: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [tempSearchTerm, setTempSearchTerm] = useState(searchParams.get("search") || "");

  const [addCustomerDrawerOpen, setAddCustomerDrawerOpen] = useState(false);


  // Get sorting from URL params
  const currentSortBy = searchParams.get("sort_by") || "";
  const currentSortDirection = searchParams.get("dir") || "";
  // const currentPage = parseInt(searchParams.get("page")) || 1;

  const fetchOperators = useCallback(async () => {
    try {
      setLoading(true);
      const operatorsResponse = await fetch(`/api/operators?${searchParams}`);

      if (!operatorsResponse.ok) {
        toast.error("خطا در دریافت اطلاعات");
        return;
      }

      const operatorsResult = await operatorsResponse.json();
      setOperatorsData(operatorsResult);
    } catch (error) {
      console.error("Error fetching operators:", error);
      toast.error("خطا در دریافت اطلاعات داشبورد");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchOperators();
  }, [fetchOperators]);

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
      params.set("sort_by", currentSortBy);
      params.set("dir", currentSortDirection);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const updateSorting = (sortBy: string, sortDirection: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page"); // Reset to first page when sorting

    if (sortBy && sortDirection) {
      params.set("sort_by", sortBy);
      params.set("dir", sortDirection);
    } else {
      params.delete("sort_by");
      params.delete("dir");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  async function deleteOperator() {
    if (!selectedId) return;

    try {
      setDeletionLoading(true);
      const response = await fetch(`/api/operators/${selectedId}`, { method: "DELETE" });

      if (!response.ok) {
        toast.error("خطا در حذف اپراتور");
        return;
      }

      setDeletionDialogOpen(false);
      setSelectedId(null);
      await fetchOperators();
    } catch (error) {
      console.error("Error deleting operator:", error);
      toast.error("خطا در حذف اپراتور");
    } finally {
      setDeletionLoading(false);
    }
  }

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
    router.push("/operators", { scroll: false });
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

  const sortedOperators = operatorsData?.data.operators
    ? [...operatorsData.data.operators].sort((a, b) => {
        if (!currentSortBy) return 0;

        const dir = currentSortDirection === "desc" ? -1 : 1;
        const aVal =
          currentSortBy === "today_cargos_count"
            ? a.operator.today_cargos_count ?? 0
            : currentSortBy === "total_cargos_count"
              ? a.operator.total_cargos_count ?? 0
              : 0;
        const bVal =
          currentSortBy === "today_cargos_count"
            ? b.operator.today_cargos_count ?? 0
            : currentSortBy === "total_cargos_count"
              ? b.operator.total_cargos_count ?? 0
              : 0;

        return (aVal - bVal) * dir;
      })
    : [];

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  function validateForm() {
    let isValid = true;

    if (formData.name.trim().length < 2) {
      setErrors((prev) => ({ ...prev, firstName: "نام باید حداقل 2 کاراکتر باشد" }));
      isValid = false;
    }

    if (formData.last_name.trim().length < 2) {
      setErrors((prev) => ({ ...prev, lastName: "نام خانوادگی باید حداقل 2 کاراکتر باشد" }));
      isValid = false;
    }

    if (!isPhoneNumberValid(formData.mobile_number)) {
      setErrors((prev) => ({ ...prev, phoneNumber: "شماره تماس نامعتبر است" }));
      isValid = false;
    }

    return isValid;
  }

  async function submitNewOperator() {
    if (editOperatorId) {
      toast.error("مسیر ویرایش اپراتور مشخص نشده است");
      return;
    }

    if (!validateForm()) return;

    try {
      setAddOperatorLoading(true);
      const response = await fetch("/api/operators", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          // title: formData.title?.trim() || null,
          // avatar: formData.avatar?.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error((result?.error || result?.message || "خطا در ثبت اپراتور") as string);
        return;
      }

      toast.success(result?.message || "اپراتور با موفقیت ثبت شد");
      setAddCustomerDrawerOpen(false);
      setEditOperatorId(null);
      setFormData({
        name: "",
        last_name: "",
        mobile_number: "",
        // title: "",
        // avatar: "",
      });
      await fetchOperators();
    } catch (error) {
      console.error("Error Posting Operator:", error);
      toast.error("خطا در ثبت اپراتور");
    } finally {
      setAddOperatorLoading(false);
    }
  }

  if (loading) {
    return <TableShimmer columnHeads={columnHeads} />;
  }

  return (
    <>
      <section className="container mx-auto px-0 py-3 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light">
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

            <div className="lg:col-span-6 flex justify-end">
              <CustomButton
                onClick={() => setAddCustomerDrawerOpen(true)}
                title="افزودن اپراتور"
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
              {operatorsData && sortedOperators.length > 0 ? (
                sortedOperators.map((item) => {
                  const fullName = `${item.user.name ?? ""} ${item.user.last_name ?? ""}`.trim();
                  return (
                    <tr
                      className="hover:bg-secondary/20 hover:rounded-full transition-colors group"
                      key={item.operator.operator_id}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ml-3">
                            <span className="text-sm font-medium text-primary">
                              {(fullName || "-").charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{fullName || "-"}</div>
                            <div className="text-xs text-gray-500">{item.user.mobile_number ?? "-"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div>{item.operator.title ?? "-"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div>{item.operator.today_cargos_count ?? 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div>{item.operator.total_cargos_count ?? 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* <button
                            type="button"
                            className="inline-flex items-center cursor-pointer justify-center w-9 h-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            onClick={() => {
                              setEditOperatorId(item.operator.operator_id);
                              setFormData({
                                name: item.user.name ?? "",
                                last_name: item.user.last_name ?? "",
                                mobile_number: item.user.mobile_number ?? "",
                                // title: item.operator.title ?? "",
                                // avatar: item.user.avatar ?? "",
                              });
                              setErrors({ firstName: "", lastName: "", phoneNumber: "" });
                              setAddCustomerDrawerOpen(true);
                              useBreadcrumbStore.getState().setName(fullName);
                            }}
                          >
                            <PenNewRound size={16} />
                          </button> */}
                          <button
                            type="button"
                            className="inline-flex items-center cursor-pointer justify-center w-9 h-9 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            onClick={() => {
                              setSelectedId(item.operator.operator_id);
                              setDeletionDialogOpen(true);
                              useBreadcrumbStore.getState().setName(fullName);
                            }}
                          >
                            <TrashBinMinimalistic size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columnHeads.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-background-dark border border-transparent dark:border-gray-dark rounded-full flex items-center justify-center mb-4">
                        {hasActiveFilters ? (
                          <MagniferZoomIn className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        ) : (
                          <UserCheckRounded className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-card-dark dark:text-card-light mb-1">
                        {hasActiveFilters ? "نتیجه‌ای یافت نشد" : "هیچ اپراتوری یافت نشد"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {hasActiveFilters ? "لطفاً فیلترهای خود را تغییر دهید" : "هنوز اپراتوری در سیستم ثبت نشده است"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && operatorsData && (
          <Pagination
            pageCount={operatorsData.data.pagination.last_page_number}
            currentPage={operatorsData.data.pagination.current_page_number}
            currentItemCount={operatorsData.data.pagination.current_count}
            handlePageChange={handlePageChange}
          />
        )}
      </section>

      <LeftDrawer isOpen={addCustomerDrawerOpen} onClose={() => setAddCustomerDrawerOpen(false)} >
        <div className="flex flex-col h-full space-y-4">
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-bold">
              {editOperatorId ? "ویرایش اپراتور" : "افزودن اپراتور"}
            </h2>
          </div>
          <div className="flex-1 overflow-auto flex flex-col space-y-2 p-1">

            <CustomInput
              placeholder="نام"
              icon={<UserRounded />}
              value={formData.name}
              error={errors.firstName}
              setValue={(value) => {
                setFormData({ ...formData, name: value });
                setErrors((prev) => ({ ...prev, firstName: "" }));
              }}
              handleAction={() => submitNewOperator()}
            />

            <CustomInput
              placeholder="نام خانوادگی"
              icon={<UserCheckRounded />}
              value={formData.last_name}
              error={errors.lastName}
              setValue={(value) => {
                setFormData({ ...formData, last_name: value });
                setErrors((prev) => ({ ...prev, lastName: "" }));
              }}
              handleAction={() => submitNewOperator()}
            />

            <CustomInput
              placeholder="شماره تماس"
              icon={<PhoneCallingRounded />}
              maxLength={11}
              value={formData.mobile_number}
              error={errors.phoneNumber}
              setValue={(value) => {
                setFormData({ ...formData, mobile_number: value });
                setErrors((prev) => ({ ...prev, phoneNumber: "" }));
              }}
              handleAction={() => submitNewOperator()}
              type="number"
            />

            {/* <CustomInput
              placeholder="عنوان"
              icon={<MoneyBag />}
              value={formData.title ?? ""}
              setValue={(value) => setFormData({ ...formData, title: value })}
              handleAction={() => submitNewOperator()}
            /> */}

            {/* <CustomInput
              placeholder="آواتار (URL)"
              icon={<UserRounded />}
              value={formData.avatar ?? ""}
              setValue={(value) => setFormData({ ...formData, avatar: value })}
              handleAction={() => submitNewOperator()}
            /> */}
          </div>

          <div className="flex gap-2 w-full">

            <div className="flex-1">
              <CustomButton
                onClick={() => {
                  setAddCustomerDrawerOpen(false);
                  setEditOperatorId(null);
                }}
                title="لغو"
                minWidth="w-full"
                background="bg-gray-200"
                foreground="text-gray-700"
              />
            </div>

            <div className="flex-1">
              <CustomButton
                onClick={() => submitNewOperator()}
                title={'ثبت متصدی'}
                loading={addOperatorLoading}
                minWidth="w-full"
                icon={<AddSquare size={18} />}
              />
            </div>

          </div>

        </div>

      </LeftDrawer>

      <ConfirmDialog
        isOpen={deletionDialogOpen}
        onClose={() => setDeletionDialogOpen(false)}
        onConfirm={deleteOperator}
        title="حذف اپراتور"
        message="آیا از حذف این اپراتور اطمینان دارید؟ این عملیات غیرقابل بازگشت است!"
        isDestructive={true}
        loading={deletionLoading}
      />
    </>
  );
}
