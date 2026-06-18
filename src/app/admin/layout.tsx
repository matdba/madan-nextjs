"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import {
  UsersGroupRounded,
  HomeAngle2,
  AltArrowRight,
  AltArrowLeft,
  AddSquare,
  UsersGroupTwoRounded,
  ShieldUser,
  ShieldKeyhole,
  Wheel,
  WheelAngle,
  Bus,
  StopCircle,
  CheckSquare,
  CaseMinimalistic,
  Layers,
  Logout,
  AltArrowDown,
  UserRounded,
  Moon,
  BellBing,
  Sun,
  VolumeLoud,
  Wallet2,
  ChatRoundCheck,
  HamburgerMenu,
} from "@solar-icons/react";
import { useTheme } from "next-themes";
import { useBreadcrumbStore } from "@/store/breadcrumb-store";
import CustomButton from "@/components/widgets/CustomButton";
import { Toaster } from 'react-hot-toast';
import toast from "react-hot-toast";
import ProfileDialog, { ProfileForm } from "@/components/drawers/ProfileDialog";
import WalletChargeDialog, { WalletChargeForm } from "@/components/drawers/WalletChargeDialog";

interface MyButtonProps {
  children?: React.ReactNode;
}

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  filledIcon?: React.ReactNode;
  path: string;
  seperate?: boolean;
  separatorBefore?: boolean;
  subItems?: MenuItem[];
}


