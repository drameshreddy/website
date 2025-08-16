import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // ✅ Changed to HashRouter
import Index from "./pages/Index";
import BlockView from "./pages/BlockView";
import BuildingView from "./pages/BuildingView";
import SensorView from "./pages/SensorView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard/block/:blockId" element={<BlockView />} />
          <Route path="/dashboard/building/:buildingId" element={<BuildingView />} />
          <Route path="/dashboard/sensor/:sensorId" element={<SensorView />} />
          {/* Catch-all for 404s */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
