from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # ✅ allow frontend access

# Load model and symptoms
model = pickle.load(open("model.pkl", "rb"))
symptoms_list = pickle.load(open("symptoms.pkl", "rb"))

# -------------------------------
# Dummy Disease Info (You can improve later)
# -------------------------------
disease_description = {
    "Fungal infection": "A fungal infection affects skin, hair or nails.",
    "Allergy": "An allergic reaction by the immune system.",
    "GERD": "Gastroesophageal reflux disease causing acid reflux.",
}

disease_precaution = {
    "Fungal infection": ["Keep area clean", "Use antifungal cream", "Avoid moisture"],
    "Allergy": ["Avoid allergens", "Take antihistamines", "Consult doctor"],
    "GERD": ["Avoid spicy food", "Eat smaller meals", "Do not lie down after eating"],
}

# -------------------------------
# HOME ROUTE
# -------------------------------
@app.route("/")
def home():
    return "API is running"

# -------------------------------
# GET SYMPTOMS
# -------------------------------
@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    return jsonify(symptoms_list)

# -------------------------------
# PREDICT DISEASE
# -------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    selected_symptoms = data.get("symptoms", [])

    # Create input vector
    input_vector = [0] * len(symptoms_list)

    for symptom in selected_symptoms:
        if symptom in symptoms_list:
            index = symptoms_list.index(symptom)
            input_vector[index] = 1

    input_vector = np.array(input_vector).reshape(1, -1)

    # Prediction
    prediction = model.predict(input_vector)[0]

    # Confidence
    try:
        confidence = float(np.max(model.predict_proba(input_vector)))
    except:
        confidence = 0.0

    # Get info
    description = disease_description.get(prediction, "No description available")
    precautions = disease_precaution.get(prediction, ["No precautions available"])

    # ✅ FINAL RESPONSE (IMPORTANT FIX)
    return jsonify({
        "disease": str(prediction),
        "confidence": round(confidence, 2),
        "description": description,
        "precautions": precautions
    })

# -------------------------------
# RUN APP
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)