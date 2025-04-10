
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import StudyPlanner from "./pages/StudyPlanner";
import Dashboard from "./pages/Dashboard";
import ProgressTracker from "./pages/Progress";
import MyNotes from "./pages/MyNotes";
import Alarm from "./pages/Alarm";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import ThemeSwitcherButton from "./components/ThemeSwitcherButton";
import OfflineIndicator from "./components/common/OfflineIndicator";

// Create a new QueryClient instance outside the component
// This ensures it's not recreated on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <div className="fixed top-4 right-4 z-50">
                <ThemeSwitcherButton />
              </div>
              <OfflineIndicator />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes - all under the DashboardLayout */}
                <Route 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/planner" element={<StudyPlanner />} />
                  <Route path="/progress" element={<ProgressTracker />} />
                  <Route path="/notes" element={<MyNotes />} />
                  <Route path="/alarm" element={<Alarm />} />
                  <Route path="/chat" element={<Chat />} />
                </Route>
                
                {/* Catch unknown routes and redirect to 404 */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
