import { useNavigate } from "react-router-dom";

export default function BackToDashboard() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/admin/dashboard")}
      className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 mb-4"
    >
      <span className="text-lg">←</span>
      Back to Dashboard
    </button>
  );
}
