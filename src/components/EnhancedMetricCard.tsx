import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, MapPin, Clock } from "lucide-react";

interface EnhancedMetricCardProps {
  title: string;
  value: string;
  unit: string;
  status: "good" | "warning" | "critical";
  icon: LucideIcon;
  trend?: string;
  location?: string;
  lastUpdated?: string;
  progressValue?: number;
  maxValue?: number;
}

export const EnhancedMetricCard = ({ 
  title, 
  value, 
  unit, 
  status, 
  icon: Icon, 
  trend, 
  location, 
  lastUpdated, 
  progressValue, 
  maxValue 
}: EnhancedMetricCardProps) => {
  const statusColors = {
    good: "text-success",
    warning: "text-warning", 
    critical: "text-destructive"
  };

  const statusBgColors = {
    good: "bg-success/10 border-success/20",
    warning: "bg-warning/10 border-warning/20",
    critical: "bg-destructive/10 border-destructive/20"
  };

  const badgeVariants = {
    good: "default",
    warning: "secondary",
    critical: "destructive"
  } as const;

  return (
    <Card className="bg-gradient-card border-border/40 shadow-card hover:shadow-glow transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {title}
            <Badge variant={badgeVariants[status]} className="text-xs">
              {status.toUpperCase()}
            </Badge>
          </CardTitle>
          {location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {location}
            </div>
          )}
        </div>
        <div className={`p-2 rounded-lg border ${statusBgColors[status]} group-hover:animate-glow-pulse`}>
          <Icon className={`h-5 w-5 ${statusColors[status]}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold text-foreground">
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {unit}
          </span>
        </div>
        
        {progressValue !== undefined && maxValue && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Usage</span>
              <span>{progressValue}%</span>
            </div>
            <Progress 
              value={progressValue} 
              className="h-2" 
              color={status === "critical" ? "bg-destructive" : status === "warning" ? "bg-warning" : "bg-success"}
            />
          </div>
        )}
        
        <div className="space-y-1">
          {trend && (
            <p className="text-xs text-muted-foreground">
              {trend}
            </p>
          )}
          {lastUpdated && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Last updated: {lastUpdated}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};