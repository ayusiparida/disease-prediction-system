from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# -----------------------------
# LOAD MODEL & SYMPTOMS
# -----------------------------
model = pickle.load(open("model.pkl", "rb"))
symptoms_list = pickle.load(open("symptoms.pkl", "rb"))

# -----------------------------
# DEFAULT INFO (for all diseases)
# -----------------------------
default_info = {
    "description": "This condition requires medical attention. Please consult a healthcare professional.",
    "precautions": [
        "Maintain proper hygiene",
        "Drink plenty of water",
        "Take adequate rest",
        "Consult a doctor if symptoms persist"
    ]
}

# -----------------------------
# CUSTOM DISEASE INFO
# -----------------------------
disease_info = {
    "Fungal infection": {
        "description": "A fungal infection affects skin, hair or nails.",
        "precautions": [
            "Keep skin clean and dry",
            "Avoid sharing clothes",
            "Use antifungal creams",
            "Maintain hygiene"
        ]
    },
    "Allergy": {
        "description": "Reaction of immune system to allergens.",
        "precautions": [
            "Avoid allergens",
            "Take antihistamines",
            "Keep surroundings clean",
            "Wear mask outdoors"
        ]
    },
    "GERD": {
        "description": "Acid reflux causing heartburn.",
        "precautions": [
            "Avoid spicy food",
            "Eat smaller meals",
            "Do not lie down after eating",
            "Maintain healthy weight"
        ]
    },
    "Diabetes": {
        "description": "A chronic condition affecting blood sugar levels.",
        "precautions": [
            "Monitor blood sugar regularly",
            "Exercise regularly",
            "Follow a healthy diet",
            "Avoid sugary foods"
        ]
    },
    "Hypertension": {
        "description": "High blood pressure condition.",
        "precautions": [
            "Reduce salt intake",
            "Exercise regularly",
            "Avoid stress",
            "Monitor BP levels"
        ]
    }
}

# -----------------------------
# HELPER FUNCTION
# -----------------------------
def create_input_vector(user_symptoms):
    input_vector = [0] * len(symptoms_list)

    for symptom in user_symptoms:
        if symptom in symptoms_list:
            index = symptoms_list.index(symptom)
            input_vector[index] = 1

    return input_vector

# -----------------------------
# ROUTES
# -----------------------------

@app.route("/")
def home():
    return "API is running"

# 👉 Get all symptoms
@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    return jsonify(symptoms_list)

# 👉 Prediction API
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        user_symptoms = data.get("symptoms", [])

        # Convert symptoms to input vector
        input_vector = create_input_vector(user_symptoms)

        # Prediction
        prediction = model.predict([input_vector])[0]

        # Confidence score
        confidence = max(model.predict_proba([input_vector])[0])

        # Get disease info
        info = disease_info.get(prediction, default_info)

        return jsonify({
            "predicted_disease": prediction,
            "confidence": round(float(confidence), 2),
            "description": info["description"],
            "precautions": info["precautions"]
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        })

# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)