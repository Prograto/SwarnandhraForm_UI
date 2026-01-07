import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import BackToDashboard from "../components/BackToDashboard";


/* Helper to show question type */
const formatType = (type) => {
  switch (type) {
    case "text":
      return "Short Answer";
    case "textarea":
      return "Paragraph";
    case "radio":
      return "Multiple Choice";
    case "checkbox":
      return "Checkboxes";
    case "dropdown":
      return "Dropdown";
    default:
      return type;
  }
};

export default function CreateForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [publicLink, setPublicLink] = useState("");
  const [formId, setFormId] = useState(null);
  const [created, setCreated] = useState(false);

  const navigate = useNavigate();

  /* ADD QUESTION */
  const addQuestion = (type) => {
    if (created) return;
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        label: "",
        required: false,
        options:
          type === "radio" || type === "checkbox" || type === "dropdown"
            ? ["Option 1"]
            : [],
      },
    ]);
  };

  const updateLabel = (i, v) => {
    if (created) return;
    const c = [...questions];
    c[i].label = v;
    setQuestions(c);
  };

  const toggleRequired = (i) => {
    if (created) return;
    const c = [...questions];
    c[i].required = !c[i].required;
    setQuestions(c);
  };

  const addOption = (qi) => {
    if (created) return;
    const c = [...questions];
    c[qi].options.push(`Option ${c[qi].options.length + 1}`);
    setQuestions(c);
  };

  const updateOption = (qi, oi, v) => {
    if (created) return;
    const c = [...questions];
    c[qi].options[oi] = v;
    setQuestions(c);
  };

  const deleteOption = (qi, oi) => {
    if (created) return;
    const c = [...questions];
    c[qi].options.splice(oi, 1);
    setQuestions(c);
  };

  const deleteQuestion = (i) => {
    if (created) return;
    setQuestions((p) => p.filter((_, idx) => idx !== i));
  };

  const createForm = async () => {
    if (!title.trim()) {
      alert("Form title is required");
      return;
    }

    const res = await api.post("/forms/create", {
      title,
      description,
      questions,
    });

    const id = res.data.formId;
    setFormId(id);
    setPublicLink(`${window.location.origin}/form/${id}`);
    setCreated(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
      <BackToDashboard />
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">
            Create Academic Form
          </h1>
          <p className="text-gray-600">
            Swarnandhra College of Engineering & Technology
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-xl shadow p-6">

          {/* TITLE */}
          <input
            className="w-full border rounded-lg px-4 py-2 mb-3 text-lg font-medium
              focus:ring-2 focus:ring-indigo-300 outline-none"
            placeholder="Form Title"
            disabled={created}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* DESCRIPTION */}
          <textarea
            className="w-full border rounded-lg px-4 py-2 mb-6 resize-none
              focus:ring-2 focus:ring-indigo-300 outline-none"
            rows={3}
            placeholder="Form description (instructions for users)"
            disabled={created}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* QUESTIONS */}
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="border rounded-lg p-4 mb-4 bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Q{index + 1}</span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                    {formatType(q.type)}
                  </span>
                </div>

                {!created && (
                  <button
                    onClick={() => deleteQuestion(index)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* QUESTION INPUT */}
              <input
                className="w-full border rounded-lg px-3 py-2 mb-3
                  focus:ring-2 focus:ring-indigo-300 outline-none"
                placeholder="Enter your question here"
                disabled={created}
                value={q.label}
                onChange={(e) => updateLabel(index, e.target.value)}
              />

              {/* OPTIONS */}
              {(q.type === "radio" ||
                q.type === "checkbox" ||
                q.type === "dropdown") && (
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex gap-2">
                      <input
                        className="flex-1 border rounded px-2 py-1
                          focus:ring-2 focus:ring-indigo-300 outline-none"
                        value={opt}
                        disabled={created}
                        onChange={(e) =>
                          updateOption(index, oi, e.target.value)
                        }
                      />
                      {!created && (
                        <button
                          onClick={() => deleteOption(index, oi)}
                          className="text-red-500 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {!created && (
                    <button
                      onClick={() => addOption(index)}
                      className="text-indigo-600 text-sm hover:underline"
                    >
                      + Add option
                    </button>
                  )}
                </div>
              )}

              {/* REQUIRED */}
              <div className="mt-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    disabled={created}
                    checked={q.required}
                    onChange={() => toggleRequired(index)}
                  />
                  Required
                </label>
              </div>
            </div>
          ))}

          {/* QUESTION TYPE BUTTONS */}
          {!created && (
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                ["text", "Text"],
                ["textarea", "Textarea"],
                ["radio", "Radio"],
                ["checkbox", "Checkbox"],
                ["dropdown", "Dropdown"],
              ].map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => addQuestion(type)}
                  className="px-4 py-2 rounded-lg border bg-white
                    hover:bg-indigo-50 hover:border-indigo-400 transition"
                >
                  + {label}
                </button>
              ))}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={createForm}
              disabled={created}
              className={`px-5 py-2 rounded-lg text-white font-medium
                ${
                  created
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
            >
              Create Form
            </button>

            {created && (
              <button
                onClick={() => navigate(`/admin/edit/${formId}`)}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700
                  text-white font-medium"
              >
                Edit Form
              </button>
            )}
          </div>
        </div>

        {/* PUBLIC LINK */}
        {publicLink && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-4">
            <p className="font-semibold mb-2">Public Form Link</p>
            <input
              className="w-full border rounded px-3 py-2 mb-2"
              value={publicLink}
              readOnly
            />
            <div className="flex gap-2">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(publicLink)
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                Copy Link
              </button>
              <a
                href={publicLink}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded"
              >
                Open Form
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
