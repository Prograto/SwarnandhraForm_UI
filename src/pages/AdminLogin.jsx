import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      setError("");
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">
            Swarnandhra College of Engineering & Technology
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Academic Forms Management System
          </p>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Admin Login
        </h2>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="admin@swarnandhra.edu.in"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={login}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded font-medium transition"
        >
          Login to Dashboard
        </button>

        {/* FOOTER */}
        <p className="text-xs text-gray-400 text-center mt-6">
          © {new Date().getFullYear()} Swarnandhra College • Internal Use Only
        </p>
      </div>
    </div>
  );
}
