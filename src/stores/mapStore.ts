import { create } from "zustand";
import { generateTowers } from "../utils/generateTowers";


interface Tower {
  id: number;
  height: number;
  position: [number, number];
}


interface MapState {
  towers: Tower[];

  setTowerPosition: (
    id: number,
    position: [number, number]
  ) => void;
}


export const useMapStore = create<MapState>((set) => ({

  towers: generateTowers(20),


  setTowerPosition: (id, position) =>
    set((state) => ({
      towers: state.towers.map((tower) =>
        tower.id === id
          ? {
              ...tower,
              position
            }
          : tower
      )
    }))

}));
