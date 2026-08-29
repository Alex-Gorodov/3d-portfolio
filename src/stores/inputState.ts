import { create } from "zustand";

interface InputState {
  jump: boolean;
  pressJump: () => void;
  releaseJump: () => void;
}

export const useInputStore = create<InputState>((set) => ({
  jump: false,

  pressJump: () => set({ jump: true }),

  releaseJump: () => set({ jump: false }),
}));
