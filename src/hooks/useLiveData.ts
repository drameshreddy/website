import { useState, useEffect, useCallback } from "react";

export interface SensorData {
  id: string;
  title: string;
  value: string;
  unit: string;
  numericValue: number;
  status: "good" | "warning" | "critical";
  type: "air" | "energy" | "waste";
  location: string;
  trend: string;
  progressValue?: number;
  maxValue?: number;
}

const generateRandomValue = (base: number, variance: number = 10) => {
  return Math.max(0, base + (Math.random() - 0.5) * variance);
};

const getStatus = (value: number, thresholds: { warning: number; critical: number }) => {
  if (value >= thresholds.critical) return "critical";
  if (value >= thresholds.warning) return "warning";
  return "good";
};

export const useLiveData = () => {
  const [sensors, setSensors] = useState<SensorData[]>([
    {
      id: "air-1",
      title: "Air Quality Index",
      value: "42",
      unit: "AQI",
      numericValue: 42,
      status: "good",
      type: "air",
      location: "Downtown District",
      trend: "+5% from yesterday",
      progressValue: 42,
      maxValue: 200
    },
    {
      id: "energy-1",
      title: "Energy Consumption",
      value: "2.4",
      unit: "GWh",
      numericValue: 2.4,
      status: "warning",
      type: "energy",
      location: "Industrial Zone",
      trend: "+12% from last week",
      progressValue: 68,
      maxValue: 5.0
    },
    {
      id: "waste-1",
      title: "Waste Management",
      value: "89",
      unit: "% recycled",
      numericValue: 89,
      status: "good",
      type: "waste",
      location: "City Center",
      trend: "+3% from last month",
      progressValue: 89,
      maxValue: 100
    },
    {
      id: "air-2",
      title: "PM2.5 Levels",
      value: "15",
      unit: "μg/m³",
      numericValue: 15,
      status: "good",
      type: "air",
      location: "Residential Area",
      trend: "-8% from yesterday",
      progressValue: 30,
      maxValue: 50
    },
    {
      id: "energy-2",
      title: "Solar Generation",
      value: "1.8",
      unit: "GWh",
      numericValue: 1.8,
      status: "good",
      type: "energy",
      location: "Solar Farm East",
      trend: "+15% from last week",
      progressValue: 72,
      maxValue: 2.5
    },
    {
      id: "waste-2",
      title: "Bin Fill Level",
      value: "67",
      unit: "% full",
      numericValue: 67,
      status: "warning",
      type: "waste",
      location: "Market District",
      trend: "+23% from yesterday",
      progressValue: 67,
      maxValue: 100
    }
  ]);

  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  const updateSensorData = useCallback(() => {
    setSensors(prevSensors => 
      prevSensors.map(sensor => {
        let newValue: number;
        let newStatus: "good" | "warning" | "critical";

        switch (sensor.type) {
          case "air":
            newValue = generateRandomValue(sensor.numericValue, 8);
            newStatus = getStatus(newValue, { warning: 50, critical: 100 });
            break;
          case "energy":
            newValue = generateRandomValue(sensor.numericValue, 0.3);
            newStatus = getStatus(newValue, { warning: 3.0, critical: 4.0 });
            break;
          case "waste":
            newValue = generateRandomValue(sensor.numericValue, 5);
            newStatus = getStatus(newValue, { warning: 80, critical: 95 });
            break;
          default:
            newValue = sensor.numericValue;
            newStatus = sensor.status;
        }

        const progressValue = sensor.type === "energy" 
          ? Math.round((newValue / (sensor.maxValue || 5)) * 100)
          : Math.round(newValue);

        return {
          ...sensor,
          value: sensor.type === "energy" ? newValue.toFixed(1) : Math.round(newValue).toString(),
          numericValue: newValue,
          status: newStatus,
          progressValue: Math.min(progressValue, 100)
        };
      })
    );
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  return {
    sensors,
    lastUpdated,
    updateSensorData
  };
};