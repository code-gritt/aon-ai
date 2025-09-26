import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      clearUser: () => set({ user: null, token: null }),
    }),
    {
      name: "aon-ai-auth", // Persist key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStore;
