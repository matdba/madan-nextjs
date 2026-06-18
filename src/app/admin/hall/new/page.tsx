"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AddSquare,
  Bus,
  Card,
  CartLarge4,
  HashtagSquare,
  MapPoint,
  PhoneCallingRounded,
} from "@solar-icons/react";
import toast from "react-hot-toast";

import CustomButton from "@/components/widgets/CustomButton";
import CustomInput from "@/components/widgets/CustomInput";
import OptionRadioGroup from "@/components/widgets/OptionRadioGroup";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { CityListType } from "@/lib/schemas/city-list.schema";
import { TruckListType } from "@/lib/schemas/truck-list.schema";
import CustomDropdown from "@/components/widgets/CustomDropdown";
import { isPhoneNumberValid } from "@persian-tools/persian-tools";
import { AddCargoRequestType } from "@/lib/schemas/cargos.schema";
import { CostType } from "@/utils/cost-types";


type WeightMode = "free" | "specific";
type PriceMode = "agreed" | "per_ton" | "total";

export default function NewCargoPage() {
  const router = useRouter();

  const [citiesData, setCitiesData] = useState<CityListType | null>(null);
  const [trucksData, setTrucksData] = useState<TruckListType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<AddCargoRequestType>({
    title: "",
    mobile_number: "",
    loading_city_id: 0,
    discharging_city_id: 0,
    truck_id: 0,
    weight: 0,
    cost: 0,
    cost_per: CostType.Total,
    description: "",
    free_weight: false,
    is_private: false,
  });

  const [weightMode, setWeightMode] = useState<WeightMode>("specific");
  const [priceMode, setPriceMode] = useState<CostType>(CostType.Total);

  const [errors, setErrors] = useState({
    title: "",
    mobileNumber: "",
    loadingCityId: "",
    dischargingCityId: "",
    truckId: "",
    price: "",
    weight: "",
  });

  const fetchFormData = useCallback(async () => {
    try {
      setLoading(true);
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
      console.error("Error fetching form data:", error);
      toast.error("خطا در دریافت اطلاعات فرم");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    useBreadcrumbStore.getState().setName("ثبت بار");
  }, []);

  useEffect(() => {
    fetchFormData();
  }, [fetchFormData]);

  function validateForm() {
    let isValid = true;

    if (formData.title.trim().length < 3) {
      setErrors((prev) => ({ ...prev, title: "عنوان باید حداقل 3 کاراکتر باشد" }));
      isValid = false;
    }

    if (!isPhoneNumberValid(formData.mobile_number)) {
      setErrors((prev) => ({ ...prev, mobileNumber: "شماره تماس نامعتبر است" }));
      isValid = false;
    }

    if (!formData.loading_city_id) {
      setErrors((prev) => ({ ...prev, loadingCityId: "مبدا را انتخاب کنید" }));
      isValid = false;
    }

    if (!formData.discharging_city_id) {
      setErrors((prev) => ({ ...prev, dischargingCityId: "مقصد را انتخاب کنید" }));
      isValid = false;
    }

    if (!formData.truck_id) {
      setErrors((prev) => ({ ...prev, truckId: "ناوگان را انتخاب کنید" }));
      isValid = false;
    }

    if (weightMode === "specific" && !formData.weight) {
      setErrors((prev) => ({ ...prev, weight: "تناژ را وارد کنید" }));
      isValid = false;
    }

    if (formData.cost_per === CostType.PerTon && !formData.cost_per) {
      setErrors((prev) => ({ ...prev, price: "قیمت هر تن را وارد کنید" }));
      isValid = false;
    }

    if (formData.cost_per === CostType.Total && !formData.cost) {
      setErrors((prev) => ({ ...prev, price: "قیمت کل را وارد کنید" }));
      isValid = false;
    }

    return isValid;
  }

  async function submitNewCargo() {
    if (!validateForm()) return;

    try {
      setSubmitLoading(true);

      console.log(JSON.stringify({ ...formData }));

      const response = await fetch('/api/cargos', { method: 'POST', body: JSON.stringify({ ...formData }) });

      const result = await response.json();

      if (!response.ok) {
        toast.error((result?.error || result?.message || "خطا در ثبت بار") as string);
        return;
      }

      toast.success(result?.message || "بار با موفقیت ثبت شد");
      router.push("/hall");
    } catch (error) {
      console.error("Error Posting Cargo:", error);
      toast.error("خطا در ثبت بار");
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loading) {
    return null;
  }

  return (
    <section className="container mx-auto px-0 py-3 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light">
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-4">

        <div className="lg:col-span-6">
          <CustomInput
            placeholder="عنوان بار"
            icon={<Card />}
            value={formData.title}
            error={errors.title}
            setValue={(value) => {
              setFormData({ ...formData, title: value });
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
            handleAction={() => submitNewCargo()}
            background="bg-background-light dark:bg-background-dark"
          />
        </div>

        <div className="lg:col-span-6">
          <CustomInput
            placeholder="شماره تماس"
            icon={<PhoneCallingRounded />}
            value={formData.mobile_number}
            error={errors.mobileNumber}
            maxLength={11}
            type="number"
            setValue={(value) => {
              setFormData({ ...formData, mobile_number: value });
              setErrors((prev) => ({ ...prev, mobileNumber: "" }));
            }}
            handleAction={() => submitNewCargo()}
            background="bg-background-light dark:bg-background-dark"
          />
        </div>

        <div className="lg:col-span-4">
          <CustomDropdown
            value={formData.loading_city_id}
            onChange={(value) => {
              setFormData({ ...formData, loading_city_id: value as number });
              setErrors((prev) => ({ ...prev, loadingCityId: "" }));
            }}
            error={errors.loadingCityId}
            placeholder="انتخاب مبدا"
            icon={<MapPoint />}
            options={citiesData !== null ? citiesData.data.map((city) => ({
              value: city.id,
              label: city.name,
            })) : []}
            background="bg-background-light dark:bg-background-dark"
          />
        </div>

        <div className="lg:col-span-4">
          <CustomDropdown
            value={formData.discharging_city_id}
            onChange={(value) => {
              setFormData({ ...formData, discharging_city_id: value as number });
              setErrors((prev) => ({ ...prev, dischargingCityId: "" }));
            }}
            error={errors.dischargingCityId}
            placeholder="انتخاب مقصد"
            icon={<MapPoint />}
            options={citiesData !== null ? citiesData.data.map((city) => ({
              value: city.id,
              label: city.name,
            })) : []}
            background="bg-background-light dark:bg-background-dark"
          />
        </div>

        <div className="lg:col-span-4">
          <CustomDropdown
            value={formData.truck_id}
            onChange={(value) => {
              setFormData({ ...formData, truck_id: value as number });
              setErrors((prev) => ({ ...prev, truckId: "" }));
            }}
            error={errors.truckId}
            placeholder="انتخاب ناوگان"
            icon={<Bus />}
            options={trucksData !== null ? trucksData.data.map((truck) => ({
              value: truck.id,
              label: truck.name,
            })) : []}
            background="bg-background-light dark:bg-background-dark"
          />
        </div>

        <div className="flex flex-col gap-2 lg:col-span-6">
          <OptionRadioGroup
            // label="نوع تناژ"
            value={weightMode}
            onChange={(value) => {
              const mode = value as WeightMode;
              setWeightMode(mode);
              if (mode === "free") {
                setFormData({ ...formData, weight: 0, free_weight: true });
              } else {
                setFormData({ ...formData, free_weight: false });
              }
              setErrors((prev) => ({ ...prev, weight: "", }));
            }}
            options={[
              { value: "specific", label: "تناژ مشخص" },
              { value: "free", label: "تناژ آزاد" },
            ]}
          // icon={<HashtagSquare />}
          />

          <CustomInput
            placeholder="تناژ (تن)"
            icon={<HashtagSquare />}
            value={formData.weight.toString()}
            error={errors.weight}
            moneyInput={true}
            maxLength={2}
            setValue={(value) => {
              setFormData({ ...formData, weight: parseInt(value) });
              setErrors((prev) => ({ ...prev, weight: "" }));
            }}
            handleAction={() => submitNewCargo()}
            type="number"
            disabled={weightMode === "free"}
            background="bg-background-light dark:bg-background-dark"
          />
        </div>

        <div className="flex flex-col gap-2 lg:col-span-6">
          <OptionRadioGroup
            // label="نوع قیمت"
            value={formData.cost_per}
            onChange={(value) => {
              const mode = value as CostType;
              // setPriceMode(mode);
              setErrors((prev) => ({ ...prev, price: "" }));
              if (mode === CostType.Agreement) {
                setFormData({ ...formData, cost: 0, cost_per: CostType.Agreement });
              } else {
                setFormData({ ...formData, cost_per: mode });
              }
            }}
            options={[
              { value: CostType.Total, label: 'صافی' },
              { value: CostType.Agreement, label: 'توافقی' },
              { value: CostType.PerTon, label: 'به ازای هر تن' },
            ]}
          // icon={<CartLarge4 />}
          />

          <CustomInput
            placeholder={formData.cost_per === CostType.PerTon ? "قیمت هر تن (تومان)" : "قیمت کل (تومان)"}
            icon={<CartLarge4 />}
            value={formData.cost.toString()}
            moneyInput={true}
            error={errors.price}
            maxLength={12}
            setValue={(value) => {
              setFormData({ ...formData, cost: parseInt(value) });
              if (value) {
                setErrors((prev) => ({ ...prev, price: "" }));
              }
            }}
            handleAction={() => submitNewCargo()}
            disabled={formData.cost_per === CostType.Agreement}
            background="bg-background-light dark:bg-background-dark"
          />
        </div>

        <div className="lg:col-span-12">
          <CustomInput
            placeholder="توضیحات"
            icon={<Card />}
            value={formData.description}
            setValue={(value) => {
              setFormData({ ...formData, description: value });
            }}
            handleAction={() => submitNewCargo()}
            background="bg-background-light dark:bg-background-dark"
          />
        </div>
      </div>

      <div className="lg:col-span-12 flex justify-end p-6 gap-2 items-end">
        <div className="">
          <CustomButton
            onClick={() => router.push("/hall")}
            title="لغو"
            // minWidth="w-full"
            background="bg-gray-200 dark:bg-gray-700"
            foreground="text-black dark:text-white"
          />
        </div>

        <div className="">
          <CustomButton
            onClick={submitNewCargo}
            title="ثبت بار"
            // minWidth="w-full"
            loading={submitLoading}
            icon={<AddSquare size={18} />}
          />
        </div>
      </div>
    </section>
  );
}


