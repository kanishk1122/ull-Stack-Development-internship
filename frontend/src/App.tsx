import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SignupOwnerPage from "./pages/SignupOwnerPage";
import StoreDetailsPage from "./pages/StoreDetailsPage";
import UserDashboard from "./pages/user/UserDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ManageStoresPage from "./pages/admin/ManageStoresPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/stores" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/owner" element={<SignupOwnerPage />} />
          <Route path="/store/:id" element={<StoreDetailsPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["STORE_OWNER"]} />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="/admin/stores" element={<ManageStoresPage />} />
          </Route>

          {/* Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
