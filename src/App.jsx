import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import CreateForm from "./pages/CreateForm";
import PublicForm from "./pages/PublicForm";
import AdminDashboard from "./pages/AdminDashboard";
import ManageForms from "./pages/ManageForms";
import EditForm from "./pages/EditForm";
import FormResponses from "./pages/FormResponses";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* Public routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/form/:id" element={<PublicForm />} />

        {/* Protected Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create"
          element={
            <ProtectedRoute>
              <CreateForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage"
          element={
            <ProtectedRoute>
              <ManageForms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit/:id"
          element={
            <ProtectedRoute>
              <EditForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/responses/:id"
          element={
            <ProtectedRoute>
              <FormResponses />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
