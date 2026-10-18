
import { useStore } from "./../store/useChurnStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Common option lists
const yesNo = ["Yes", "No"];
const yesNoNoInternet = ["Yes", "No", "No internet service"];

const dropdowns = [
  { name: "gender", label: "Gender", options: ["Female", "Male"] },
  {
    name: "SeniorCitizen",
    label: "Senior citizen (0 = No, 1 = Yes)",
    options: ["0", "1"],
  },
  { name: "Partner", label: "Partner", options: yesNo },
  { name: "Dependents", label: "Dependents", options: yesNo },
  { name: "PhoneService", label: "Phone service", options: yesNo },
  {
    name: "MultipleLines",
    label: "Multiple lines",
    options: ["Yes", "No", "No phone service"],
  },
  {
    name: "InternetService",
    label: "Internet service",
    options: ["DSL", "Fiber optic", "No"],
  },
  {
    name: "OnlineSecurity",
    label: "Online security",
    options: yesNoNoInternet,
  },
  {
    name: "OnlineBackup",
    label: "Online backup",
    options: yesNoNoInternet,
  },
  {
    name: "DeviceProtection",
    label: "Device protection",
    options: yesNoNoInternet,
  },
  {
    name: "TechSupport",
    label: "Tech support",
    options: yesNoNoInternet,
  },
  {
    name: "StreamingTV",
    label: "Streaming TV",
    options: yesNoNoInternet,
  },
  {
    name: "StreamingMovies",
    label: "Streaming movies",
    options: yesNoNoInternet,
  },
  {
    name: "Contract",
    label: "Contract",
    options: ["Month-to-month", "One year", "Two year"],
  },
  { name: "PaperlessBilling", label: "Paperless billing", options: yesNo },
  {
    name: "PaymentMethod",
    label: "Payment method",
    options: [
      "Electronic check",
      "Mailed check",
      "Bank transfer (automatic)",
      "Credit card (automatic)",
    ],
  },
];

const numbers = [
  { name: "tenure", label: "Tenure (months)", min: 0 },
  { name: "MonthlyCharges", label: "Monthly charges ($)", min: 0 },
  { name: "TotalCharges", label: "Total charges ($)", min: 0 },
];

const inputStyle =
  "mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20";

