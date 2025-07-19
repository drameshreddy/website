import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home, Building, Cpu } from "lucide-react";
import { mockCampusData } from "@/data/mockData";

export const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbItems = () => {
    const items = [
      { label: "Dashboard", path: "/", icon: Home }
    ];

    if (pathSegments.length > 1) {
      const blockId = pathSegments[2];
      const block = mockCampusData.blocks.find(b => b.id === blockId);
      if (block) {
        items.push({ 
          label: block.name, 
          path: `/dashboard/block/${blockId}`,
          icon: Building 
        });
      }

      if (pathSegments.length > 3) {
        const buildingId = pathSegments[4];
        const building = block?.buildings.find(b => b.id === buildingId);
        if (building) {
          items.push({ 
            label: building.name, 
            path: `/dashboard/building/${buildingId}`,
            icon: Building 
          });
        }

        if (pathSegments.length > 5) {
          const sensorId = pathSegments[6];
          const sensor = building?.sensors.find(s => s.id === sensorId);
          if (sensor) {
            items.push({ 
              label: sensor.title, 
              path: `/dashboard/sensor/${sensorId}`,
              icon: Cpu 
            });
          }
        }
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {breadcrumbItems.map((item, index) => (
        <div key={item.path} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          <Link 
            to={item.path}
            className={`flex items-center gap-1 hover:text-foreground transition-colors ${
              index === breadcrumbItems.length - 1 ? 'text-foreground font-medium' : ''
            }`}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
};