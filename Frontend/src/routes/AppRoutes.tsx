import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SearchPage from "../pages/Search/SearchPage";
import PlaylistDetailPage from "../pages/Playlist/PlaylistDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HomePage />
            </MainLayout>
          </ProtectedRoute>
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
      <Route
  path="/search"
  element={
    <ProtectedRoute>
      <MainLayout>
        <SearchPage />
      </MainLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/playlist/:id"
  element={
    <MainLayout>
      <PlaylistDetailPage />
    </MainLayout>
  }
/>
    </Routes>
  );
}