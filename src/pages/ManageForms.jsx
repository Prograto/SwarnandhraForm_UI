import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import BackToDashboard from "../components/BackToDashboard";
import {
  Pencil,
  BarChart3,
  Link as LinkIcon,
  Power,
  Search,
  Trash2,
} from "lucide-react";

export default function ManageForms() {
  const [forms, setForms] = useState([]);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    api.get("/forms").then((res) => setForms(res.data));
  }, []);

  /* TOGGLE ACTIVE / INACTIVE */
  const toggleForm = async (id) => {
    await api.patch(`/forms/${id}/toggle`);
    setForms((prev) =>
      prev.map((f) =>
        f._id === id ? { ...f, isActive: !f.isActive } : f
      )
    );
  };

  /* COPY PUBLIC LINK */
  const copyLink = (id, isActive) => {
    if (!isActive) return;

    const link = `${window.location.origin}/form/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);

    setTimeout(() => setCopiedId(null), 1500);
  };

  /* DELETE FORM */
  const deleteForm = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the form:\n\n"${title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    await api.delete(`/forms/${id}`);

    setForms((prev) => prev.filter((f) => f._id !== id));
  };

  /* FILTER FORMS */
  const filteredForms = forms.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BACK */}
        <BackToDashboard />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700">
              Manage Academic Forms
            </h1>
            <p className="text-gray-600">
              Swarnandhra College of Engineering & Technology
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              className="pl-9 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none"
              placeholder="Search forms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="px-4 py-3 border-b">Form Title</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b">Responses</th>
                <th className="px-4 py-3 border-b">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredForms.map((f) => (
                <tr
                  key={f._id}
                  className="hover:bg-gray-50 transition text-sm"
                >
                  {/* TITLE */}
                  <td className="px-4 py-3 border-b font-medium">
                    {f.title}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3 border-b">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          f.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {f.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* RESPONSE COUNT */}
                  <td className="px-4 py-3 border-b">
                    <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                      <BarChart3 className="w-3 h-3" />
                      {f.responseCount ?? 0}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 border-b flex flex-wrap gap-4 items-center">
                    <Link
                      to={`/admin/edit/${f._id}`}
                      className="flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Link>

                    <Link
                      to={`/admin/responses/${f._id}`}
                      className="flex items-center gap-1 text-green-600 hover:underline"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Responses
                    </Link>

                    {/* COPY LINK */}
                    <button
                      onClick={() => copyLink(f._id, f.isActive)}
                      disabled={!f.isActive}
                      className={`flex items-center gap-1
                        ${
                          f.isActive
                            ? "text-gray-700 hover:underline"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                      title={
                        f.isActive
                          ? "Copy public link"
                          : "Form is inactive"
                      }
                    >
                      <LinkIcon className="w-4 h-4" />
                      {copiedId === f._id ? "Copied!" : "Copy Link"}
                    </button>

                    {/* TOGGLE */}
                    <button
                      onClick={() => toggleForm(f._id)}
                      className={`flex items-center gap-1 font-medium
                        ${
                          f.isActive
                            ? "text-red-600 hover:underline"
                            : "text-blue-600 hover:underline"
                        }`}
                    >
                      <Power className="w-4 h-4" />
                      {f.isActive ? "Disable" : "Enable"}
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => deleteForm(f._id, f.title)}
                      className="flex items-center gap-1 text-red-700 hover:underline"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY */}
          {filteredForms.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No forms match your search.
            </div>
          )}
        </div>

        {/* FOOTER */}
        <p className="text-sm text-gray-400 text-center">
          Manage academic forms efficiently — search, share links,
          control availability, analyze responses, and delete obsolete forms.
        </p>
      </div>
    </div>
  );
}
