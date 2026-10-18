import { create } from "zustand";
import { askAgent, buildQuestion } from "./api";

// The store keeps all shared data in one place.
// Any component can read it with: useStore((state) => state.something)
export const useStore = create((set, get) => ({
  // ---------- Prediction form ----------
  customer: {
    gender: "Female",
    SeniorCitizen: "0",
    Partner: "Yes",
    Dependents: "No",
    tenure: 12,
    PhoneService: "Yes",
    MultipleLines: "No",
    InternetService: "Fiber optic",
    OnlineSecurity: "No",
    OnlineBackup: "Yes",
    DeviceProtection: "No",
    TechSupport: "No",
    StreamingTV: "Yes",
    StreamingMovies: "Yes",
    Contract: "Month-to-month",
    PaperlessBilling: "Yes",
    PaymentMethod: "Electronic check",
    MonthlyCharges: 89.5,
    TotalCharges: 1074.5,
  },
  result: "", // the answer text from the agent
  loading: false,
  error: "",

  // Change one field of the form, e.g. setField("tenure", 24)
  setField: (name, value) =>
    set((state) => ({ customer: { ...state.customer, [name]: value } })),

  // Send the form to the agent and save the answer
  predict: async () => {
    set({ loading: true, error: "", result: "" });
    try {
      const question = buildQuestion(get().customer);
      const answer = await askAgent(question);
      set({ result: answer, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ---------- Chat ----------
  messages: [
    { role: "bot", text: "Hi! Ask me anything about customer churn." },
  ],
  chatLoading: false,

  // Add the user's message, ask the agent, then add the reply
  sendMessage: async (text) => {
    set((state) => ({
      messages: [...state.messages, { role: "user", text: text }],
      chatLoading: true,
    }));

    try {
      const answer = await askAgent(text);
      set((state) => ({
        messages: [...state.messages, { role: "bot", text: answer }],
        chatLoading: false,
      }));
    } catch (err) {
      set((state) => ({
        messages: [...state.messages, { role: "bot", text: "⚠️ " + err.message }],
        chatLoading: false,
      }));
    }
  },
}));