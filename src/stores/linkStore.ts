import { create } from "zustand";
import { Vector3 } from "three";

interface LinkZoneData {
  name: string;
  url: string;
  position: Vector3;
  radius: number;
}

interface LinkStore {
  zones: LinkZoneData[];
  activeZone: LinkZoneData | null;
  registerZone: (zone: LinkZoneData) => void;
  setActiveZone: (zone: LinkZoneData | null) => void;
}

export const useLinkStore = create<LinkStore>((set) => ({
  zones: [],

  activeZone: null,

  registerZone: (zone) =>
    set((state) => ({
      zones: [...state.zones, zone],
    })),

  setActiveZone: (zone) =>
    set({
      activeZone: zone,
    }),
}));
