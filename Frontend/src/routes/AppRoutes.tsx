import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MainContent from "../components/layout/MainContent";
import ProfilePage from "../pages/Profile/ProfilePage";
//import LoginPage from "../pages/Auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/Home/HomePage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/login" element={<LoginPage />} /> */}

      <Route
        path="/"
        element={
          // <ProtectedRoute>
            <MainLayout>
              <HomePage/>
            </MainLayout>
          // </ProtectedRoute>
        }
      />   
    </Routes>
  );
}