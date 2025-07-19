import { useParams, useNavigate } from "react-router-dom";
import { Building, MapPin, ArrowRight } from "lucide-react";
import { mockCampusData } from "@/data/mockData";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BlockView = () => {
  const { blockId } = useParams();
  const navigate = useNavigate();
  
  const block = mockCampusData.blocks.find(b => b.id === blockId);

  if (!block) {
    return <div className="p-6">Block not found</div>;
  }

  const totalSensors = block.buildings.reduce((acc, building) => acc + building.sensors.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Breadcrumb />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Building className="h-8 w-8 text-primary" />
                {block.name}
              </h1>
              <p className="text-muted-foreground mt-2">
                {block.buildings.length} buildings • {totalSensors} sensors
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {block.buildings.map((building) => {
              const criticalSensors = building.sensors.filter(s => s.status === "critical").length;
              const warningSensors = building.sensors.filter(s => s.status === "warning").length;
              const goodSensors = building.sensors.filter(s => s.status === "good").length;

              return (
                <Card 
                  key={building.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => navigate(`/dashboard/building/${building.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        {building.name}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {building.type}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="font-medium">{building.sensors.length}</span> sensors active
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        {goodSensors > 0 && (
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            {goodSensors} Good
                          </Badge>
                        )}
                        {warningSensors > 0 && (
                          <Badge variant="secondary" className="bg-warning/10 text-warning">
                            {warningSensors} Warning
                          </Badge>
                        )}
                        {criticalSensors > 0 && (
                          <Badge variant="destructive">
                            {criticalSensors} Critical
                          </Badge>
                        )}
                      </div>

                      <div className="pt-2 text-xs text-muted-foreground">
                        Click to view building details →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockView;