import { useParams, useNavigate } from "react-router-dom";
import { Cpu, MapPin, ArrowRight, Wind, Zap, Trash2, Droplets, Sun, Lightbulb } from "lucide-react";
import { mockCampusData } from "@/data/mockData";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedMetricCard } from "@/components/EnhancedMetricCard";

const BuildingView = () => {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  
  let building = null;
  let parentBlock = null;

  // Find the building across all blocks
  for (const block of mockCampusData.blocks) {
    const foundBuilding = block.buildings.find(b => b.id === buildingId);
    if (foundBuilding) {
      building = foundBuilding;
      parentBlock = block;
      break;
    }
  }

  if (!building || !parentBlock) {
    return <div className="p-6">Building not found</div>;
  }

  const getSensorIcon = (type: string) => {
    switch (type) {
      case "air": return Wind;
      case "energy": return Zap;
      case "waste": return Trash2;
      case "water": return Droplets;
      case "solar": return Sun;
      case "lighting": return Lightbulb;
      default: return Cpu;
    }
  };

  const criticalSensors = building.sensors.filter(s => s.status === "critical").length;
  const warningSensors = building.sensors.filter(s => s.status === "warning").length;
  const goodSensors = building.sensors.filter(s => s.status === "good").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Breadcrumb />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Cpu className="h-8 w-8 text-primary" />
                {building.name}
              </h1>
              <p className="text-muted-foreground mt-2">
                {building.type} • {building.sensors.length} sensors
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                Block: {parentBlock.name}
              </div>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Good Status</p>
                    <p className="text-2xl font-bold text-success">{goodSensors}</p>
                  </div>
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Warning Status</p>
                    <p className="text-2xl font-bold text-warning">{warningSensors}</p>
                  </div>
                  <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Critical Status</p>
                    <p className="text-2xl font-bold text-destructive">{criticalSensors}</p>
                  </div>
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sensors Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Building Sensors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {building.sensors.map((sensor) => (
                <div
                  key={sensor.id}
                  className="cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => navigate(`/dashboard/sensor/${sensor.id}`)}
                >
                  <EnhancedMetricCard
                    title={sensor.title}
                    value={sensor.value}
                    unit={sensor.unit}
                    status={sensor.status}
                    icon={getSensorIcon(sensor.type)}
                    trend={sensor.trend}
                    location={sensor.location}
                    lastUpdated={new Date().toLocaleTimeString()}
                    progressValue={sensor.progressValue}
                    maxValue={sensor.maxValue}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingView;