"use client";

import { useState } from "react";
import {
  AddSquare,
  Card2,
  ChatSquareCheck,
  CheckCircle,
  ClockCircle,
  PhoneCallingRounded,
  Power,
  SdCard,
  UserRounded,
} from "@solar-icons/react";
import CustomButton from "@/components/widgets/CustomButton";
import LeftDrawer from "@/components/drawers/LeftDrawer";
import CustomInput from "@/components/widgets/CustomInput";
import CustomDropdown from "@/components/widgets/CustomDropdown";



export default function AdminUsers() {
  const [formData, setFormData] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    vehicleType: "",
    plaque: "",
  });

  const [addCustomerDrawerOpen, setAddCustomerDrawerOpen] = useState(false);


  const [vehicleTypeOptions] = useState([{
    value: 'car',
    label: 'سواری'
  }, {
    value: 'truck',
    label: 'کامیون'
  }]);


  return (
    <>
      <section className="container mx-auto px-0 py-3 text-xs">
        <div className="relative space-y-6 text-center bg-card-light dark:bg-card-dark border-gray-light dark:border-gray-dark rounded-4xl p-4">
          <p className="text-base font-semibold mb-6">کمپین تخفیف زمان دار</p>

          <div className="flex items-center gap-3">
            <div className="flex flex-1 justify-between items-center bg-background-light dark:bg-background-dark
                  border border-gray-light dark:border-gray-dark p-3 rounded-full">
              <div className="flex items-center gap-1 text-xs mr-2.5">
                <ClockCircle size={20} />
                <p>شروع کمپین</p>
                <span className="font-medium text-sm">
                  {'1404/09/20'}
                </span>
              </div>
            </div>

            <div className="flex flex-1 justify-between items-center bg-background-light dark:bg-background-dark
                  border border-gray-light dark:border-gray-dark p-1.5 rounded-full">
              <div className="flex flex-1 items-center gap-1 text-xs mr-4">
                <ClockCircle size={20} />
                <p>پایان کمپین</p>
                <span className="flex-1 font-medium text-sm text-right">{'1404/09/25'}</span>
                <CustomButton
                  onClick={() => { }}
                  title="تمدید کمپین"
                  background="bg-accent"
                  lowHeight={true}
                  minWidth="min-w-28"
                  foreground="text-card-dark"
                />
              </div>
            </div>

          </div>

          <div className="flex flex-col items-center text-center justify-center gap-4 p-3 rounded-4xl border
                border-gray-light dark:border-gray-dark bg-background-light dark:bg-background-dark">
            <p className="text-base font-medium">مخاطب کمپین</p>

            <div className="flex justify-between gap-16 items-center min-w-full">

              <div className="flex items-center gap-1 justify-center font-medium">
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
                <p className="text-sm">همه کاربران(۵۰۳ نفر)</p>
              </div>

              <div className="flex gap-6 items-center justify-start">
                <div className="flex items-center gap-1 justify-center font-medium">
                  <label className="inline-flex items-center cursor-pointer text-center">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => { }}
                      className="sr-only peer" // Hide default checkbox
                    />
                    <div className="relative justify-items-center bg-background-light dark:bg-card-dark border border-gray-light dark:border-gray-dark rounded-full peer-checked:bg-primary peer-checked:border-primary transition-all">
                      <CheckCircle size={16} className="text-background-light dark:text-card-dark" />
                    </div>
                  </label>
                  <p>طلایی(۴۳ نفر)</p>
                </div>

                <div className="flex items-center gap-1 justify-center font-medium">
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
                  <p>نقره‌ای(۱۲۰ نفر)</p>
                </div>

                <div className="flex items-center gap-1 justify-center font-medium">
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
                  <p>برنزی(۳۴۰ نفر)</p>
                </div>
              </div>

            </div>

          </div>

          <div className="flex flex-col items-center text-center justify-center gap-4 p-3 rounded-4xl border
                border-gray-light dark:border-gray-dark bg-background-light dark:bg-background-dark">
            <p className="text-sm font-medium">میانگین تعداد سرویس‌های انجام شده در هر روز</p>
            <div className="flex min-w-full items-center gap-2 font-medium">
              <span>قبل از کمپین</span>
              <div className="bg-gray-500 rounded-full w-96 h-2" />
              <span className="text-gray-500">۵۰ سرویس</span>
            </div>
            <div className="flex min-w-full items-center gap-2 font-medium">
              <span>بعد از کمپین</span>
              <div className="bg-accent rounded-full w-xl h-2" />
              <span className="text-accent">70 سرویس</span>
            </div>
          </div>


          <div className="flex flex-col items-center text-center justify-center gap-4 p-3 rounded-4xl border
                border-gray-light dark:border-gray-dark bg-background-light dark:bg-background-dark">
            <p className="text-sm font-medium">میزان استفاده از تخفیف کمپین</p>

            <div className="flex min-w-full justify-between">
              <div className="flex items-center gap-1 font-medium">
                <span>تعداد کل مشتریان استفاده کننده از تخفیف:</span>
                <span className="text-base font-medium text-primary">120 نفر</span>
              </div>
              <div className="flex items-center gap-1 font-medium">
                <span>تعداد سرویس‌های انجام شده:</span>
                <span className="text-base font-medium text-primary">180 سرویس</span>
              </div>

              <div className="flex items-center gap-1 font-medium">
                <span>میزان تخفیف داده شده:</span>
                <span className="text-base font-medium text-primary">3,600,000 تومان</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center text-center justify-center gap-4 p-3 rounded-4xl border
                border-red-100 bg-red-50">
            <p className="text-sm font-medium">هزینه‌های مربوط به پیامک</p>

            <div className="flex min-w-full justify-between">
              <div className="flex items-center gap-1 font-medium">
                <span>هزینه پیامک‌های ارسال شده</span>
                <span className="text-base font-medium text-red-400">35,000 تومان</span>
              </div>

              <div className="flex items-center gap-1 font-medium">
                <span>تعداد پیامک‌های ارسال شده</span>
                <span className="text-base font-medium text-red-400">503</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-16">
            <div className="flex items-center gap-2">
              <CustomButton
                onClick={() => { }}
                title="ارسال مجدد پیامک"
                background="bg-secondary"
                foreground="text-gray-700"
                icon={<ChatSquareCheck size={18} />}
              />
            </div>
            <div className="flex items-center gap-2">
              <CustomButton
                onClick={() => { }}
                title="غیرفعال سازی کمپین"
                background="bg-red-400"
                icon={<Power size={18} />}
              />
              <CustomButton
                onClick={() => { }}
                title="ذخیره تغییرات"
                icon={<SdCard size={18} />} />
            </div>
          </div>

        </div>

      </section>

      <LeftDrawer isOpen={addCustomerDrawerOpen} onClose={() => setAddCustomerDrawerOpen(false)} >
        <div className="flex flex-col h-full space-y-4">
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-bold">افزودن مشتری</h2>
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
              placeholder="شماره پلاک"
              icon={<Card2 />}
              value={formData.plaque}
              setValue={(value) => setFormData({ ...formData, plaque: value })}
              handleAction={() => { }}
              type="number"
            />

            <CustomDropdown
              options={vehicleTypeOptions}
              value={''}
              onChange={() => { }}
              placeholder="انتخاب نوع خودرو"
            />
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
