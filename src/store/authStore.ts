import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthState } from "@/types";
import { mockUsers } from "@/lib/mockData";

interface AuthStore extends AuthState {
  login: (
    phone: string,
    otp?: string,
  ) => Promise<{ success: boolean; requiresOtp?: boolean; user?: User }>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  verifyOtp: (
    phone: string,
    otp: string,
  ) => Promise<{ success: boolean; user?: User }>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (phone: string, otp?: string) => {
        set({ isLoading: true });

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Find user by phone
        const user = mockUsers.find((u) => u.phone === phone);

        if (!user) {
          set({ isLoading: false });
          return { success: false };
        }

        // If no OTP provided, simulate sending OTP
        if (!otp) {
          set({ isLoading: false });
          return { success: true, requiresOtp: true };
        }

        // Simulate OTP verification (any 4-digit code works in demo)
        if (otp.length === 4) {
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true, user };
        }

        set({ isLoading: false });
        return { success: false };
      },

      verifyOtp: async (phone: string, otp: string) => {
        set({ isLoading: true });

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const user = mockUsers.find((u) => u.phone === phone);

        if (user && otp.length === 4) {
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true, user };
        }

        set({ isLoading: false });
        return { success: false };
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "watermate-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
