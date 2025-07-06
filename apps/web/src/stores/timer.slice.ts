import type { StateCreator } from "zustand";

import type { Store } from "@/stores";

interface TimerStates {
  otpTimer: number;
}

interface TimerActions {
  decreaseOtpTimer: () => void;
  setOtpTimer: (time: number) => void;
}

const initialState: TimerStates = {
  otpTimer: 0,
};

export type TimerSlice = TimerStates & TimerActions;

export const createTimerSlice: StateCreator<Store, [["zustand/immer", never]], [], TimerSlice> = (
  set,
) => ({
  ...initialState,
  decreaseOtpTimer: () => {
    set((state) => {
      state.otpTimer -= 1;
    });
  },
  setOtpTimer: (time: number) => {
    set((state) => {
      state.otpTimer = time > 0 ? time : 0;
    });
  },
});
