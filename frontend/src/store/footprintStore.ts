import { create } from 'zustand';

interface FootprintState {
  footprint: any | null;
  activities: any[];
  setFootprint: (data: any) => void;
  addActivity: (activity: any) => void;
}

export const useFootprintStore = create<FootprintState>((set) => ({
  footprint: null,
  activities: [],
  setFootprint: (data) => set({ footprint: data }),
  addActivity: (activity) => set((state) => ({ activities: [activity, ...state.activities] })),
}));
