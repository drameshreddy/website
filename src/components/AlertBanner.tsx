interface Alert {
    id: string;
    type: "warning" | "critical";
    message: string;
  }
  
  interface AlertBannerProps {
    alerts: Alert[];
    onDismiss: (id: string) => void;
  }
  
  export function AlertBanner({ alerts, onDismiss }: AlertBannerProps) {
    if (!alerts.length) return null;
  
    return (
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-md text-sm flex justify-between items-center border ${
              alert.type === "critical"
                ? "bg-red-100 border-red-300 text-red-800"
                : "bg-yellow-100 border-yellow-300 text-yellow-800"
            }`}
          >
            <span>{alert.message}</span>
            <button
              className="ml-4 text-xs underline"
              onClick={() => onDismiss(alert.id)}
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    );
  }
  