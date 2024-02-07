import { STORE_NAME } from "./constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Props {
  accessToken: string;
  refreshToken: string;
  isAuth: boolean;
  user?: any;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setAuth: (isAuth: boolean) => void;
  setLogin: (tokens: any) => void;
  setUser: (user: any) => void;
  signOut: () => void;
  refreshAuth: () => void;
}

export const useAuthStore = create(
  persist<Props>(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      isAuth: false,
      setAccessToken: (accessToken: string) => set({ accessToken }),
      setRefreshToken: (refreshToken: string) => set({ refreshToken }),
      setAuth: (isAuth: boolean) => set({ isAuth }),
      setUser: (user: any) => set({ user }),
      signOut: () => {
        set(() => ({
          accessToken: "",
          refreshToken: "",
          user: undefined,
          isAuth: false,
        }));
        localStorage.clear();
      },
      setLogin: (tokens) => {
        set(() => ({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          isAuth: true,
        }));
      },

      // try to refresh token if it is expired or not valid anymore delete all tokens and set isAuth to false
      refreshAuth: async () => {
        console.log("refresh token");
      },
    }),
    {
      name: STORE_NAME.AUTH,
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
