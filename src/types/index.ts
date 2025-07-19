export interface Sensor {
    id: string;
    title: string;
    value: string;
    unit: string;
    numericValue: number;
    status: "good" | "warning" | "critical";
    type: "air" | "energy" | "waste" | "water" | "solar" | "lighting";
    location: string;
    trend: string;
    progressValue?: number;
    maxValue?: number;
    coordinates?: { lat: number; lng: number };
    buildingId: string;
  }
  
  export interface Building {
    id: string;
    name: string;
    type: string;
    blockId: string;
    coordinates: { lat: number; lng: number };
    sensors: Sensor[];
  }
  
  export interface Block {
    id: string;
    name: string;
    campusId: string;
    buildings: Building[];
  }
  
  export interface Campus {
    id: string;
    name: string;
    location: string;
    blocks: Block[];
  }
  
  export type FilterType = "all" | "air" | "energy" | "waste" | "water" | "solar" | "lighting";