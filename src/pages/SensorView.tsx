import { useParams } from "react-router-dom";
import { Activity, MapPin, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { mockCampusData } from "@/data/mockData";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AirQualityChart } from "@/components/AirQualityChart";

const SensorView = () => {
  const { sensorId } = useParams();
  
  let sensor = null;
  let parentBuilding = null;
  let parentBlock = null;

  // Find the sensor across all blocks and buildings
  for (const block of mockCampusData.blocks) {
    for (const building of block.buildings) {
      const foundSensor = building.sensors.find(s => s.id === sensorId);
      if (foundSensor) {
        sensor = foundSensor;
        parentBuilding = building;
        parentBlock = block;
        break;
      }
    }
    if (sensor) break;
  }

  if (!sensor || !parentBuilding || !parentBlock) {
    return <div className="p-6">Sensor not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-success/10 text-success border-success/20";
      case "warning": return "bg-warning/10 text-warning border-warning/20";
      case "critical": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const isPositiveTrend = sensor.trend.includes("+");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Breadcrumb />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Activity className="h-8 w-8 text-primary" />
                {sensor.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {sensor.location}
                </div>
                <span>•</span>
                <span>{parentBuilding.name}</span>
                <span>•</span>
                <span>{parentBlock.name}</span>
              </div>
            </div>
            <Badge className={`${getStatusColor(sensor.status)} border`}>
              {sensor.status.toUpperCase()}
            </Badge>
          </div>

          {/* Main Metric Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Current Reading</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary mb-2">
                      {sensor.value}
                    </div>
                    <div className="text-xl text-muted-foreground">
                      {sensor.unit}
                    </div>
                  </div>
                  
                  {sensor.progressValue !== undefined && sensor.maxValue && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{sensor.progressValue}%</span>
                      </div>
                      <Progress value={sensor.progressValue} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>{sensor.maxValue} {sensor.unit}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Sensor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Sensor Type</span>
                    <Badge variant="outline">{sensor.type.toUpperCase()}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Location</span>
                    <span className="text-sm">{sensor.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Building</span>
                    <span className="text-sm">{parentBuilding.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Last Updated</span>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Trend</span>
                    <div className="flex items-center gap-1 text-sm">
                      {isPositiveTrend ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      )}
                      {sensor.trend}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historical Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historical Data</CardTitle>
            </CardHeader>
            <CardContent>
              <AirQualityChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SensorView;