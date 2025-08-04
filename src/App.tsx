import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import EventoPage from "./pages/Evento/EventoPage";
import LoginForm from "./components/LoginForm";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Layout";
import "./App.css";
import Default from "./pages/Evento/Default";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/default" element={
        <ProtectedRoute>
          <Default />
        </ProtectedRoute>
      } />
      <Route path="/eventos" element={
        <ProtectedRoute>
          <EventoPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
