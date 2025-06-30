import traceback
import os
import uuid
import numpy as np
import joblib

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from firebase_config import bucket
from database import db, Prediction, User
from emailer import send_prediction_email

predict_bp = Blueprint('predict', __name__)
model = joblib.load("models/heart_model.pkl")
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@predict_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    try:
        user_id = get_jwt_identity()

        # 🟡 SUPER DETAILED DEBUGGING
        print("🟡 JWT User ID:", user_id)
        print("🟡 FORM FIELDS RECEIVED:")
        for key in request.form:
            print(f"   - {key}: {request.form[key]}")
        print("🟡 FILES RECEIVED:")
        for key in request.files:
            print(f"   - {key}: {request.files[key].filename}")

        # ✅ Extract and validate form data
        required_fields = [
            "age", "sex", "cp", "trestbps", "chol", "fbs",
            "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
        ]

        data = request.form
        for field in required_fields:
            if field not in data:
                print(f"❌ Missing field: {field}")
                return jsonify({"error": f"Missing required field: {field}"}), 422

        try:
            features = [
                int(data["age"]),
                int(data["sex"]),
                int(data["cp"]),
                int(data["trestbps"]),
                int(data["chol"]),
                int(data["fbs"]),
                int(data["restecg"]),
                int(data["thalach"]),
                int(data["exang"]),
                float(data["oldpeak"]),
                int(data["slope"]),
                int(data["ca"]),
                int(data["thal"]),
            ]
        except Exception as parse_error:
            print("❌ Data parsing error:", str(parse_error))
            return jsonify({"error": f"Invalid field type: {str(parse_error)}"}), 422

        # ✅ Optional ECG image upload
        ecg_file = request.files.get("ecg_image")
        ecg_url = None
        if ecg_file:
            print("🟢 ECG image detected:", ecg_file.filename)
            if allowed_file(ecg_file.filename):
                filename = secure_filename(ecg_file.filename)
                blob = bucket.blob(f"ecg_reports/{uuid.uuid4().hex}_{filename}")
                blob.upload_from_file(ecg_file, content_type=ecg_file.content_type)
                blob.make_public()
                ecg_url = blob.public_url
                print("✅ ECG uploaded to Firebase:", ecg_url)
            else:
                print("⚠️ Unsupported ECG image type:", ecg_file.filename)

        # ✅ Model prediction
        input_array = np.array([features])
        prediction = model.predict(input_array)[0]
        result = "Positive" if prediction == 1 else "Negative"
        print("✅ Prediction complete:", result)

        # ✅ Save to database
        new_prediction = Prediction(
            user_id=user_id,
            age=features[0], sex=features[1], cp=features[2],
            trestbps=features[3], chol=features[4], fbs=features[5],
            restecg=features[6], thalach=features[7], exang=features[8],
            oldpeak=features[9], slope=features[10], ca=features[11],
            thal=features[12], ecg_image_path=ecg_url, prediction_result=result
        )
        db.session.add(new_prediction)
        db.session.commit()
        print("✅ Prediction saved to DB.")

        # ✅ Send email
        user = User.query.get(user_id)
        if user and user.email:
            send_prediction_email(user.email, result, user)
            print("✅ Email sent to", user.email)

        return jsonify({"result": result, "ecg_image_url": ecg_url}), 200

    except Exception as e:
        print("❌ UNCAUGHT EXCEPTION in /predict:")
        traceback.print_exc()
        return jsonify({"error": "Internal server error", "detail": str(e)}), 500
