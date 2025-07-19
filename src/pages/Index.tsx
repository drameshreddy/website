import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wind, Zap, Trash2, Droplet, Building, ArrowRight, MapPin,
} from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBox } from "@/components/SearchBox";
import { FilterTabs, FilterType } from "@/components/FilterTabs";
import { EnhancedMetricCard } from "@/components/EnhancedMetricCard";
import { AirQualityChart } from "@/components/AirQualityChart";
import { LiveDataDisplay } from "@/components/LiveDataDisplay";
import { AlertBanner } from "@/components/AlertBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLiveData } from "@/hooks/useLiveData";
import heroImage from "@/assets/Smart-Campus.jpg";

import { mockCampusData, getAllSensors } from "@/data/mockData";

type SensorType = "air" | "energy" | "waste" | "water";

interface SensorData {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  unit: string;
  status: "good" | "warning" | "critical";
  type: SensorType;
  location: string;
  trend?: "up" | "down" | "steady";
  progressValue?: number;
  maxValue?: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { sensors, lastUpdated, updateSensorData } = useLiveData();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [alerts, setAlerts] = useState<
    Array<{ id: string; type: "warning" | "critical"; message: string }>
  >([]);

  // 🚨 Alert logic
  useEffect(() => {
    if (!sensors) return;

    const newAlerts = sensors
      .filter(
        (sensor) =>
          (sensor.status === "critical" || sensor.status === "warning") &&
          sensor.numericValue > 80
      )
      .map((sensor) => ({
        id: `${sensor.status}-${sensor.id}`,
        type: sensor.status as "critical" | "warning",
        message: `${sensor.title} in ${sensor.location} is ${
          sensor.status === "critical"
            ? `critically high: ${sensor.value}${sensor.unit}`
            : `${sensor.value}${sensor.unit} - consider action`
        }`,
      }));

    setAlerts(newAlerts);
  }, [sensors]);

  // 🔍 Filtered sensors
  const filteredSensors = useMemo(() => {
    if (!sensors) return [];
    return sensors.filter((sensor) => {
      const matchesSearch =
        sensor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sensor.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "all" || sensor.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [sensors, searchQuery, activeFilter]);

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const getSensorIcon = (type: SensorType) => {
    switch (type) {
      case "air": return Wind;
      case "energy": return Zap;
      case "waste": return Trash2;
      case "water": return Droplet;
      default: return Wind;
    }
  };

  const totalSensors = getAllSensors().length;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* 🧠 Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Dashboard
            </h1>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 bg-success rounded-full animate-glow-pulse" />
              <span className="text-sm text-primary font-medium">
                {totalSensors} Sensors Online
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* 🌆 Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative px-6 py-12 max-w-7xl mx-auto text-center space-y-4 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Smart Campus Monitoring
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced sensor network providing continuous monitoring of air quality, energy
            consumption, waste and water management.
          </p>
        </div>
      </div>

      {/* 📊 Main Content */}
      <div className="px-6 py-8 max-w-7xl mx-auto space-y-8">
        <AlertBanner alerts={alerts} onDismiss={dismissAlert} />
        <LiveDataDisplay onDataUpdate={updateSensorData} lastUpdated={lastUpdated} autoRefresh />

        {/* 🏢 Campus Blocks */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Campus Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockCampusData.blocks.map((block) => {
              const blockSensors = block.buildings.reduce(
                (acc, b) => acc + b.sensors.length,
                0
              );
              const criticalSensors = block.buildings.reduce(
                (acc, b) => acc + b.sensors.filter((s) => s.status === "critical").length,
                0
              );
              const warningSensors = block.buildings.reduce(
                (acc, b) => acc + b.sensors.filter((s) => s.status === "warning").length,
                0
              );

              return (
                <Card
                  key={block.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => navigate(`/dashboard/block/${block.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        {block.name}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {block.buildings.length} buildings • {blockSensors} sensors
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {criticalSensors > 0 && (
                          <Badge variant="destructive">{criticalSensors} Critical</Badge>
                        )}
                        {warningSensors > 0 && (
                          <Badge variant="secondary" className="bg-warning/10 text-warning">
                            {warningSensors} Warning
                          </Badge>
                        )}
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          {blockSensors - criticalSensors - warningSensors} Good
                        </Badge>
                      </div>
                      <div className="pt-2 text-xs text-muted-foreground">
                        Click to explore block details →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 🔍 Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by sensor name or location..."
          />
          <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {/* 📡 Live Sensor Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Live Sensor Data</h2>
          {filteredSensors.length === 0 ? (
            <p className="text-muted-foreground">No sensors match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSensors.map((sensor) => (
                <EnhancedMetricCard
                  key={sensor.id}
                  title={sensor.title}
                  value={sensor.value}
                  unit={sensor.unit}
                  status={sensor.status}
                  icon={getSensorIcon(sensor.type)}
                  trend={sensor.trend}
                  location={sensor.location}
                  lastUpdated={lastUpdated}
                  progressValue={sensor.progressValue}
                  maxValue={sensor.maxValue}
                />
              ))}
            </div>
          )}
        </div>

        {/* 📈 Chart Section */}
        <AirQualityChart />
      </div>
    </div>
  );
};

export default Index;
