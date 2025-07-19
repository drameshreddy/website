import { Campus } from "@/types";

export const mockCampusData: Campus = {
  id: "iiit-campus",
  name: "IIIT Smart Campus",
  location: "Hyderabad, India",
  blocks: [
    {
      id: "academic-block-1",
      name: "Academic Block 1",
      campusId: "iiit-campus",
      buildings: [
        {
          id: "building-a1",
          name: "Lecture Hall Complex",
          type: "Academic",
          blockId: "academic-block-1",
          coordinates: { lat: 17.4461, lng: 78.3493 },
          sensors: [
            {
              id: "air-a1-001",
              title: "Air Quality Index",
              value: "42",
              unit: "AQI",
              numericValue: 42,
              status: "good",
              type: "air",
              location: "LH1 Main Hall",
              trend: "+5% from yesterday",
              progressValue: 42,
              maxValue: 200,
              coordinates: { lat: 17.4461, lng: 78.3493 },
              buildingId: "building-a1"
            },
            {
              id: "energy-a1-001",
              title: "Energy Consumption",
              value: "2.4",
              unit: "GWh",
              numericValue: 2.4,
              status: "warning",
              type: "energy",
              location: "LH1 HVAC System",
              trend: "+12% from last week",
              progressValue: 68,
              maxValue: 5.0,
              coordinates: { lat: 17.4461, lng: 78.3494 },
              buildingId: "building-a1"
            }
          ]
        },
        {
          id: "building-a2",
          name: "Faculty Offices",
          type: "Administrative",
          blockId: "academic-block-1",
          coordinates: { lat: 17.4465, lng: 78.3495 },
          sensors: [
            {
              id: "lighting-a2-001",
              title: "Smart Lighting",
              value: "85",
              unit: "% active",
              numericValue: 85,
              status: "good",
              type: "lighting",
              location: "Faculty Wing A",
              trend: "-3% from yesterday",
              progressValue: 85,
              maxValue: 100,
              coordinates: { lat: 17.4465, lng: 78.3495 },
              buildingId: "building-a2"
            }
          ]
        }
      ]
    },
    {
      id: "residential-block-1",
      name: "Residential Block 1",
      campusId: "iiit-campus",
      buildings: [
        {
          id: "building-r1",
          name: "Student Dormitory A",
          type: "Residential",
          blockId: "residential-block-1",
          coordinates: { lat: 17.4455, lng: 78.3485 },
          sensors: [
            {
              id: "waste-r1-001",
              title: "Waste Management",
              value: "89",
              unit: "% recycled",
              numericValue: 89,
              status: "good",
              type: "waste",
              location: "Dorm A Common Area",
              trend: "+3% from last month",
              progressValue: 89,
              maxValue: 100,
              coordinates: { lat: 17.4455, lng: 78.3485 },
              buildingId: "building-r1"
            },
            {
              id: "water-r1-001",
              title: "Water Usage",
              value: "245",
              unit: "L/hour",
              numericValue: 245,
              status: "good",
              type: "water",
              location: "Dorm A Water System",
              trend: "-5% from yesterday",
              progressValue: 49,
              maxValue: 500,
              coordinates: { lat: 17.4455, lng: 78.3486 },
              buildingId: "building-r1"
            }
          ]
        }
      ]
    },
    {
      id: "facilities-block-1",
      name: "Facilities Block",
      campusId: "iiit-campus",
      buildings: [
        {
          id: "building-f1",
          name: "Solar Power Plant",
          type: "Infrastructure",
          blockId: "facilities-block-1",
          coordinates: { lat: 17.4470, lng: 78.3500 },
          sensors: [
            {
              id: "solar-f1-001",
              title: "Solar Generation",
              value: "1.8",
              unit: "GWh",
              numericValue: 1.8,
              status: "good",
              type: "solar",
              location: "Solar Farm East",
              trend: "+15% from last week",
              progressValue: 72,
              maxValue: 2.5,
              coordinates: { lat: 17.4470, lng: 78.3500 },
              buildingId: "building-f1"
            }
          ]
        }
      ]
    }
  ]
};

export const getAllSensors = () => {
  const sensors: any[] = [];
  mockCampusData.blocks.forEach(block => {
    block.buildings.forEach(building => {
      sensors.push(...building.sensors);
    });
  });
  return sensors;
};