import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/HomePage";
export default function AppRoutes() {
  return (
    <Routes>
      {" "}
      <Route
        path="/"
        element={
          <MainLayout>
            {" "}
            <HomePage />{" "}
          </MainLayout>
        }
      />{" "}
    </Routes>
  );
}
