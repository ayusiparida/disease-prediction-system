import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);

  // 🔥 YOUR LIVE BACKEND URL
  const API_URL = "https://disease-backend-zrdn.onrender.com";

  // Fetch symptoms
  useEffect(() => {
    axios.get(`${API_URL}/symptoms`)
      .then(res => setSymptoms(res.data))
      .catch(err => console.log(err));
  }, []);

  // Handle checkbox change
  const handleChange = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Predict disease
  const handleSubmit = () => {
    axios.post(`${API_URL}/predict`, {
      symptoms: selectedSymptoms
    })
    .then(res => setResult(res.data))
    .catch(err => console.log(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Disease Prediction System</h1>

      <h2>Select Symptoms:</h2>

      <div style={{ maxHeight: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {symptoms.map((symptom, index) => (
          <div key={index}>
            <input
              type="checkbox"
              value={symptom}
              onChange={() => handleChange(symptom)}
            />
            {symptom}
          </div>
        ))}
      </div>

      <br />

      <button onClick={handleSubmit}>Predict</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Result:</h2>
          <p><strong>Disease:</strong> {result.disease}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
          <p><strong>Description:</strong> {result.description}</p>
          <p><strong>Precautions:</strong></p>
          <ul>
            {result.precautions.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;