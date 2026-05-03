import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch symptoms
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/symptoms")
      .then(res => setSymptoms(res.data))
      .catch(err => console.log(err));
  }, []);

  // Handle checkbox
  const handleChange = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Predict
  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", {
        symptoms: selectedSymptoms
      });

      setResult(res.data);
    } catch (error) {
      console.log(error);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  // Filter symptoms
  const filteredSymptoms = symptoms.filter(symptom =>
    symptom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", maxWidth: "800px", margin: "auto" }}>

      <h1 style={{ textAlign: "center" }}>🩺 Disease Prediction System</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search symptoms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      {/* Symptoms List */}
      <div style={{
        height: "250px",
        overflowY: "scroll",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "10px",
        background: "#f9f9f9"
      }}>
        {filteredSymptoms.map((symptom, index) => (
          <div key={index}>
            <input
              type="checkbox"
              onChange={() => handleChange(symptom)}
            />
            {" "}{symptom}
          </div>
        ))}
      </div>

      {/* Selected Symptoms */}
      <h3>Selected Symptoms:</h3>
      <div>
        {selectedSymptoms.map((s, i) => (
          <span key={i} style={{
            display: "inline-block",
            margin: "5px",
            padding: "6px 12px",
            background: "#007bff",
            color: "white",
            borderRadius: "20px"
          }}>
            {s}
          </span>
        ))}
      </div>

      {/* Predict Button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={handlePredict}
          style={{
            marginTop: "20px",
            padding: "12px 30px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Predict
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          ⏳ Predicting...
        </p>
      )}

      {/* RESULT SECTION */}
      {result && (
        <div style={{
          marginTop: "25px",
          padding: "20px",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 0 12px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ textAlign: "center" }}>🧾 Prediction Result</h2>

          <h3 style={{ color: "red", textAlign: "center" }}>
            {result.predicted_disease}
          </h3>

          <p style={{ textAlign: "center", fontSize: "16px" }}>
            Confidence: {(result.confidence * 100).toFixed(2)}%
          </p>

          <hr />

          <h4>📖 Description:</h4>
          <p>{result.description}</p>

          <h4>🛡️ Precautions:</h4>
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