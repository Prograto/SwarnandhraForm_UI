import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">
            Swarnandhra College of Engineering & Technology
          </h1>
          <p className="text-gray-600 mt-1">
            Academic Forms Management – Admin Dashboard
          </p>
        </div>

        {/* WELCOME CARD */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome, Admin 👋
          </h2>
          <p className="text-gray-600">
            Use this dashboard to create, manage, and analyze academic forms
            shared with students and faculty. This system helps streamline
            internal data collection and response monitoring.
          </p>
        </div>

        {/* ACTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CREATE FORM */}
          <Link
            to="/admin/create"
            className="bg-white hover:shadow-lg transition rounded-lg p-6 border-l-4 border-indigo-600"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Create New Form
            </h3>
            <p className="text-gray-600 text-sm">
              Design and publish new academic or administrative forms with
              custom questions and validation rules.
            </p>
            <span className="inline-block mt-4 text-indigo-600 font-medium">
              Create Form →
            </span>
          </Link>

          {/* MANAGE FORMS */}
          <Link
            to="/admin/manage"
            className="bg-white hover:shadow-lg transition rounded-lg p-6 border-l-4 border-gray-800"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Manage Existing Forms
            </h3>
            <p className="text-gray-600 text-sm">
              View, edit, activate/deactivate forms and analyze submitted
              responses from users.
            </p>
            <span className="inline-block mt-4 text-gray-800 font-medium">
              Manage Forms →
            </span>
          </Link>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Swarnandhra College of Engineering &
          Technology • Internal Admin Portal
        </div>
      </div>
    </div>
  );
}
