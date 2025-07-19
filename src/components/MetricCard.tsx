import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  status: "good" | "warning" | "critical";
  icon: LucideIcon;
  trend?: string;
}

export const MetricCard = ({ title, value, unit, status, icon: Icon, trend }: MetricCardProps) => {
  const statusColors = {
    good: "text-success",
    warning: "text-warning", 
    critical: "text-destructive"
  };

  const statusBgColors = {
    good: "bg-success/10",
    warning: "bg-warning/10",
    critical: "bg-destructive/10"
  };

  return (
    <Card className="bg-gradient-card border-border/40 shadow-card hover:shadow-glow transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${statusBgColors[status]} group-hover:animate-glow-pulse`}>
          <Icon className={`h-4 w-4 ${statusColors[status]}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {unit}
          </span>
        </div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
};