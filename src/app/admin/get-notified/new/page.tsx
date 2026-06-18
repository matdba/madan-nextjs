"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AddSquare,
  Bus,
  Card,
  MapPoint,
  PhoneCallingRounded,
  UserRounded,
} from "@solar-icons/react";
import toast from "react-hot-toast";
import { isPhoneNumberValid, verifyIranianNationalId } from "@persian-tools/persian-tools";

import CustomButton from "@/components/widgets/CustomButton";
import CustomInput from "@/components/widgets/CustomInput";
import CustomDropdown from "@/components/widgets/CustomDropdown";
import LeftDrawer from "@/components/drawers/LeftDrawer";
import PlaqueInput from "@/components/widgets/PlaqueInput";
import { CityListType } from "@/lib/schemas/city-list.schema";
import { TruckListType } from "@/lib/schemas/truck-list.schema";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import { AddDriverRequestType } from "@/lib/schemas/driver-list.schema";

type GetNotifiedForm = {
  mobile_number: string;
  truck_id: number;
  loading_city_id: number;
  discharging_city_id: number;
};

export default function GetNotifiedNewPage() {
  const router = useRouter();

  const [citiesData, setCitiesData] = useState<CityListType | null>(null);
  const [trucksData, setTrucksData] = useState<TruckListType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [addDriverLoading, setAddDriverLoading] = useState<boolean>(false);
  const [addDriverDrawerOpen, setAddDriverDrawerOpen] = useState(false);

  const [formData, setFormData] = useState<GetNotifiedForm>({
    mobile_number: "",
    truck_id: 0,
    loading_city_id: 0,
    discharging_city_id: 0,
  });

  const [errors, setErrors] = useState({
    mobileNumber: "",
    loadingCityId: "",
    dischargingCityId: "",
    truckId: "",
  });
  const [driverFormData, setDriverFormData] = useState<AddDriverRequestType>({
    name: "",
    last_name: "",
    mobile_number: "",
    national_code: "",
    license_plate_part_a: "",
    license_plate_part_b: "",
    license_plate_part_c: "",
    license_plate_part_d: "",
    city_id: 0,
    truck_id: 0,
  });
  const [driverErrors, setDriverErrors] = useState({
    palque: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    nationalId: "",
    cityId: "",
    truckId: "",
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
    useBreadcrumbStore.getState().setName("ثبت با خبر شو");
  }, []);

  useEffect(() => {
    fetchFormData();
  }, [fetchFormData]);

  function validateForm() {
    let isValid = true;

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

    return isValid;
  }

  function validateDriverForm() {
    let isValid = true;

    if ((driverFormData.license_plate_part_a + driverFormData.license_plate_part_b + driverFormData.license_plate_part_c + driverFormData.license_plate_part_d).length < 8) {
      setDriverErrors((prev) => ({ ...prev, palque: "شماره پلاک کامل نیست" }));
      isValid = false;
    }

    if (driverFormData.name.trim().length < 3) {
      setDriverErrors((prev) => ({ ...prev, firstName: "نام باید حداقل 3 کاراکتر باشد" }));
      isValid = false;
    }

    if (driverFormData.last_name.trim().length < 3) {
      setDriverErrors((prev) => ({ ...prev, lastName: "نام خانوادگی باید حداقل 3 کاراکتر باشد" }));
      isValid = false;
    }

    if (!isPhoneNumberValid(driverFormData.mobile_number)) {
      setDriverErrors((prev) => ({ ...prev, phoneNumber: "شماره تماس نامعتبر است" }));
      isValid = false;
    }

    if (!verifyIranianNationalId(driverFormData.national_code)) {
      setDriverErrors((prev) => ({ ...prev, nationalId: "کد ملی نامعتبر است" }));
      isValid = false;
    }

    if (!driverFormData.city_id) {
      setDriverErrors((prev) => ({ ...prev, cityId: "شهر را انتخاب کنید" }));
      isValid = false;
    }

    if (!driverFormData.truck_id) {
      setDriverErrors((prev) => ({ ...prev, truckId: "ناوگان را انتخاب کنید" }));
      isValid = false;
    }

    return isValid;
  }

  function buildGetNotifiedPayload() {
    return {
      mobile_number: formData.mobile_number,
      truck_id: formData.truck_id,
      loading_city_id: formData.loading_city_id,
      discharging_city_id: formData.discharging_city_id,
    };
  }

  async function postGetNotified() {
    const response = await fetch("/api/get-notified", {
      method: "POST",
      body: JSON.stringify(buildGetNotifiedPayload()),
    });

    const result = await response.json();

    return { response, result };
  }

  function formatToastMessage(message?: string) {
    return message?.replaceAll("جی بار", "بارمکث");
  }

  async function submitNewItem() {
    if (!validateForm()) return;

    try {
      setSubmitLoading(true);

      const { response, result } = await postGetNotified();

      if (!response.ok) {
        toast.error(formatToastMessage(result?.error || result?.message) || "خطا در ثبت مورد");
        return;
      }

      if (result?.data?.new_user) {
        setDriverFormData((prev) => ({
          ...prev,
          mobile_number: formData.mobile_number,
          truck_id: formData.truck_id,
          city_id: formData.loading_city_id,
        }));
        setDriverErrors({
          palque: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          nationalId: "",
          cityId: "",
          truckId: "",
        });
        toast(formatToastMessage(result?.message) || "برای این شماره ابتدا راننده را اضافه کنید");
        setAddDriverDrawerOpen(true);
        return;
      }

      toast.success(formatToastMessage(result?.message) || "با موفقیت ثبت شد");
      router.push("/get-notified");
    } catch (error) {
      console.error("Error Posting get-notified:", error);
      toast.error("خطا در ثبت مورد");
    } finally {
      setSubmitLoading(false);
    }
  }

  function normalizeDigits(value: unknown) {
    return String(value ?? "")
      .trim()
      .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit).toString())
      .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit).toString())
      .replace(/\D/g, "");
  }

  function normalizePlatePart(value: unknown) {
    return String(value ?? "")
      .trim()
      .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit).toString())
      .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit).toString());
  }

  function normalizePlateLetterForSave(value: unknown) {
    const letter = normalizePlatePart(value);
    if (letter === "ه") return "هـ";
    if (letter === "ا" || letter === "آ") return "الف";
    return letter;
  }

  function buildDriverPayload(driver: AddDriverRequestType): AddDriverRequestType {
    return {
      ...driver,
      name: driver.name.trim(),
      last_name: driver.last_name.trim(),
      mobile_number: normalizeDigits(driver.mobile_number).slice(0, 11),
      national_code: normalizeDigits(driver.national_code).slice(0, 10),
      license_plate_part_a: normalizePlatePart(driver.license_plate_part_a).slice(0, 2),
      license_plate_part_b: normalizePlateLetterForSave(driver.license_plate_part_b),
      license_plate_part_c: normalizePlatePart(driver.license_plate_part_c).slice(0, 3),
      license_plate_part_d: normalizePlatePart(driver.license_plate_part_d).slice(0, 2),
    };
  }

  async function submitNewDriver() {
    if (!validateDriverForm()) return;

    try {
      setAddDriverLoading(true);

      const driverResponse = await fetch("/api/drivers", {
        method: "POST",
        body: JSON.stringify(buildDriverPayload(driverFormData)),
      });
      const driverResult = await driverResponse.json();

      if (!driverResponse.ok) {
        toast.error(formatToastMessage(driverResult?.error || driverResult?.message) || "خطا در ثبت راننده");
        return;
      }

      const { response, result } = await postGetNotified();

      if (!response.ok) {
        toast.error(formatToastMessage(result?.error || result?.message) || "راننده اضافه شد، اما ثبت با خبر کن ناموفق بود");
        return;
      }

      toast.success(formatToastMessage(result?.message) || "راننده و با خبر کن با موفقیت ثبت شد");
      setAddDriverDrawerOpen(false);
      router.push("/get-notified");
    } catch (error) {
      console.error("Error Posting new driver for get-notified:", error);
      toast.error("خطا در ثبت راننده");
    } finally {
      setAddDriverLoading(false);
    }
  }

  if (loading) {
    return null;
  }

  const cities = Array.isArray(citiesData?.data) ? citiesData.data : [];
  const trucks = Array.isArray(trucksData?.data) ? trucksData.data : [];
  const cityOptions = [
    { value: 0, label: "انتخاب کنید" },
    ...cities.map((city) => ({
      value: city.id,
      label: city.name,
    })),
  ];
  const truckOptions = [
    { value: 0, label: "انتخاب کنید" },
    ...trucks.map((truck) => ({
      value: truck.id,
      label: truck.name,
    })),
  ];

  return (
    <>
      <section className="container mx-auto px-0 py-3 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light">
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6">
            <CustomInput
              placeholder="شماره تماس"
              icon={<PhoneCallingRounded />}
              value={formData.mobile_number}
              error={errors.mobileNumber}
              setValue={(value) => {
                setFormData({ ...formData, mobile_number: value });
                setErrors((prev) => ({ ...prev, mobileNumber: "" }));
              }}
              handleAction={() => submitNewItem()}
              background="bg-background-light dark:bg-background-dark"
              type="number"
              maxLength={11}
            />
          </div>

          <div className="lg:col-span-6">
            <CustomDropdown
              value={formData.truck_id}
              onChange={(value) => {
                setFormData({ ...formData, truck_id: Number(value) });
                setErrors((prev) => ({ ...prev, truckId: "" }));
              }}
              placeholder="ناوگان"
              icon={<Bus />}
              options={truckOptions}
              background="bg-background-light dark:bg-background-dark"

            />
            <p className={`text-xs mr-4 ${errors.truckId ? "text-red-500" : "text-transparent"}`}>
              {errors.truckId || "-"}
            </p>
          </div>

          <div className="lg:col-span-6">
            <CustomDropdown
              value={formData.loading_city_id}
              onChange={(value) => {
                setFormData({ ...formData, loading_city_id: Number(value) });
                setErrors((prev) => ({ ...prev, loadingCityId: "" }));
              }}
              placeholder="مبدا"
              icon={<MapPoint />}
              options={cityOptions}
              background="bg-background-light dark:bg-background-dark"
            />
            <p
              className={`text-xs mr-4 ${errors.loadingCityId ? "text-red-500" : "text-transparent"
                }`}
            >
              {errors.loadingCityId || "-"}
            </p>
          </div>

          <div className="lg:col-span-6">
            <CustomDropdown
              value={formData.discharging_city_id}
              onChange={(value) => {
                setFormData({ ...formData, discharging_city_id: Number(value) });
                setErrors((prev) => ({ ...prev, dischargingCityId: "" }));
              }}
              placeholder="مقصد"
              icon={<MapPoint />}
              options={cityOptions}
              background="bg-background-light dark:bg-background-dark"
            />
            <p
              className={`text-xs mr-4 ${errors.dischargingCityId ? "text-red-500" : "text-transparent"
                }`}
            >
              {errors.dischargingCityId || "-"}
            </p>
          </div>

          <div className="lg:col-span-12 flex justify-end mt-2">
            <CustomButton
              onClick={() => submitNewItem()}
              title={'ثبت'}
              icon={<AddSquare size={18} />}
              disabled={submitLoading}
              loading={submitLoading}
            />
          </div>
        </div>
      </section>
      <LeftDrawer isOpen={addDriverDrawerOpen} onClose={() => setAddDriverDrawerOpen(false)}>
        <div className="flex flex-col h-full space-y-4">
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-semibold">افزودن راننده</h2>
          </div>
          <div className="flex-1 overflow-auto flex flex-col gap-2 p-1">
            <div className="flex justify-center mb-2">
              <PlaqueInput
                key={driverFormData.mobile_number}
                error={driverErrors.palque}
                initialValues={[
                  driverFormData.license_plate_part_a,
                  driverFormData.license_plate_part_b,
                  driverFormData.license_plate_part_c,
                  driverFormData.license_plate_part_d,
                ]}
                onValueChange={(valA, valB, valC, valD) => {
                  setDriverFormData({
                    ...driverFormData,
                    license_plate_part_a: valA,
                    license_plate_part_b: valB,
                    license_plate_part_c: valC,
                    license_plate_part_d: valD,
                  });
                  setDriverErrors((prev) => ({ ...prev, palque: "" }));
                }}
              />
            </div>

            <CustomInput
              placeholder="نام"
              icon={<UserRounded />}
              value={driverFormData.name}
              error={driverErrors.firstName}
              setValue={(value) => {
                setDriverFormData({ ...driverFormData, name: value });
                setDriverErrors((prev) => ({ ...prev, firstName: "" }));
              }}
              handleAction={() => { }}
            />

            <CustomInput
              placeholder="نام خانوادگی"
              icon={<UserRounded />}
              value={driverFormData.last_name}
              error={driverErrors.lastName}
              setValue={(value) => {
                setDriverFormData({ ...driverFormData, last_name: value });
                setDriverErrors((prev) => ({ ...prev, lastName: "" }));
              }}
              handleAction={() => { }}
            />

            <CustomDropdown
              value={driverFormData.city_id}
              onChange={(value) => {
                setDriverFormData({ ...driverFormData, city_id: value as number });
                setDriverErrors((prev) => ({ ...prev, cityId: "" }));
              }}
              error={driverErrors.cityId}
              placeholder="انتخاب شهر"
              icon={<MapPoint />}
              options={citiesData !== null ? citiesData.data.map((city) => ({
                value: city.id,
                label: city.name,
              })) : []}
            />

            <CustomDropdown
              value={driverFormData.truck_id}
              onChange={(value) => {
                setDriverFormData({ ...driverFormData, truck_id: value as number });
                setDriverErrors((prev) => ({ ...prev, truckId: "" }));
              }}
              placeholder="انتخاب ناوگان"
              error={driverErrors.truckId}
              icon={<Bus />}
              options={trucksData !== null ? trucksData.data.map((truck) => ({
                value: truck.id,
                label: truck.name,
              })) : []}
            />

            <CustomInput
              placeholder="شماره تماس"
              icon={<PhoneCallingRounded />}
              value={driverFormData.mobile_number}
              error={driverErrors.phoneNumber}
              maxLength={11}
              setValue={() => { }}
              handleAction={() => { }}
              type="number"
              disabled
            />

            <CustomInput
              placeholder="کد ملی"
              icon={<Card />}
              value={driverFormData.national_code}
              error={driverErrors.nationalId}
              maxLength={10}
              setValue={(value) => {
                setDriverFormData({ ...driverFormData, national_code: value });
                setDriverErrors((prev) => ({ ...prev, nationalId: "" }));
              }}
              handleAction={() => { }}
              type="number"
            />
          </div>

          <div className="flex gap-2 w-full">
            <div className="flex-1">
              <CustomButton
                onClick={() => setAddDriverDrawerOpen(false)}
                title="لغو"
                minWidth="w-full"
                background="bg-gray-200"
                foreground="text-gray-700"
              />
            </div>

            <div className="flex-1">
              <CustomButton
                onClick={submitNewDriver}
                title="افزودن"
                minWidth="w-full"
                loading={addDriverLoading}
                icon={<AddSquare size={18} />}
              />
            </div>
          </div>
        </div>
      </LeftDrawer>
    </>
  );
}
