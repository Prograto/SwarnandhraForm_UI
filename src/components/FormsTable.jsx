import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";

export default function FormsTable() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    api.get("/forms").then(res => setForms(res.data));
  }, []);

  const toggle = async (id) => {
    await api.patch(`/forms/${id}/toggle`);
    setForms(forms.map(f =>
      f._id === id ? { ...f, isActive: !f.isActive } : f
    ));
  };

  return (
    <table className="w-full mt-6 border">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {forms.map(f => (
          <tr key={f._id}>
            <td>{f.title}</td>
            <td>{f.isActive ? "Active" : "Disabled"}</td>
            <td className="space-x-2">
              <Link to={`/form/${f._id}`} className="text-blue-600">View</Link>
              <button onClick={() => toggle(f._id)} className="text-red-600">
                Toggle
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