function formatLabel(value) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function MarkdownReport({ result }) {
  return (
    <div
      className="
        break-words text-sm text-slate-300
        [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-2xl
        [&_h1]:font-bold [&_h1]:text-white
        [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:border-b
        [&_h2]:border-slate-700 [&_h2]:pb-2
        [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white
        [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-base
        [&_h3]:font-semibold [&_h3]:text-indigo-300
        [&_p]:mb-3 [&_p]:leading-7
        [&_strong]:font-semibold [&_strong]:text-white
        [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6
        [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6
        [&_li]:leading-6
        [&_hr]:my-5 [&_hr]:border-slate-700
        [&_a]:text-indigo-300 [&_a]:underline
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="mb-5 overflow-x-auto rounded-xl border border-slate-700">
              <table className="w-full min-w-[440px] border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-800">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold text-white">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-t border-slate-700 px-4 py-3 align-top">
              {children}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-indigo-400 bg-indigo-500/5 py-2 pl-4">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-slate-800 px-1.5 py-0.5 text-indigo-200">
              {children}
            </code>
          ),
        }}
      >
        {result}
      </ReactMarkdown>
    </div>
  );
}

function getProbability(result) {
  if (typeof result !== "string") return null;

  // Accept explicit labels such as "Churn Probability: 0.82"
  // or "Churn Probability: 82%".
  const match = result.match(
    /(?:churn\s+)?probability\s*[:=-]\s*(0(?:\.\d+)?|1(?:\.0+)?|\d{1,3}(?:\.\d+)?)\s*(%)?/i
  );

  if (!match) return null;

  const raw = Number(match[1]);
  const probability = match[2] ? raw / 100 : raw;

  if (probability < 0 || probability > 1) return null;

  return probability;
}

function getPrediction(result) {
  if (typeof result !== "string") return null;

  // Only trust an explicit model-prediction label, not arbitrary
  // mentions of class 1 in the AI explanation.
  const match = result.match(
    /(?:model\s+)?prediction\s*[:=-]\s*([01])\b/i
  );

  if (!match) return null;

  return Number(match[1]);
}

export default function PredictForm() {
  const customer = useStore((state) => state.customer);
  const setField = useStore((state) => state.setField);
  const predict = useStore((state) => state.predict);
  const loading = useStore((state) => state.loading);
  const result = useStore((state) => state.result);
  const error = useStore((state) => state.error);

  const prediction = getPrediction(result);
  const churnProbability = getProbability(result);

  // The model prediction is preferred. If the response has no
  // explicit prediction, don't infer it from unrelated prose.
  const willChurn = prediction === 1;

  function handleSubmit(event) {
    event.preventDefault();
    predict();
  }

  const profileFields = [
    ["Contract", customer.Contract],
    ["Tenure", `${customer.tenure ?? "—"} months`],
    ["Internet service", customer.InternetService],
    [
      "Monthly charges",
      customer.MonthlyCharges === "" || customer.MonthlyCharges == null
        ? "—"
        : `$${Number(customer.MonthlyCharges).toFixed(2)}`,
    ],
    [
      "Total charges",
      customer.TotalCharges === "" || customer.TotalCharges == null
        ? "—"
        : `$${Number(customer.TotalCharges).toFixed(2)}`,
    ],
    ["Payment method", customer.PaymentMethod],
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 text-slate-100">
      {/* Form */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-xl">
            📊
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Customer churn prediction
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Enter customer details to generate an AI-assisted report.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Customer information
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dropdowns.map((field) => (
              <label
                key={field.name}
                className="block text-xs font-medium text-slate-400"
              >
                {field.label}
                <select
                  className={inputStyle}
                  value={customer[field.name] ?? ""}
                  onChange={(event) =>
                    setField(field.name, event.target.value)
                  }
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            {numbers.map((field) => (
              <label
                key={field.name}
                className="block text-xs font-medium text-slate-400"
              >
                {field.label}
                <input
                  type="number"
                  min={field.min}
                  step="any"
                  required
                  className={inputStyle}
                  value={customer[field.name] ?? ""}
                  onChange={(event) =>
                    setField(field.name, event.target.value)
                  }
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Analyzing customer...
              </>
            ) : (
              <>✨ Predict churn</>
            )}
          </button>
        </form>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-300"
          >
            <p className="font-semibold">Prediction failed</p>
            <p className="mt-1">{error}</p>
          </div>
        )}
      </section>

      {/* Result report */}
      {result && (
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          {/* Report heading */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 p-5 sm:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                AI-powered analytics
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Churn prediction report
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Prediction results and customer analysis
              </p>
            </div>

            {prediction !== null && (
              <span
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                  willChurn
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                {willChurn ? "⚠ Likely to churn" : "✓ Likely to stay"}
              </span>
            )}
          </div>

          <div className="space-y-7 p-5 sm:p-7">
            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
                <p className="text-sm text-slate-400">Model prediction</p>
                <p
                  className={`mt-3 text-2xl font-bold ${
                    prediction === null
                      ? "text-slate-300"
                      : willChurn
                        ? "text-red-400"
                        : "text-emerald-400"
                  }`}
                >
                  {prediction === null
                    ? "See AI report"
                    : willChurn
                      ? "Likely to churn"
                      : "Likely to stay"}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Based on the prediction returned by the model.
                </p>
              </div>

           
            </div>

            {/* Customer profile */}
            <section>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Customer profile
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Key details for the submitted customer
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {profileFields.map(([label, value]) => (
                  <div
                    key={label}
                    className="min-w-0 rounded-xl border border-slate-800 bg-slate-950/40 p-4"
                  >
                    <p className="text-xs font-medium text-slate-500">
                      {label}
                    </p>
                    <p className="mt-2 break-words text-sm font-semibold text-slate-100">
                      {value ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* AI report */}
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-lg">
                  ✦
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI analysis</h3>
                  <p className="text-xs text-slate-400">
                    Factors to investigate and recommended actions
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 sm:p-6">
                <MarkdownReport result={result} />
              </div>
            </section>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <span aria-hidden="true">ⓘ</span>
              <p className="text-xs leading-6 text-slate-400">
                Predictions are estimates, not guarantees. Review the
                customer's circumstances before making retention decisions.
                Feature-specific explanations should be validated using
                model explainability or supporting data analysis.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
