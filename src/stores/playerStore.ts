import { create } from "zustand";


interface PlayerState {

  position: {
    x: number;
    z: number;
  };

  rotation: {
    y: number;
  };


  setPosition: (position:{
    x:number;
    z:number;
  }) => void;


  setRotation: (rotation:{
    y:number;
  }) => void;

  running:boolean;

  setRunning:(running:boolean)=>void;

}


export const usePlayerStore = create<PlayerState>((set) => ({

  position:{
    x:0,
    z:0
  },


  rotation:{
    y:0
  },


  setPosition:(position)=>
    set({
      position
    }),


  setRotation:(rotation)=>
    set({
      rotation
    }),

  running: false,

  setRunning:(running)=>
    set({
      running
    })



}));
