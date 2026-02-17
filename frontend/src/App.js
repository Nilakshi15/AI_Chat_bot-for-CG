import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext";
import "@/App.css";

import Landing from "./pages/Landing";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import ChatPage from "./pages/ChatPage";
import ExplorePage from "./pages/ExplorePage";
import RoadmapsPage from "./pages/RoadmapsPage";
import ProfilePage from "./pages/ProfilePage";

function AppRouter() {
  const location = useLocation();
  
  // Check URL fragment for session_id synchronously during render
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {({ user }) => <DashboardLayout user={user} />}
        </ProtectedRoute>
      }>
        <Route index element={<ChatPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="roadmaps" element={<RoadmapsPage />} />
        <Route path="roadmaps/generate" element={<RoadmapsPage />} />
        <Route path="roadmaps/:roadmapId" element={<RoadmapsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <BrowserRouter>
          <AppRouter />
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
