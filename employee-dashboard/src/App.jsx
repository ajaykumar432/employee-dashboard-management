
import React, { Suspense, lazy } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

/* Lazy Loaded Pages */
const Login = lazy(() => import("./pages/Login"));
const EmployeeDashboard = lazy(() => import("./pages/EmployeeDashboard"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Reports = lazy(() => import("./pages/Reports"));

const Loader = () => (
  <div className="h-screen flex items-center justify-center">
    <span className="text-gray-600 text-lg font-medium">Loading...</span>
  </div>
);

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Layout Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