export default function PanelLayout({ children }: MyButtonProps) {
  const { data: session, status, update } = useSession();

  console.log('session', session);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const breadcrumbName = useBreadcrumbStore((s) => s.name);
  const showBreadcrumbName = useBreadcrumbStore((s) => s.showName);


  const path = usePathname();
  const isLoginPage = path === "/login" || path === "/admin/login";
  const profileDisplayName = session?.user?.profile?.title || session?.user?.name || "شرکت باربری";
  const profilePhoneNumber = session?.user?.userId || session?.user?.userData?.UserID || "-";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [walletChargeOpen, setWalletChargeOpen] = useState(false);
  const [walletChargeSaving, setWalletChargeSaving] = useState(false);
  const [mobileMenuTop, setMobileMenuTop] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const mobileMenuTouchStartX = useRef<number | null>(null);

  const toggleSubMenu = (name: string) => {
    setExpandedMenus((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    title: "",
    register_number: "",
    hall_image: "",
    private_hall: false,
    wallet: 0,
  });
  const [walletChargeForm, setWalletChargeForm] = useState<WalletChargeForm>({
    amount: "",
  });


  const menuItems = useMemo<MenuItem[]>(() => [
    // { name: "داشبورد", icon: <HomeAngle2 size={22} />, filledIcon: <HomeAngle2 size={22} weight="Bold" />, path: "/" },
    // { name: "سالن اعلام بار", icon: <AddSquare size={22} />, filledIcon: <AddSquare size={22} weight="Bold" />, path: "/hall" },
    { name: "پروژه‌ها", icon: <CaseMinimalistic size={22} />, filledIcon: <CaseMinimalistic size={22} weight="Bold" />, path: "/projects" },
    { name: "رانندگان", icon: <Wheel size={22} />, filledIcon: <Wheel size={22} weight="Bold" />, path: "/drivers" },
    { name: "ماشین‌آلات", icon: <Bus size={22} />, filledIcon: <Bus size={22} weight="Bold" />, path: "/machinery" },
    {
      name: "انواع", icon: <Layers size={22} />, filledIcon: <Layers size={22} weight="Bold" />, path: "/types", separatorBefore: true, subItems: [
        { name: "انواع ماشین", icon: <WheelAngle size={22} />, filledIcon: <WheelAngle size={22} weight="Bold" />, path: "/machine-types" },
        { name: "انواع توقف", icon: <StopCircle size={22} />, filledIcon: <StopCircle size={22} weight="Bold" />, path: "/stop-types" },
        { name: "انواع فعالیت", icon: <CheckSquare size={22} />, filledIcon: <CheckSquare size={22} weight="Bold" />, path: "/activity-types" },
      ]
    },
    { name: "کاربران", icon: <UsersGroupTwoRounded size={22} />, filledIcon: <UsersGroupTwoRounded size={22} weight="Bold" />, path: "/users" },
    { name: "نقش‌ها", icon: <ShieldUser size={22} />, filledIcon: <ShieldUser size={22} weight="Bold" />, path: "/roles" },
    { name: "دسترسی‌ها", icon: <ShieldKeyhole size={22} />, filledIcon: <ShieldKeyhole size={22} weight="Bold" />, path: "/permissions" },
    // { name: "با خبر شو", icon: <VolumeLoud size={22} />, filledIcon: <VolumeLoud size={22} weight="Bold" />, path: "/get-notified", seperate: true },
    // { name: "ارسال پیامک", icon: <ChatRoundCheck size={22} />, filledIcon: <ChatRoundCheck size={22} weight="Bold" />, path: "/sms" },
    // { name: "کمپین ها", icon: <VolumeLoud size={22} />, filledIcon: <VolumeLoud size={22} weight="Bold" />, path: "/campaigns", seperate: true },
    // { name: "سرویس", icon: <SettingsMinimalistic size={22} />, filledIcon: <SettingsMinimalistic size={22} weight="Bold" />, path: "/services" },
    // { name: "فروشگاه", icon: <CartLargeMinimalistic size={22} />, filledIcon: <CartLargeMinimalistic size={22} weight="Bold" />, path: "/shop" },
    // { name: "جایگاه سرویس", icon: <RecordAudioCircle size={22} />, filledIcon: <RecordAudioCircle size={22} weight="Bold" />, path: "/stations" },
    // { name: "گروه خودرو", icon: <Bus size={22} />, filledIcon: <Bus size={22} weight="Bold" />, path: "/vehicle-types" },
    // { name: "بسته‌های تخفیف", icon: <BoxMinimalistic size={22} />, filledIcon: <BoxMinimalistic size={22} weight="Bold" />, path: "/packages", seperate: true },
    // { name: "متصدیان", icon: <UsersGroupRounded size={22} />, filledIcon: <UsersGroupRounded size={22} weight="Bold" />, path: "/operators" },
  ], []);

  // Flattened list (parents + sub-items) for breadcrumb/active lookups.
  const flatMenuItems = useMemo<MenuItem[]>(
    () => menuItems.flatMap((item) => (item.subItems ? [item, ...item.subItems] : [item])),
    [menuItems]
  );


  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isActive = useCallback(
    (itemPath: string) => {
      if (itemPath === "/") {
        return path === "/" || path === "/dashboard";
      }

      return path === itemPath || path.startsWith(itemPath);
    },
    [path]
  );


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    function preventMenuTouchMove(event: TouchEvent) {
      event.preventDefault();
    }

    function preventMenuWheel(event: WheelEvent) {
      event.preventDefault();
    }

    document.addEventListener("touchmove", preventMenuTouchMove, { passive: false });
    document.addEventListener("wheel", preventMenuWheel, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventMenuTouchMove);
      document.removeEventListener("wheel", preventMenuWheel);
    };
  }, [isMobileMenuOpen]);


  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    console.log('name: ' + breadcrumbName);
  }, [breadcrumbName]);


  useEffect(() => {
    const activeItem = flatMenuItems.find((item) => isActive(item.path));
    const isDashboardRoute = activeItem?.path === "/" && (path === "/" || path === "/dashboard");
    useBreadcrumbStore.getState().setShowName(!isDashboardRoute && path !== activeItem?.path);
  }, [path, isActive, menuItems]);


  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.push('/login');
    }
    if ((status === "authenticated" && isLoginPage)) {
      return router.push('/projects');
    }
  }, [status, isLoginPage, router]);


  async function logout() {
    await signOut({
      redirect: false
    });
    router.push('/login');
  }

  function openMobileMenu() {
    setMobileMenuTop(window.scrollY);
    setIsMobileMenuOpen(true);
  }

  async function updateProfile(payload: {
    title: string;
    register_number: string;
    hall_image: string;
    private_hall: boolean;
  }) {
    try {
      setProfileSaving(true);
      const response = await fetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result?.message || "خطا در بروزرسانی پروفایل");
        return;
      }
      toast.success(result?.message || "پروفایل بروزرسانی شد");
      const nextProfile = {
        ...(session?.user?.profile ?? {}),
        ...payload,
      };
      await update({ profile: nextProfile });
      setProfileOpen(false);
    } catch (error) {
      console.error("profile update error:", error);
      toast.error("خطا در بروزرسانی پروفایل");
    } finally {
      setProfileSaving(false);
    }
  }

  async function chargeWallet(payload: { amount: number }) {
    try {
      if (payload.amount < 1000) {
        toast.error("حداقل مبلغ شارژ ۱,۰۰۰ تومان است");
        return;
      }

      const currentProfile = session?.user?.profile;
      if (!currentProfile) {
        toast.error("پروفایل یافت نشد");
        return;
      }

      setWalletChargeSaving(true);
      const nextWallet = (currentProfile.wallet ?? 0) + payload.amount;

      const response = await fetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify({
          title: currentProfile.title ?? "",
          register_number: currentProfile.register_number ?? "",
          hall_image: currentProfile.hall_image ?? "",
          private_hall: currentProfile.private_hall ?? false,
          wallet: nextWallet,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result?.message || "خطا در شارژ کیف پول");
        return;
      }

      await update({
        profile: {
          ...currentProfile,
          wallet: nextWallet,
        },
      });

      toast.success(result?.message || "کیف پول با موفقیت شارژ شد");
      setWalletChargeOpen(false);
      setWalletChargeForm({ amount: "" });
    } catch (error) {
      console.error("wallet charge error:", error);
      toast.error("خطا در شارژ کیف پول");
    } finally {
      setWalletChargeSaving(false);
    }
  }




  if (!mounted) return null;

  // if ((status === "unauthenticated" && path !== "/login")) {
  //   return router.push('/login');
  // }

  // if ((status === "authenticated" && path === "/login")) {
  //   return router.push('/dashboard');
  // }

  return (
    <Suspense>
      <div className={`relative flex text-sm bg-background-light dark:bg-background-dark text-background-dark dark:text-background-light md:fixed md:inset-0 md:min-h-0 md:overflow-hidden ${isLoginPage ? "h-[100lvh] overflow-hidden" : "min-h-screen min-h-[100dvh] min-h-[100lvh]"}`}>
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="absolute left-0 right-0 z-40 h-[calc(100lvh+96px)] touch-none bg-white/10 backdrop-blur-sm backdrop-saturate-125 dark:bg-background-dark/20 md:hidden"
            style={{ top: mobileMenuTop }}
            onClick={() => setIsMobileMenuOpen(false)}
            onTouchMove={(event) => event.preventDefault()}
            onWheel={(event) => event.preventDefault()}
          />
        )}

        {/* Sidebar */}
        {!isLoginPage && <aside
          className={`bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-dark h-[calc(100lvh-1rem)] md:h-[calc(100dvh-1rem)] transition-transform md:transition-all duration-300 ease-in-out absolute md:relative z-50 m-2 rounded-3xl will-change-transform
        ${isCollapsed ? "w-72 md:w-20" : "w-72"}
        right-0 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-[110%] md:translate-x-0"}
         touch-pan-y overflow-y-auto overscroll-contain`}
          style={{ top: isMobileMenuOpen ? mobileMenuTop : 0 }}
          onTouchStart={(event) => {
            mobileMenuTouchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (mobileMenuTouchStartX.current === null) return;

            const touchEndX = event.changedTouches[0]?.clientX;
            if (typeof touchEndX !== "number") return;

            const swipeDistance = touchEndX - mobileMenuTouchStartX.current;
            if (isMobileMenuOpen && swipeDistance > 60) {
              setIsMobileMenuOpen(false);
            }

            mobileMenuTouchStartX.current = null;
          }}
        >
          {/* Sidebar Header */}
          <div className="p-6">
            <div className="flex items-center justify-between h-12">
              <Link href="/" className="flex items-center gap-3">
                {(!isCollapsed || isMobileMenuOpen) && (
                  <>
                    <div>
                      <h2 className="text-3xl font-bold text-card-dark dark:text-card-light">معدن</h2>
                      <p className="text-sm text-card-dark dark:text-card-light">پنل  مدیریت</p>
                    </div>
                  </>
                )}

              </Link>
              <button
                className="hidden md:block p-1.5 text-card-dark dark:text-card-light border border-gray-300 dark:border-gray-dark rounded-full hover:bg-secondary/20 transition-colors cursor-pointer"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ?
                  <AltArrowLeft size={18} /> :
                  <AltArrowRight size={18} />
                }
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const hasSub = !!item.subItems?.length;
                const childActive = item.subItems?.some((sub) => isActive(sub.path)) ?? false;
                const isExpanded = expandedMenus.includes(item.name) || childActive;
                const showLabels = !isCollapsed || isMobileMenuOpen;

                return (
                  <li key={item.name}>
                    {item.separatorBefore && <div className="w-full h-[.5px] bg-black/10 dark:bg-white/10 mb-2" />}
                    <div className="group">
                      {hasSub ? (
                        <button
                          type="button"
                          onClick={() => toggleSubMenu(item.name)}
                          className={`w-full flex items-center rounded-2xl justify-between px-3 py-2.5 transition-all duration-200 group-hover:bg-primary/20 cursor-pointer
                            ${childActive ? "bg-primary/10 text-primary" : "text-black dark:text-white"}
                          `}
                        >
                          <div className={`flex items-center gap-3 min-w-auto`}>
                            <p className="">{childActive ? item.filledIcon : item.icon}</p>
                            {showLabels &&
                              <span className={`font-medium text-sm whitespace-nowrap transition-opacity duration-200
                              ${isCollapsed && !isMobileMenuOpen ? "opacity-0" : "opacity-100 delay-300"}
                            `}>
                                {item.name}
                              </span>}
                          </div>
                          {showLabels && (
                            <AltArrowDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                          )}
                        </button>
                      ) : (
                        <Link
                          href={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center rounded-2xl justify-between px-3 py-2.5 transition-all duration-200 group-hover:bg-primary/20
                            ${isActive(item.path)
                              ? "bg-primary/10 text-primary"
                              : "text-black dark:text-white"
                            }
                          `}
                        >
                          <div className={`flex items-center gap-3 min-w-auto`}>
                            <p className="">{isActive(item.path) ? item.filledIcon : item.icon}</p>
                            {showLabels &&
                              <span className={`font-medium text-sm whitespace-nowrap transition-opacity duration-200
                              ${isCollapsed && !isMobileMenuOpen ? "opacity-0" : "opacity-100 delay-300"}
                            `}>
                                {item.name}
                              </span>}
                          </div>
                        </Link>
                      )}

                      {hasSub && showLabels && (
                        <div
                          className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"}`}
                        >
                          <div className="overflow-hidden">
                            <ul className="mr-4 space-y-1 border-r border-black/10 dark:border-white/20 pr-2">
                              {item.subItems!.map((sub) => (
                                <li key={sub.name} className="group/sub">
                                  <Link
                                    href={sub.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-200 group-hover/sub:bg-primary/20
                                      ${isActive(sub.path) ? "bg-primary/10 text-primary" : "text-black dark:text-white"}
                                    `}
                                  >
                                    <p className="">{isActive(sub.path) ? sub.filledIcon : sub.icon}</p>
                                    <span className="font-medium text-sm whitespace-nowrap">{sub.name}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {item.seperate && <div className="w-full h-[.5px] bg-black/10 dark:bg-white/10 mt-2" />}
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        }

        {/* Main Content */}
        <main className="flex-1 flex w-full min-w-0 flex-col md:overflow-hidden">
          {/* Header */}
          {!isLoginPage &&
            <header className="sticky top-0 z-30 min-h-16 max-w-[calc(100%-1rem)] bg-card-light dark:bg-card-dark rounded-full mt-2 mx-2 border border-gray-light
              dark:border-gray-dark p-2.5 md:p-2 shrink-0 text-card-dark dark:text-card-light">
              <div className="flex min-w-0 items-center justify-between">
                <button
                  className="md:hidden shrink-0 p-3 bg-background-light dark:bg-background-dark rounded-full border border-gray-light dark:border-gray-dark"
                  onClick={() => {
                    if (isMobileMenuOpen) {
                      setIsMobileMenuOpen(false);
                      return;
                    }

                    openMobileMenu();
                  }}
                  aria-label="باز کردن منو"
                >
                  <HamburgerMenu className="h-5 w-5 text-gray-700 dark:text-card-light" />
                </button>

                {/* Dynamic Breadcrumb */}
                <div className="flex flex-1 items-center gap-1 text-base mr-3 md:mr-4 font-medium min-w-0">

                  {/* {dynamicBreadcrumb.parentName ? ( */}
                  <>
                    <Link
                      href={flatMenuItems.find((item) => isActive(item.path))?.path ?? '/'}
                      className="truncate text-black dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      {flatMenuItems.find((item) => isActive(item.path))?.name}
                    </Link>
                    {showBreadcrumbName && <AltArrowLeft />}
                    {showBreadcrumbName && <p className="truncate">{breadcrumbName}</p>}
                    {/* <span className="text-gray-800 font-medium">{dynamicBreadcrumb.currentName}</span> */}
                  </>
                  {/* // ) : ( */}
                  {/* // <span className="text-gray-800 font-medium">{dynamicBreadcrumb.currentName}</span> */}
                  {/* // )} */}
                </div>
                <div className="flex shrink-0 gap-1 ml-1 md:gap-2 md:ml-4">
                  <div className="flex h-12 w-12 items-center justify-center hover:bg-secondary/40 rounded-full border border-gray-light dark:border-gray-dark bg-background-light dark:bg-background-dark md:h-auto md:w-auto md:p-2.5">
                    <BellBing size={20} />
                  </div>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex h-12 w-12 items-center justify-center hover:bg-secondary/40 rounded-full border border-gray-light dark:border-gray-dark bg-background-light dark:bg-background-dark md:h-auto md:w-auto md:p-2.5">
                    {theme === "dark" ? (
                      <Sun size={18} className="text-secondary" weight="Bold" />
                    ) : (
                      <Moon size={18} className="text-gray-700" />
                    )}
                  </button>
                </div>

                {/* <div className="hidden md:block mx-4">
                  <CustomButton
                    onClick={() => {
                      setWalletChargeForm({ amount: "" });
                      setWalletChargeOpen(true);
                    }}
                    background="bg-accent"
                    // foreground="text-card-dark"
                    title={"اعتبار: " + (session?.user?.profile?.wallet ?? 0).toLocaleString() + ' تومان'}
                    icon={<Wallet2 size={18} />}
                  />
                </div> */}

                <div className="relative shrink-0 profile-dropdown" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex h-12 w-12 md:h-auto md:w-56 items-center justify-center md:justify-start gap-3 p-2 rounded-full transition-all duration-200 hover:bg-secondary/20 cursor-pointer
                    ${dropdownOpen ? 'bg-secondary/20 border border-gray-light dark:border-gray-dark' : 'border border-transparent'}`}
                  >
                    <div className="bg-primary dark:bg-indigo-400 p-2 rounded-full flex items-center justify-center font-semibold">
                      <UserRounded size={20} className="text-white" />
                    </div>
                    <div className="hidden md:flex flex-1 text-right flex-col gap-1">
                      <div className="text-sm font-medium">
                        {profileDisplayName}
                      </div>
                      <div className="text-xs text-primary dark:text-indigo-400 font-medium">{profilePhoneNumber}</div>
                    </div>
                    <AltArrowDown
                      className={`hidden md:block w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute space-y-1 text-sm mt-2 left-0 w-56 p-2 bg-card-light dark:bg-card-dark
                      rounded-4xl border border-gray-light dark:border-gray-dark z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="md:hidden px-2 pt-1 pb-3 mb-1 border-b border-gray-light dark:border-gray-dark">
                        <p className="truncate text-sm font-semibold">{profileDisplayName}</p>
                        <p className="truncate text-xs text-primary dark:text-indigo-400 font-medium mt-1">{profilePhoneNumber}</p>
                      </div>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          const p = session?.user?.profile;
                          setProfileForm({
                            title: p?.title ?? "",
                            register_number: p?.register_number ?? "",
                            hall_image: p?.hall_image ?? "",
                            private_hall: p?.private_hall ?? false,
                            wallet: p?.wallet ?? 0,
                          });
                          setProfileOpen(true);
                        }}
                        className="w-full cursor-pointer flex items-center rounded-full p-2 gap-2 hover:bg-secondary/20 transition-all duration-200 group"
                      >
                        <UserRounded size={18} />
                        <span className="font-medium">پروفایل کاربری</span>
                      </button>

                      <button
                        onClick={logout}
                        className="w-full cursor-pointer flex items-center rounded-full gap-2 p-2 text-red-500 hover:bg-red-500/10 transition-all duration-200 group"
                      >
                        <div className="rounded-full flex items-center justify-center transition-colors duration-200">
                          <Logout size={18} />
                        </div>
                        <span className="font-medium">خروج از حساب</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>
          }

          {/* Page Content */}
          <div className={`flex-1 ${isLoginPage ? "overflow-hidden" : "md:overflow-auto"}`}>
            <div className={isLoginPage ? "p-0" : "pl-4 pr-2 py-4"}>{children}</div>
          </div>
        </main>
        <Toaster
          toastOptions={{
            className: 'rounded-3xl bg-red-500',
            style: {
              padding: '16px',
              color: 'white',
              background: '#03071e',
              borderRadius: '24px',
              fontSize: '14px',
            },
            success: {
              style: {
                background: '#70e000',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#70e000',
              },
            },
            error: {
              style: {
                background: '#e5383b',
                color: 'white',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#e5383b',
              },
            },
          }}
        />
        <ProfileDialog
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          form={profileForm}
          setForm={setProfileForm}
          onSave={updateProfile}
          saving={profileSaving}
        />
        <WalletChargeDialog
          open={walletChargeOpen}
          onClose={() => {
            setWalletChargeOpen(false);
            setWalletChargeForm({ amount: "" });
          }}
          form={walletChargeForm}
          setForm={setWalletChargeForm}
          onSubmit={chargeWallet}
          saving={walletChargeSaving}
        />
      </div>
    </Suspense>
  );
}
