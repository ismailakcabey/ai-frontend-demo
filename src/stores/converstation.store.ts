import { STORE_NAME } from "./constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Props {
  lang: string;
  setLang: (lang: string) => void;
}

export const useConverstationStore = create(
  persist<Props>(
    (set) => ({
      lang: "",
      setLang: (lang: string) => set({ lang }),
    }),
    {
      name: STORE_NAME.CONVERSTATION,
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
