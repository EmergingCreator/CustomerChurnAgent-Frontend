import axios from "axios";

// Address of your FastAPI server (set in the .env file)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Turns the form values into the question text that your agent understands
export function buildQuestion(c) {
  return (
    "Predict churn for this customer using the prediction tool. " +
    "Return the actual model prediction and churn probability. " +
    `Customer details: Gender=${c.gender}, SeniorCitizen=${c.SeniorCitizen}, ` +
    `Partner=${c.Partner}, Dependents=${c.Dependents}, tenure=${c.tenure}, ` +
    `PhoneService=${c.PhoneService}, MultipleLines=${c.MultipleLines}, ` +
    `InternetService=${c.InternetService}, OnlineSecurity=${c.OnlineSecurity}, ` +
    `OnlineBackup=${c.OnlineBackup}, DeviceProtection=${c.DeviceProtection}, ` +
    `TechSupport=${c.TechSupport}, StreamingTV=${c.StreamingTV}, ` +
    `StreamingMovies=${c.StreamingMovies}, Contract=${c.Contract}, ` +
    `PaperlessBilling=${c.PaperlessBilling}, PaymentMethod=${c.PaymentMethod}, ` +
    `MonthlyCharges=${c.MonthlyCharges}, TotalCharges=${c.TotalCharges}.`
  );
}

// Sends any question to FastAPI (POST /) and returns the answer text.
// Used by BOTH the prediction form and the chat box.
export async function askAgent(question) {
  try {
    const response = await axios.post(
      API_URL + "/",
      { question: question },
      { timeout: 60000 } // wait up to 60 seconds
    );
    return response.data.answer; // FastAPI replies with { question, answer }
  } catch (error) {
    if (error.response) {
      throw new Error("Server error: " + error.response.status);
    }
    throw new Error("Cannot reach the API. Is FastAPI running and is CORS enabled?");
  }
}