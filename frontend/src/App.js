import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);

  // ✅ Your LIVE backend URL
  const API_URL = "https://disease-backend-zrdn.onrender.com";

  // Fetch symptoms from backend
  useEffect(() => {
    axios
      .get(`${API_URL}/symptoms`)
      .then((res) => setSymptoms(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Handle checkbox selection
  const handleChange = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(
        selectedSymptoms.filter((s) => s !== symptom)
      );
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Call prediction API
  const handleSubmit = () => {
    axios
      .post(`${API_URL}/predict`, {
        symptoms: selectedSymptoms,
      })
      .then((res) => setResult(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Disease Prediction System</h1>

      <h2>Select Symptoms:</h2>

      <div
        style={{
          maxHeight: "300px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        {symptoms.map((symptom, index) => (
          <div key={index}>
            <input
              type="checkbox"
              value={symptom}
              onChange={() => handleChange(symptom)}
            />{" "}
            {symptom}
          </div>
        ))}
      </div>

      <br />

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Predict
      </button>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#f9f9f9",
          }}
        >
          <h2>Result:</h2>

          {/* ✅ FIXED FIELD HERE */}
          <p>
            <strong>Disease:</strong>{" "}
            {result.disease || result.prediction}
          </p>

          <p>
            <strong>Confidence:</strong> {result.confidence}
          </p>

          <p>
            <strong>Description:</strong> {result.description}
          </p>

          <p>
            <strong>Precautions:</strong>
          </p>

          <ul>
            {result.precautions &&
              result.precautions.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;