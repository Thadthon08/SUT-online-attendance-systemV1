import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Signin";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import BackendLayout from "./layouts/BackendLayout";
import Report from "./pages/Report";
import Setting from "./pages/Setting";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentRoute from "./routes/StudentRoute"; // Route สำหรับตรวจสอบการลงทะเบียน
import Room from "./pages/Room";
import StudentLayout from "./layouts/StudentLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* เส้นทางสำหรับการ login */}
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

        {/* เส้นทางหลังจาก login แล้ว */}
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
          <Route path="/student" element={<StudentRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
