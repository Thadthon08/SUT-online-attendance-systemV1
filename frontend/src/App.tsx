import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import BackendLayout from "./layouts/BackendLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
        </Route>
        <Route element={<BackendLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<h1>Product</h1>} />
          <Route path="/report" element={<h1>Report</h1>} />
          <Route path="/setting" element={<h1>Setting</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
