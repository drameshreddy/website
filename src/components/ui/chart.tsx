// Full implementation of chart container, tooltip, legend, and styles using Recharts

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

// Tooltip and legend payload types
// ✅ MANUAL TYPE DEFINITION (matches Recharts Tooltip payload format)
export type CustomTooltipPayload = {
    dataKey?: string;
    name?: string;
    value?: number | string;
    color?: string;
    payload?: any;
    stroke?: string;
    strokeWidth?: number;
  };
  export type CustomLegendPayload = {
  dataKey?: string;
  value?: string;
  color?: string;
};

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextProps | null>(null);
function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, conf]) => conf.theme || conf.color
  );
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            const styles = colorConfig
              .map(([key, conf]) => {
                const color = conf.theme?.[theme as keyof typeof THEMES] || conf.color;
                return color ? `  --color-${key}: ${color};` : null;
              })
              .join("\n");
            return `${prefix} [data-chart=${id}] {\n${styles}\n}`;
          })
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    active?: boolean;
    payload?: CustomTooltipPayload[];
    label?: string;
    color?: string;
    indicator?: "line" | "dot" | "dashed";
    hideLabel?: boolean;
    hideIndicator?: boolean;
    labelFormatter?: (...args: any[]) => React.ReactNode;
    formatter?: (
      value: number,
      name: string,
      item: CustomTooltipPayload,
      index: number,
      payload: any
    ) => React.ReactNode;
    labelClassName?: string;
    nameKey?: string;
    labelKey?: string;
  }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) return null;
      const [item] = payload;
      const key = labelKey || (item.dataKey || item.name || "value");
      const conf = getPayloadConfig(config, item, key);
      const value =
        !labelKey && typeof label === "string" ? config[label]?.label || label : conf?.label;

      return labelFormatter ? (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      ) : value ? (
        <div className={cn("font-medium", labelClassName)}>{value}</div>
      ) : null;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) return null;

    const nested = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nested && tooltipLabel}
        <div className="grid gap-1.5">
          {payload.map((item, i) => {
            const key = nameKey || (item.name || item.dataKey || "value");
            const conf = getPayloadConfig(config, item, key);
            const fill = color || item.payload?.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className={cn("flex items-center gap-2", {
                  "items-end": nested,
                })}
              >
                {!hideIndicator && (
                  <div
                    className={cn("rounded-sm", {
                      "h-2.5 w-2.5": indicator === "dot",
                      "w-1": indicator === "line",
                      "w-0 border border-dashed bg-transparent": indicator === "dashed",
                    })}
                    style={{
                      backgroundColor: fill,
                      borderColor: fill,
                    }}
                  />
                )}
                <div className="flex-1 flex justify-between">
                  <div>
                    {nested && tooltipLabel}
                    <span className="text-muted-foreground">{conf?.label || item.name}</span>
                  </div>
                  {item.value && (
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {(item.value as number).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: CustomLegendPayload[];
    verticalAlign?: "top" | "bottom";
    hideIcon?: boolean;
    nameKey?: string;
  }
>(({ className, payload, verticalAlign = "bottom", hideIcon = false, nameKey }, ref) => {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item) => {
        const key = nameKey || item.dataKey || "value";
        const conf = getPayloadConfig(config, item, key);

        return (
          <div key={item.value} className="flex items-center gap-1.5">
            {!hideIcon && conf?.icon ? (
              <conf.icon />
            ) : (
              <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: item.color }} />
            )}
            {conf?.label}
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegendContent";

function getPayloadConfig(config: ChartConfig, payload: any, key: string) {
  const rawPayload = payload?.payload || {};
  let labelKey = key;

  if (typeof payload[key] === "string") {
    labelKey = payload[key];
  } else if (typeof rawPayload[key] === "string") {
    labelKey = rawPayload[key];
  }

  return config[labelKey] || config[key];
}

export {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};
