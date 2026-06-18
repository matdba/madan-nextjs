import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BreadcrumbState {
  name: string;
  showName: boolean;
  setName: (data: string) => void;
  setShowName: (data: boolean) => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>()(
  persist(
    (set) => ({
      name: '',
      showName: false,
      setName: (data: string) => set({ name: data }),
      setShowName: (data: boolean) => set({ showName: data }),
    }),
    { name: 'bearcrumb-storage', }
  )
);