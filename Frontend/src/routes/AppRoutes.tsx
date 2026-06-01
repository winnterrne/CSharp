import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MainContent from "../components/layout/MainContent";
// import HomePage from "../pages/Home/HomePage";
// import LoginPage from "../pages/Auth/LoginPage";
// import PublicRoute from "./PublicRoute";
//import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={
          <MainLayout>
            <MainContent />
          </MainLayout>
        }
      />

      {/* Protected */}
      {/* <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MainContent />
            </MainLayout>
          </ProtectedRoute>
        }
      /> */}
    </Routes>
  );
}
