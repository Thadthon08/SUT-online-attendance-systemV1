import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Signin";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import BackendLayout from "./layouts/BackendLayout";
import Report from "./pages/Report";
import Setting from "./pages/Setting";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Room from "./pages/Room";
import { Suspense, lazy } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import StudentLayout from "./layouts/StudentLayout";

// Lazy load สำหรับ student route
const StudentRoute = lazy(() => import("./routes/StudentRoute"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
        </Route>

        <Route element={<BackendLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room"
            element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/setting"
            element={
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<StudentLayout />}>
          <Route
            path="/student"
            element={
              <Suspense fallback={<CircularProgress />}>
                <StudentRoute />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
