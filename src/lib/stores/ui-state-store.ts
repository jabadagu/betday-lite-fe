"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/types/enums";
import { Locale as LocaleEnum } from "@/types/enums";

type NoticeType = {
  message: string;
  type: "success" | "error" | "info";
};

type UIState = {
  locale: Locale;
  mobileSlipOpen: boolean;
  loginModalOpen: boolean;
  notice: NoticeType | null;
  activeFilter: string;
  hasShownModalInSession: boolean;
};

type UIActions = {
  setLocale: (locale: Locale) => void;
  openMobileSlip: (open: boolean) => void;
  openLoginModal: (open: boolean) => void;
  pushNotice: (message: string, type?: "success" | "error" | "info") => void;
  clearNotice: () => void;
  setActiveFilter: (filter: string) => void;
  setHasShownModalInSession: (shown: boolean) => void;
};

type UIStore = UIState & UIActions;

export const useUIStateStore = create<UIStore>()(
  persist(
    (set) => ({
      locale: LocaleEnum.ES,
      mobileSlipOpen: false,
      loginModalOpen: false,
      notice: null,
      activeFilter: "all",
      hasShownModalInSession: false,

      setLocale: (locale) => set({ locale }),
      openMobileSlip: (open) => set({ mobileSlipOpen: open }),
      openLoginModal: (open) => set({ loginModalOpen: open }),
      pushNotice: (message, type = "info") => {
        set({ notice: { message, type } });
        setTimeout(() => set({ notice: null }), 3000);
      },
      clearNotice: () => set({ notice: null }),
      setActiveFilter: (filter) => set({ activeFilter: filter }),
      setHasShownModalInSession: (shown) => set({ hasShownModalInSession: shown }),
    }),
    {
      name: "betday-ui-state",
      version: 1,
    },
  ),
);
