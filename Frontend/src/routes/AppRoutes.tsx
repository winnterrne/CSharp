import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import AccountPage from "../pages/Profile/AccountPage";
import SearchPage from "../pages/Search/SearchPage";
import PlaylistDetailPage from "../pages/Playlist/PlaylistDetailPage";
import NotificationPage from "../pages/Notification/NotificationPage";
import AlbumDetailPage from "../pages/Album/AlbumDetailPage";
import TrackPage from "../pages/Track/TrackPage";
import ArtistPage from "../pages/Artist/ArtistPage";
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

      {/* ✅ ACCOUNT: trang tài khoản / hồ sơ thật */}
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AccountPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* ✅ PROFILE: đổi thành trang Playlist của tôi */}
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
          <ProtectedRoute>
            <MainLayout>
              <PlaylistDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NotificationPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/album/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AlbumDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/track/:id" 
        element={
            <MainLayout>
              <TrackPage />
            </MainLayout>
        } 
      />
      <Route
        path="/artist/:artistName"
        element={
          <MainLayout>
            <ArtistPage />
          </MainLayout>
        }
      />

    <Route
      path="/profile/:userId"
      element={
        <MainLayout>
          <ProfilePage />
        </MainLayout>
      }
    />
    </Routes>
    
    
  );
}