import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams } from "react-router-dom";
import BackToManageForms from "../components/BackToManageForms";

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

export default function EditForm() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD FORM ================= */
  useEffect(() => {
    api.get(`/forms/admin/${id}`).then((res) => {
      const normalizedQuestions = (res.data.questions || []).map((q) => ({
        ...q,
        id: q.id || crypto.randomUUID(),
        options: (q.options || []).map((opt) =>
          typeof opt === "string"
            ? { id: crypto.randomUUID(), label: opt }
            : opt
        ),
      }));

      setTitle(res.data.title);
      setDescription(res.data.description);
      setQuestions(normalizedQuestions);
      setLoading(false);
    });
  }, [id]);

  /* ================= QUESTION LOGIC ================= */

  const addQuestion = (type) => {
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        label: "",
        required: false,
        options:
          type === "radio" || type === "checkbox" || type === "dropdown"
            ? [{ id: crypto.randomUUID(), label: "Option 1" }]
            : [],
      },
    ]);
  };

  const updateLabel = (qId, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, label: value } : q
      )
    );
  };

  const toggleRequired = (qId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, required: !q.required } : q
      )
    );
  };

  const addOption = (qId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: [
                ...q.options,
                {
                  id: crypto.randomUUID(),
                  label: `Option ${q.options.length + 1}`,
                },
              ],
            }
          : q
      )
    );
  };

  const updateOption = (qId, optId, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optId ? { ...o, label: value } : o
              ),
            }
          : q
      )
    );
  };

  const deleteOption = (qId, optId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.filter((o) => o.id !== optId),
            }
          : q
      )
    );
  };

  const deleteQuestion = (qId) => {
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
  };

  /* ================= SAVE FORM ================= */

  const saveForm = async () => {
    const payload = {
      title,
      description,
      questions: questions.map((q) => ({
        ...q,
        options: q.options.map((o) => o.label), // store clean strings in DB
      })),
    };

    await api.put(`/forms/${id}`, payload);
    alert("Form updated successfully");
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading form...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* BACK */}
        <BackToManageForms />

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-indigo-700">
            Edit Academic Form
          </h1>
          <p className="text-gray-600">
            Swarnandhra College of Engineering & Technology
          </p>
        </div>

        {/* FORM DETAILS */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <input
            className="border rounded p-3 w-full focus:ring-2 focus:ring-indigo-300 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Form Title"
          />

          <textarea
            rows={3}
            className="border rounded p-3 w-full focus:ring-2 focus:ring-indigo-300 outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Form Description"
          />
        </div>

        {/* QUESTIONS */}
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="bg-white rounded-lg shadow p-5 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold mr-2">
                  Q{index + 1}
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {formatType(q.type)}
                </span>
              </div>

              <button
                onClick={() => deleteQuestion(q.id)}
                className="text-red-600 text-sm hover:underline"
              >
                Delete
              </button>
            </div>

            <input
              className="border rounded p-2 w-full focus:ring-2 focus:ring-indigo-300 outline-none"
              value={q.label}
              placeholder="Enter question"
              onChange={(e) =>
                updateLabel(q.id, e.target.value)
              }
            />

            {(q.type === "radio" ||
              q.type === "checkbox" ||
              q.type === "dropdown") && (
              <div className="space-y-2">
                {q.options.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex items-center gap-2"
                  >
                    <input
                      className="border rounded p-2 flex-1"
                      value={opt.label}
                      onChange={(e) =>
                        updateOption(q.id, opt.id, e.target.value)
                      }
                    />
                    <button
                      onClick={() =>
                        deleteOption(q.id, opt.id)
                      }
                      className="text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addOption(q.id)}
                  className="text-indigo-600 text-sm hover:underline"
                >
                  + Add option
                </button>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={q.required}
                onChange={() => toggleRequired(q.id)}
              />
              Required
            </label>
          </div>
        ))}

        {/* ADD QUESTION */}
        <div className="flex flex-wrap gap-2">
          {["text", "textarea", "radio", "checkbox", "dropdown"].map(
            (t) => (
              <button
                key={t}
                onClick={() => addQuestion(t)}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200"
              >
                Add {t}
              </button>
            )
          )}
        </div>

        {/* SAVE */}
        <div className="text-right">
          <button
            onClick={saveForm}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
