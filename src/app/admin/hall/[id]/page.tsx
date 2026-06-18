"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  Delivery,
  MapArrowDown,
  MapArrowUp,
  PhoneCallingRounded,
  Scale,
  TagPrice,
  TrashBinMinimalistic,
  WadOfMoney,
} from "@solar-icons/react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/drawers/ConfirmDialog";
import { CargoDetailsType } from "@/lib/schemas/cargos-details.schema";


export default function AdminUsers() {
  const { id } = useParams();
  const [cargoData, setCargoData] = useState<CargoDetailsType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletionLoading, setDeletionLoading] = useState<boolean>(false);
  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false);

  const router = useRouter();

  const fetchDriver = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cargos/${id}`);

      if (!response.ok) {
        toast.error('خطا در دریافت اطلاعات');
        return;
      }

      const result = await response.json();
      console.log(JSON.stringify(result, null, 2));

      setCargoData(result);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("خطا در دریافت اطلاعات داشبورد");
    } finally {
      setLoading(false);
    }
  }, [id]);


  useEffect(() => {
    fetchDriver();
  }, [fetchDriver]);


  async function deleteDriver() {
    try {
      setDeletionLoading(true);
      const deleteDriverResponse = await fetch(`/api/cargos/${id}`, { method: 'DELETE' });

      if (!deleteDriverResponse.ok) {
        toast.error('خطا در دریافت اطلاعات');
        return;
      }

      // const result = await deleteDriverResponse.json();
      router.back();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("خطا در دریافت اطلاعات داشبورد");
    } finally {
      setDeletionLoading(false);
    }
  }

  if (loading) {
    return null;
  }

  const cargo = cargoData?.data;

  if (!cargo) {
    return (
      <section className="container mx-auto px-0 py-3">
        <div className="bg-card-light dark:bg-card-dark border-gray-light dark:border-gray-dark rounded-4xl p-6 text-center">
          <p className="text-base font-semibold text-background-dark dark:text-background-light">
            اطلاعات بار پیدا نشد
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-primary text-white rounded-full px-5 py-2 text-sm cursor-pointer"
          >
            بازگشت
          </button>
        </div>
      </section>
    );
  }

  function InfoPill({
    icon,
    label,
    value,
    variant = "default",
  }: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    variant?: "default" | "origin" | "destination";
  }) {
    const variantClasses = {
      default: {
        wrapper: "bg-background-light dark:bg-background-dark border-gray-light dark:border-gray-dark",
        icon: "bg-card-light dark:bg-card-dark text-background-dark dark:text-background-light",
        label: "",
        value: "",
      },
      origin: {
        wrapper: "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800",
        icon: "bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300",
        label: "text-sky-700 dark:text-sky-300",
        value: "text-sky-800 dark:text-sky-100",
      },
      destination: {
        wrapper: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
        icon: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300",
        label: "text-orange-700 dark:text-orange-300",
        value: "text-orange-800 dark:text-orange-100",
      },
    }[variant];

    return (
      <div className={`flex flex-1 justify-between items-center border p-0.5 rounded-full ${variantClasses.wrapper}`}>
        <div className="flex items-center gap-1 text-xs">
          <div className={`p-3 rounded-full ${variantClasses.icon}`}>
            {icon}
          </div>
          <p className={variantClasses.label}>{label}</p>
          <span className={`font-semibold text-sm ${variantClasses.value}`}>{value}</span>
        </div>
      </div>
    );
  }

  function formatTimeAgo(createdAt?: string | null) {
    if (!createdAt) return "";

    const created = new Date(createdAt);
    if (Number.isNaN(created.getTime())) {
      return "";
    }

    const diffMs = Date.now() - created.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "لحظاتی پیش";
    if (diffMinutes < 60) return `${diffMinutes} دقیقه پیش`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} ساعت پیش`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} روز پیش`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) return `${diffWeeks} هفته پیش`;

    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} ماه پیش`;
  }

  function formatJalaliDateTime(value?: string | number | Date | null) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  function getCostPerLabel(costPer?: string | null) {
    switch (costPer) {
      case "total":
        return "صافی";
      case "per_ton":
        return "به ازای هر تن";
      case "agreement":
        return "توافقی";
      default:
        return costPer || "";
    }
  }

  function formatCost(cost?: number | null, costPer?: string | null) {
    if (costPer === "agreement") return "توافقی";
    if (!cost) return "";

    return `${cost.toLocaleString("fa-IR")} تومان`;
  }

  return (
    <>
      <section className="container mx-auto px-0 py-3">
        <div className="relative text-center items-center justify-center bg-card-light dark:bg-card-dark
         border-gray-light dark:border-gray-dark rounded-4xl p-4">
          {/* <div className="w-fit justify-self-center p-6 bg-background-light dark:bg-background-dark
                            border border-gray-light dark:border-gray-dark rounded-full">
            <UserRounded size={48} weight="Bold" className="text-primary dark:text-primary mx-auto" />
          </div> */}
          <div className="w-fit mx-auto mb-8 mt-2">
            <p className="text-base font-semibold">{cargo.title}</p>
            {formatTimeAgo(cargo.created_at)}
          </div>
          {/* <p className="font-medium text-gray-400">{DriverData?.data.profile.user.mobile_number}</p> */}
          <div className="absolute left-6 top-2">
            {/* <button
              onClick={() => { }}
              className="bg-primary text-white rounded-full p-2 mr-2 cursor-pointer"
            >
              <PenNewRound size={16} />
            </button> */}
            <button
              onClick={() => { setDeletionDialogOpen(true) }}
              className="bg-red-400 text-white rounded-full p-2 mr-2 cursor-pointer"
            >
              <TrashBinMinimalistic size={16} />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <InfoPill
              icon={<MapArrowUp size={20} />}
              label="مبدا:"
              value={cargo.loading_city.name}
              variant="origin"
            />
            <InfoPill
              icon={<MapArrowDown size={20} />}
              label="مقصد:"
              value={cargo.discharging_city.name}
              variant="destination"
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <InfoPill
              icon={<Delivery size={20} />}
              label="ناوگان:"
              value={cargo.truck.name}
            />
            <InfoPill
              icon={<Scale size={20} />}
              label="وزن:"
              value={`${cargo.weight ?? ""} تن`}
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <InfoPill
              icon={<PhoneCallingRounded size={20} />}
              label="شماره تماس:"
              value={cargo.mobile_number}
            />
            <InfoPill
              icon={<Calendar size={20} />}
              label="زمان ایجاد:"
              value={formatJalaliDateTime(cargo.created_at)}
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <InfoPill
              icon={<WadOfMoney size={20} />}
              label="قیمت:"
              value={formatCost(cargo.cost, cargo.cost_per)}
            />
            <InfoPill
              icon={<TagPrice size={20} />}
              label="نوع قیمت:"
              value={getCostPerLabel(cargo.cost_per)}
            />
          </div>
        </div>

        {/* Table */}


      </section >

      <ConfirmDialog
        isOpen={deletionDialogOpen}
        onClose={() => setDeletionDialogOpen(false)}
        onConfirm={deleteDriver}
        title="حذف راننده"
        message="آیا از حذف این راننده اطمینان دارید؟ این عملیات غیرقابل بازگشت است!"
        isDestructive={true}
        loading={deletionLoading}
      />

    </>
  );
}
