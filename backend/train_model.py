import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib
import os

# ✅ Load your dataset
df = pd.read_csv(r"data/heart.csv")

# ✅ Rename columns to match backend & model expectations
df.columns = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
    'restecg', 'thalach', 'exang', 'oldpeak',
    'slope', 'ca', 'thal', 'target'
]

# ✅ Encode categorical features
categorical_cols = ['cp', 'restecg', 'exang', 'slope', 'thal']
encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le  # Save encoder if needed later

# ✅ Features and label
X = df.drop('target', axis=1)
y = df['target']

# ✅ Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ✅ Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ✅ Evaluate
accuracy = accuracy_score(y_test, model.predict(X_test))
print(f"✅ Model trained with accuracy: {accuracy:.2f}")

# ✅ Save model
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/heart_model.pkl")
print("✅ Model saved to models/heart_model.pkl")
