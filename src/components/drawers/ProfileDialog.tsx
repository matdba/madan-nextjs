"use client";

import { UserRounded, Settings } from "@solar-icons/react";
import Image from "next/image";
import CustomInput from "@/components/widgets/CustomInput";
import CustomButton from "@/components/widgets/CustomButton";

export type ProfileForm = {
  title: string;
  register_number: string;
  hall_image: string;
  private_hall: boolean;
  wallet: number;
};

type ProfileDialogProps = {
  open: boolean;
  onClose: () => void;
  form: ProfileForm;
  setForm: (value: ProfileForm) => void;
  onSave: (payload: Omit<ProfileForm, "wallet">) => void;
  saving: boolean;
};

export default function ProfileDialog({
  open,
  onClose,
  form,
  setForm,
  onSave,
  saving,
}: ProfileDialogProps) {
  if (!open) return null;

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
  const imageUrl =
    form.hall_image && !form.hall_image.startsWith("http")
      ? `${baseUrl}/${form.hall_image.replace(/^\/+/, "")}`
      : form.hall_image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
      <div className="w-full max-w-3xl rounded-4xl bg-card-light dark:bg-card-dark border border-gray-light dark:border-gray-dark p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-semibold">پروفایل کاربری</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-light dark:border-gray-dark bg-background-light dark:bg-background-dark">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="profile"
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <UserRounded size={28} />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            placeholder="عنوان"
            icon={<UserRounded />}
            value={form.title}
            setValue={(value) => setForm({ ...form, title: value })}
            handleAction={() =>
              onSave({
                title: form.title,
                register_number: form.register_number,
                hall_image: form.hall_image,
                private_hall: form.private_hall,
              })
            }
            background="bg-background-light dark:bg-background-dark"
          />
          <CustomInput
            placeholder="شماره ثبت"
            icon={<Settings />}
            value={form.register_number}
            setValue={(value) => setForm({ ...form, register_number: value })}
            handleAction={() =>
              onSave({
                title: form.title,
                register_number: form.register_number,
                hall_image: form.hall_image,
                private_hall: form.private_hall,
              })
            }
            background="bg-background-light dark:bg-background-dark"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <CustomButton
            onClick={onClose}
            title="بستن"
            background="bg-gray-200"
            foreground="text-gray-700"
          />
          <CustomButton
            onClick={() =>
              onSave({
                title: form.title,
                register_number: form.register_number,
                hall_image: form.hall_image,
                private_hall: form.private_hall,
              })
            }
            title={saving ? "در حال بروزرسانی..." : "بروزرسانی پروفایل"}
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
}
