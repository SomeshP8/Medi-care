from flask import Flask, request, jsonify
app = Flask(__name__)

def calculate_risk(bp, sugar, heart_rate):
    risk = "Low"
    suggestions = []
    score = 0
    
    # High Risk Check
    if bp > 140 or sugar > 200 or heart_rate > 110:
        risk = "High"
        score += 3
    # Medium Risk Check
    elif (120 <= bp <= 140) or (140 <= sugar <= 200):
        risk = "Medium"
        score += 1
        
    # Analyze Specifics and calculate score/suggestions
    if bp > 140:
        suggestions.append("Consult a doctor regarding high blood pressure.")
        suggestions.append("Reduce sodium intake.")
        score += 2
    elif 120 <= bp <= 140:
        suggestions.append("Monitor your blood pressure.")
        score += 1
        
    if sugar > 200:
        suggestions.append("Consult a doctor regarding high blood sugar.")
        suggestions.append("Avoid sugary foods and drinks.")
        score += 2
    elif 140 <= sugar <= 200:
        suggestions.append("Reduce sugar intake and monitor levels.")
        score += 1
        
    if heart_rate > 110:
        suggestions.append("Consult a doctor regarding elevated heart rate.")
        suggestions.append("Rest and avoid excessive caffeine.")
        score += 2
        
    if not suggestions:
        suggestions = ["Drink more water", "Exercise regularly", "Maintain a balanced diet"]
        
    # Confidence calculation based on clarity of symptoms
    confidence_raw = 75.0 + (score * 5.0)
    confidence = min(confidence_raw, 98.7) # Cap at 98.7%
    if risk == "Low":
        # high confidence if all metrics are well within safe bounds
        confidence = 95.5 if (bp < 110 and sugar < 120 and heart_rate < 90) else 88.5
        
    return risk, suggestions, confidence

@app.route('/ai-predict', methods=['POST'])
def predict_risk():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input data provided"}), 400
        
    try:
        bp = float(data.get('bp', 0))
        sugar = float(data.get('sugar', 0))
        heart_rate = float(data.get('heartRate', 0))
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid input format, expected numbers"}), 400
        
    risk, suggestions, confidence = calculate_risk(bp, sugar, heart_rate)
    
    return jsonify({
        "risk": risk,
        "suggestions": suggestions,
        "confidence": f"{confidence:.1f}%",
        "score": score_summary(risk)
    }), 200

def score_summary(risk):
    mapping = {
        "Low": 1,
        "Medium": 5,
        "High": 9
    }
    return mapping.get(risk, 0)

if __name__ == '__main__':
    # Ready to connect with backend, runs on port 8000 by default
    app.run(host='0.0.0.0', port=8000, debug=True)
