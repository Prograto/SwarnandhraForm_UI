import { useNavigate } from "react-router-dom";

export default function BackToManageForms() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/admin/manage")}
      className="flex items-center gap-2 text-indigo-600 hover:underline"
    >
      ← Back to Manage Forms
    </button>
  );
}
