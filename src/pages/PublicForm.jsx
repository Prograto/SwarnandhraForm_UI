import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams } from "react-router-dom";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function PublicForm() {
  const { id } = useParams();

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [notAvailable, setNotAvailable] = useState(false);

  useEffect(() => {
    api
      .get(`/forms/${id}`)
      .then((res) => setForm(res.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotAvailable(true);
        }
      });
  }, [id]);

  /* ===================== VALIDATE & SUBMIT ===================== */
  const submit = async () => {
    const newErrors = {};

    form.questions.forEach((q) => {
      if (q.required) {
        const value = answers[q.id];
        if (
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          newErrors[q.id] = "This question is required";
        }
      }
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await api.post("/responses/submit", {
      formId: id,
      answers,
    });

    setSubmitted(true);
  };

  const resetForm = () => {
    setAnswers({});
    setErrors({});
    setSubmitted(false);
  };

  /* ===================== FORM NOT AVAILABLE ===================== */
  if (notAvailable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Form Not Available
          </h2>
          <p className="text-gray-600">
            This form is no longer accepting responses.
          </p>
        </div>
      </div>
    );
  }

  if (!form) return null;

  /* ===================== SUCCESS SCREEN ===================== */
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Response Submitted
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for submitting the form.
          </p>
          <button
            onClick={resetForm}
            className="text-indigo-600 hover:underline font-medium"
          >
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  /* ===================== FORM UI ===================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* COLLEGE HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">
            Swarnandhra College of Engineering & Technology
          </h1>
          <p className="text-gray-600 mt-1">
            Academic Forms Management System – Prog
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8">
          {/* FORM HEADER */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {form.title}
          </h1>
          <p className="text-gray-600 mb-6">{form.description}</p>

          <div className="border-t pt-6 space-y-6">
            {form.questions.map((q, index) => (
              <div key={q.id}>
                <label className="block font-medium text-gray-800 mb-2">
                  {index + 1}. {q.label}
                  {q.required && (
                    <span className="text-red-600 ml-1">*</span>
                  )}
                </label>

                {/* TEXT */}
                {q.type === "text" && (
                  <input
                    className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
                      errors[q.id]
                        ? "border-red-500 focus:ring-red-300"
                        : "focus:ring-indigo-300"
                    }`}
                    onChange={(e) =>
                      setAnswers({ ...answers, [q.id]: e.target.value })
                    }
                  />
                )}

                {/* TEXTAREA */}
                {q.type === "textarea" && (
                  <textarea
                    rows={4}
                    className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
                      errors[q.id]
                        ? "border-red-500 focus:ring-red-300"
                        : "focus:ring-indigo-300"
                    }`}
                    onChange={(e) =>
                      setAnswers({ ...answers, [q.id]: e.target.value })
                    }
                  />
                )}

                {/* RADIO */}
                {q.type === "radio" &&
                  q.options.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-gray-700 mb-1"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        onChange={() =>
                          setAnswers({ ...answers, [q.id]: opt })
                        }
                      />
                      {opt}
                    </label>
                  ))}

                {/* CHECKBOX */}
                {q.type === "checkbox" &&
                  q.options.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-gray-700 mb-1"
                    >
                      <input
                        type="checkbox"
                        value={opt}
                        onChange={(e) => {
                          const prev = answers[q.id] || [];
                          setAnswers({
                            ...answers,
                            [q.id]: e.target.checked
                              ? [...prev, opt]
                              : prev.filter((o) => o !== opt),
                          });
                        }}
                      />
                      {opt}
                    </label>
                  ))}

                {/* DROPDOWN */}
                {q.type === "dropdown" && (
                  <select
                    className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
                      errors[q.id]
                        ? "border-red-500 focus:ring-red-300"
                        : "focus:ring-indigo-300"
                    }`}
                    onChange={(e) =>
                      setAnswers({ ...answers, [q.id]: e.target.value })
                    }
                  >
                    <option value="">Select an option</option>
                    {q.options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {/* ERROR */}
                {errors[q.id] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors[q.id]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <div className="mt-8 text-right">
            <button
              onClick={submit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg shadow font-medium"
            >
              Submit
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Swarnandhra College of Engineering & Technology
        </p>
      </div>
    </div>
  );
}
