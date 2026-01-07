import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import { Download, ArrowLeft } from "lucide-react";

const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#f59e0b"];

export default function FormResponses() {
  const { id } = useParams();

  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    api.get(`/forms/admin/${id}`).then((res) => setForm(res.data));
    api.get(`/responses/form/${id}`).then((res) => setResponses(res.data));
  }, [id]);

  if (!form) return null;

  /* ===================== EXCEL EXPORT ===================== */
  const downloadExcel = () => {
    const rows = responses.map((r) => {
      const row = {};
      form.questions.forEach((q) => {
        const ans = r.answers?.[q.id];
        row[q.label] = Array.isArray(ans) ? ans.join(", ") : ans || "";
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, `${form.title}-responses.xlsx`);
  };

  /* ===================== CHART DATA ===================== */
  const getChartData = (questionId) => {
    const stats = {};

    responses.forEach((r) => {
      const ans = r.answers?.[questionId];
      if (!ans) return;

      if (Array.isArray(ans)) {
        ans.forEach((a) => {
          stats[a] = (stats[a] || 0) + 1;
        });
      } else {
        stats[ans] = (stats[ans] || 0) + 1;
      }
    });

    return Object.entries(stats).map(([name, value]) => ({
      name,
      value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ===================== HEADER ===================== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Link
              to="/admin/manage"
              className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Manage Forms
            </Link>

            <h1 className="text-3xl font-bold text-indigo-700">
              {form.title}
            </h1>
            <p className="text-gray-600">
              Swarnandhra College of Engineering & Technology
            </p>
          </div>

          <button
            onClick={downloadExcel}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <Download className="w-4 h-4" />
            Download XLSX
          </button>
        </div>

        {/* ===================== STATS ===================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500">Total Responses</p>
            <p className="text-3xl font-bold text-indigo-600">
              {responses.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500">Total Questions</p>
            <p className="text-3xl font-bold text-green-600">
              {form.questions.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500">Form Status</p>
            <p
              className={`text-xl font-semibold ${
                form.isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {form.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>

        {/* ===================== ANALYTICS ===================== */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Response Analytics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {form.questions.map((q) => {
              const data = getChartData(q.id);
              if (data.length === 0) return null;

              return (
                <div
                  key={q.id}
                  className="bg-white p-6 rounded-lg shadow"
                >
                  <h3 className="font-semibold mb-4">{q.label}</h3>

                  {(q.type === "radio" || q.type === "dropdown") && (
                    <div className="h-72">
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            label
                          >
                            {data.map((_, i) => (
                              <Cell
                                key={i}
                                fill={COLORS[i % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {q.type === "checkbox" && (
                    <div className="h-72">
                      <ResponsiveContainer>
                        <BarChart data={data}>
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#2563eb" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {(q.type === "text" || q.type === "textarea") && (
                    <p className="text-sm text-gray-500">
                      Text responses are shown in the table below.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================== TABLE ===================== */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border px-4 py-3 text-left">#</th>
                {form.questions.map((q) => (
                  <th
                    key={q.id}
                    className="border px-4 py-3 text-left"
                  >
                    {q.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {responses.map((r, index) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 font-medium">
                    {index + 1}
                  </td>
                  {form.questions.map((q) => (
                    <td key={q.id} className="border px-4 py-2">
                      {Array.isArray(r.answers?.[q.id])
                        ? r.answers[q.id].join(", ")
                        : r.answers?.[q.id] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {responses.length === 0 && (
            <p className="p-6 text-center text-gray-500">
              No responses have been submitted yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
