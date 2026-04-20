import pandas as pd
import pickle

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

# ===============================
# 1. LOAD DATASET
# ===============================
df = pd.read_csv(r"D:\imp data\imp\sih_hack\Sih_mentalhealth\backend\General Mental Health Survey (Responses) - Form responses 1.csv")

print("Dataset shape:", df.shape)

# ===============================
# 2. RENAME COLUMNS (IMPORTANT)
# ===============================
df.columns = [
    "timestamp",
    "interest_loss","depressed","anxious","worry",
    "sleep_issue","low_energy","concentration",
    "overwhelmed","low_motivation","lonely",
    "stress","work_pressure",
    "sleep_hours","exercise_days","screen_time",
    "self_harm"
]

# ===============================
# 3. ENCODE CATEGORICAL VALUES
# ===============================
mapping = {
    "Not at all": 0,
    "Several days": 1,
    "More than half the days": 2,
    "Nearly every day": 3
}

cols = [
    "interest_loss","depressed","anxious","worry",
    "sleep_issue","low_energy","concentration",
    "overwhelmed","low_motivation","lonely"
]

for col in cols:
    df[col] = df[col].map(mapping)

# Self-harm encoding
df["self_harm"] = df["self_harm"].map({
    "No": 0,
    "Sometimes": 1,
    "Yes": 2
})

# ===============================
# 4. FEATURE ENGINEERING
# ===============================
df["mental_score"] = df[cols].sum(axis=1)
df["stress_score"] = df["stress"] + df["work_pressure"]

# ===============================
# 5. CREATE LABELS
# ===============================
def label(score):
    if score < 10:
        return 0
    elif score < 18:
        return 1
    elif score < 25:
        return 2
    else:
        return 3

df["label"] = df["mental_score"].apply(label)

# ===============================
# 6. SELECT FEATURES
# ===============================
X = df[[
    "mental_score",
    "stress_score",
    "sleep_hours",
    "exercise_days",
    "screen_time"
]]

y = df["label"]

# ===============================
# 7. TRAIN-TEST SPLIT
# ===============================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ===============================
# 8. TRAIN MODEL
# ===============================
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=5,
    random_state=42
)

model.fit(X_train, y_train)

# ===============================
# 9. TEST MODEL
# ===============================
y_pred = model.predict(X_test)

# ===============================
# 10. EVALUATION
# ===============================

# Accuracy
accuracy = accuracy_score(y_test, y_pred)
print("\n✅ Accuracy:", round(accuracy * 100, 2), "%")

# Classification report
print("\n📊 Classification Report:")
print(classification_report(y_test, y_pred))

# Confusion matrix
print("\n📉 Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# ===============================
# 11. SAVE MODEL
# ===============================
pickle.dump(model, open("model.pkl", "wb"))

print("\n✅ Model saved as model.pkl")