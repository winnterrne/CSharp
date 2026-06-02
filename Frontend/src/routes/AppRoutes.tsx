import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MainContent from "../components/layout/MainContent";
import ProfilePage from "../pages/Profile/ProfilePage";
//import LoginPage from "../pages/Auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/login" element={<LoginPage />} /> */}

      <Route
        path="/"
        element={
          // <ProtectedRoute>
            <MainLayout>
              <MainContent />
            </MainLayout>
          // </ProtectedRoute>
        }
      />
<Route
  path="/profile"
  element={
    <MainLayout>
      <ProfilePage />
    </MainLayout>
  }
/>
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}