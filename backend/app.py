from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database import init_db
from auth import auth_bp
from predict import predict_bp
from emailer import init_mail, send_prediction_email  # ✅ import both

app = Flask(__name__)
CORS(app)
CORS(app, supports_credentials=True)

# ✅ Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Shubham%404451@localhost/heart_prediction'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = '555683d197343d457881c3ebd5d835b30ae8ee441126df175e63a5ae2df0fac0'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'shubhampandey050705@gmail.com'
app.config['MAIL_PASSWORD'] = 'pdugrpubethjkzch'
app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']

# ✅ Init extensions
jwt = JWTManager(app)
init_db(app)
init_mail(app)

# ✅ Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(predict_bp, url_prefix='/api/predict')

# ✅ Root test route
@app.route('/')
def home():
    return "✅ Heart Disease Prediction Backend is running!"

# ✅ 📧 Add test-email route
@app.route('/test-email')
def test_email():
    from database import User
    user = User.query.first()
    if not user:
        return "❌ No user in database"
    try:
        send_prediction_email(
            recipient_email=user.email,
            result='Positive',
            user=user
        )
        return "✅ Test email sent!"
    except Exception as e:
        return f"❌ Error: {str(e)}"

# ✅ 🔥 Global 422 error handler
@app.errorhandler(422)
def handle_422(err):
    print("🔴 Caught 422 Error:")
    print("▶️ request.endpoint:", request.endpoint)
    print("▶️ request.path:", request.path)
    print("▶️ form:", request.form)
    print("▶️ files:", request.files)
    print("▶️ Error Description:", err.description)
    return jsonify({
        "error": "Unprocessable Entity",
        "detail": str(err.description)
    }), 422

# ✅ Run server
if __name__ == '__main__':
    app.run(debug=True)
