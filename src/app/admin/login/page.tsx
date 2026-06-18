'use client';

import CustomButton from "@/components/widgets/CustomButton";
import CustomInput from "@/components/widgets/CustomInput";
import { LockPassword, Moon, Sun, UserId } from "@solar-icons/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useTheme } from "next-themes";


export default function LoginPage() {
  const { status } = useSession();
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });

  const [loginLoading, setLoginLoading] = useState(false);
  const [errors, setErrors] = useState({
    userId: '',
    password: '',
  });


  const router = useRouter();

  async function handleLogin() {
    if (!formData.userId.trim()) {
      setErrors((prev) => ({ ...prev, userId: "نام کاربری را وارد کنید" }));
      return;
    }

    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "رمز عبور را وارد کنید" }));
      return;
    }

    setLoginLoading(true);

    try {
      const response = await signIn("credentials", {
        userId: formData.userId.trim(),
        password: formData.password,
        redirect: false,
      });

      if (response?.ok) {
        router.push('/projects');
        toast.success('خوش آمدید');
        return;
      }

      toast.error(response?.error === "CredentialsSignin" ? "نام کاربری یا رمز عبور اشتباه است" : response?.error || 'خطا در ورود');

    } catch (err: unknown) {
      console.error('Login failed:', err);

      if (err instanceof TypeError) {
        toast.error('مشکل در ارتباط با سرور. اینترنت را بررسی کنید.');
      } else {
        toast.error((err as Error).message || 'خطای غیرمنتظره');
      }
    } finally {
      setLoginLoading(false);
    }
  }

  if (status === "authenticated" || status === "loading") {
    return null;
  }

  return (
    <>
      <section className="relative isolate h-[100lvh] overflow-hidden flex items-center justify-center px-2 py-2 sm:p-6 bg-background-light dark:bg-background-dark">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-slate-900 opacity-[0.08] dark:bg-white dark:opacity-[0.10]"
          style={{
            WebkitMaskImage: "url('/images/cargo-pattern.svg')",
            WebkitMaskRepeat: "repeat",
            WebkitMaskSize: "112px 96px",
            maskImage: "url('/images/cargo-pattern.svg')",
            maskRepeat: "repeat",
            maskSize: "112px 96px",
          }}
        />

        <button
          type="button"
          onClick={() => setTheme(isDarkMode ? "light" : "dark")}
          className="absolute left-2 top-2 z-20 flex h-12 w-12 items-center justify-center hover:bg-secondary/40 rounded-full border border-gray-light dark:border-gray-dark bg-card-light dark:bg-card-dark text-card-dark dark:text-card-light transition-colors sm:left-6 sm:top-6"
          aria-label={isDarkMode ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"}
          suppressHydrationWarning
        >
          {isDarkMode ? (
            <Sun size={22} className="text-secondary" weight="Bold" />
          ) : (
            <Moon size={22} className="text-gray-700 dark:text-gray-200" />
          )}
        </button>

        <div className="relative z-10 mx-auto w-full max-w-none px-4 py-4 rounded-4xl bg-card-light dark:bg-card-dark border border-gray-light dark:border-gray-dark sm:max-w-md sm:px-10">
          <p className="text-4xl font-bold text-center mt-4 text-primary">معدن</p>
          <p className="text-base font-normal text-center mb-12 mt-2 text-card-dark dark:text-card-light">پنل مدیریت</p>

          <div className="space-y-4">
            <CustomInput
              placeholder="نام کاربری"
              icon={<UserId weight="Bold" />}
              value={formData.userId}
              setValue={(value) => {
                setFormData({ ...formData, userId: value });
                setErrors((prev) => ({ ...prev, userId: "" }));
              }}
              error={errors.userId}
              handleAction={handleLogin}
              background="bg-background-light dark:bg-background-dark"
              type="text"
            />

            <CustomInput
              placeholder="رمز عبور"
              icon={<LockPassword weight="Bold" />}
              value={formData.password}
              setValue={(value) => {
                setFormData({ ...formData, password: value });
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              error={errors.password}
              handleAction={handleLogin}
              background="bg-background-light dark:bg-background-dark"
              type="password"
            />

            <div className="flex w-full justify-center">
              <CustomButton
                onClick={handleLogin}
                title={'ورود'}
                loading={loginLoading}

                type="button"
                background="bg-primary"
                minWidth="w-48"
              />
            </div>
          </div>

          {/*
          <div className="flex justify-between mt-8">
            <button
              className="text-primary dark:text-indigo-400 flex items-center gap-1">
              فراموشی رمز ورود
              <AltArrowLeft size={18} />
            </button>
            <button
              className="text-primary dark:text-indigo-400 flex items-center gap-1">
              ورود با کد یک بار مصرف
              <AltArrowLeft size={18} />
            </button>
          </div> */}


        </div>

      </section >
    </>
  )
}
