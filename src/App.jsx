import PredictForm from "./components/PredictForm";
import Chat from "./components/Chat";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-8xl px-4 py-10">
        {/* Page title */}
        <h1 className="text-center text-4xl font-bold">
          Customer{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Churn Predictor
          </span>
        </h1>
        <p className="mt-3 text-center text-slate-400">
          Fill in the customer details to get a prediction, or ask the AI anything in the chat.
        </p>

        {/* Left: form. Right: chat */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <PredictForm />
          <Chat />
        </div>
      </div>
    </div>
  );
}