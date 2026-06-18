"use client";

import CustomButton from "@/components/widgets/CustomButton";
import CustomDropdown from "@/components/widgets/CustomDropdown";
import CustomInput from "@/components/widgets/CustomInput";
import CustomSwitch from "@/components/widgets/CustomSwitch";
import { ChatRound, ChatRoundCheck, ClockCircle, CupFirst, SaleSquare, SdCard } from "@solar-icons/react";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    vehicleType: "",
    plaque: "",
  });


  return (
    <>
      <section className="container mx-auto px-0 py-3 space-y-6">

        <div className="space-y-4 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light p-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="p-3 rounded-full text-primary dark:text-indigo-400 border border-gray-light dark:border-gray-dark">
                <ChatRound size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">ارسال پیامک شروع سرویس</p>
                <p className="text-xs text-gray-500">برای مشتری پیامک شروع سرویس خودرو ارسال شود</p>
              </div>
            </div>

            <CustomSwitch
              checked={true}
              onChange={() => { }} />
          </div>

           <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="p-3 rounded-full text-primary dark:text-indigo-400 border border-gray-light dark:border-gray-dark">
                <ChatRoundCheck size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">ارسال پیامک پایان سرویس</p>
                <p className="text-xs text-gray-500">برای مشتری پیامک پایان سرویس خودرو ارسال شود</p>
              </div>
            </div>

            <CustomSwitch
              checked={true}
              onChange={() => { }} />
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light p-3">
          <div className="flex justify-between mt-2 mb-6 items-center">
            <p className="text-base font-semibold mb-2 mr-4">بازه زمان مقیاس سطح مشتری</p>
            <CustomDropdown
              options={[{ value: '1', label: '۱ ماه' }, { value: '2', label: '۳ ماه' }, { value: '3', label: '۶ ماه' }]}
              value={'1'}
              onChange={() => { }}
              background="bg-background-light dark:bg-background-dark"
              placeholder="انتخاب نوع کمپین"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="p-3 rounded-full text-yellow-400 border border-gray-light dark:border-gray-dark">
                <CupFirst size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">حداقل خرید مشتری طلایی</p>
                <p className="text-xs text-gray-500">مشتری برای اینکه به سطح طلایی برسد، چقدر باید در بازه زمانی مشخص شده خرید داشته باشد</p>
              </div>
            </div>

            <CustomInput
              placeholder="حداقل خرید"
              icon={<ShoppingCart/>}
              value={formData.firstName}
              setValue={(value) => setFormData({ ...formData, lastName: value })}
              background="bg-background-light dark:bg-background-dark"
              handleAction={() => { }}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="p-3 rounded-full text-slate-400 border border-gray-light dark:border-gray-dark">
                <CupFirst size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">حداقل خرید مشتری نقره‌ای</p>
                <p className="text-xs text-gray-500">مشتری برای اینکه به سطح نقره‌ای برسد، چقدر باید در بازه زمانی مشخص شده خرید داشته باشد</p>
              </div>
            </div>

            <CustomInput
              placeholder="حداقل خرید"
              icon={<ShoppingCart/>}
              value={formData.firstName}
              setValue={(value) => setFormData({ ...formData, lastName: value })}
              background="bg-background-light dark:bg-background-dark"
              handleAction={() => { }}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="p-3 rounded-full text-yellow-600 border border-gray-light dark:border-gray-dark">
                <CupFirst size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">حداقل خرید مشتری برنزی</p>
                <p className="text-xs text-gray-500">مشتری برای اینکه به سطح برنزی برسد، چقدر باید در بازه زمانی مشخص شده خرید داشته باشد</p>
              </div>
            </div>

            <CustomInput
              placeholder="حداقل خرید"
              icon={<ShoppingCart/>}
              value={formData.firstName}
              setValue={(value) => setFormData({ ...formData, lastName: value })}
              background="bg-background-light dark:bg-background-dark"
              handleAction={() => { }}
            />
          </div>
        </div>

        <div className="space-y-4 bg-card-light dark:bg-card-dark rounded-4xl text-background-dark dark:text-background-light p-3">
          <div className="flex justify-between mt-2 mb-6">
            <p className="text-base font-semibold mb-2 mr-4">یادآور مشتری مراجعه نکرده</p>
            <CustomSwitch
              checked={true}
              onChange={() => { }} />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="p-3 rounded-full text-primary dark:text-indigo-400 border border-gray-light dark:border-gray-dark">
                <ClockCircle size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">ارسال پیامک برای مشتری مراجعه نکرده</p>
                <p className="text-xs text-gray-500">بعد از چه مدت زمانی از آخرین مراجعه مشتری، پیامک تخفیف ارسال شود</p>
              </div>
            </div>

            <CustomDropdown
              options={[{ value: '1', label: 'بعد از ۱ ماه' }, { value: '2', label: 'بعد از ۳ ماه' }, { value: '3', label: 'بعد از ۶ ماه' }]}
              value={'1'}
              onChange={() => { }}
              background="bg-background-light dark:bg-background-dark"
              placeholder="انتخاب نوع کمپین"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="p-3 rounded-full text-primary dark:text-indigo-400 border border-gray-light dark:border-gray-dark">
                <SaleSquare size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">میزان تخفیف</p>
                <p className="text-xs text-gray-500">برای مشتری مراجعه نکرده در اولین مراجعه‌اش چقدر تخفیف اعمال شود</p>
              </div>
            </div>
            <CustomInput
              placeholder="میزان تخفیف"
              icon={<ShoppingCart/>}
              value={formData.lastName}
              setValue={(value) => setFormData({ ...formData, lastName: value })}
              background="bg-background-light dark:bg-background-dark"
              handleAction={() => { }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <CustomButton
            title="ذخیره تغییرات"
            icon={<SdCard size={18} />}
          />
        </div>
      </section>
    </>
  );
}
