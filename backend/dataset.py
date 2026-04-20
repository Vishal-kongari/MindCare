import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# ===============================
# 1. LOAD ORIGINAL DATASET
# ===============================
df = pd.read_csv(r"D:\imp data\imp\sih_hack\Sih_mentalhealth\backend\General Mental Health Survey (Responses) - Form responses 1.csv")

print("Original dataset shape:", df.shape)

# ===============================
# 2. DEFINE OPTIONS
# ===============================
mental_options = [
    "Not at all",
    "Several days",
    "More than half the days",
    "Nearly every day"
]

self_harm_options = ["No", "Sometimes", "Yes"]

# ===============================
# 3. GENERATE REALISTIC ROW
# ===============================
def generate_row(df_columns):
    row = {}

    # Timestamp
    start_date = datetime(2026, 3, 1)
    row[df_columns[0]] = start_date + timedelta(minutes=random.randint(0, 100000))

    # Weighted mental responses
    def weighted_choice():
        return random.choices(
            mental_options,
            weights=[0.3, 0.4, 0.2, 0.1]
        )[0]

    # Mental health questions
    for col in df_columns[1:11]:
        row[col] = weighted_choice()

    # Stress & pressure
    row[df_columns[11]] = random.randint(1, 10)
    row[df_columns[12]] = random.randint(1, 10)

    # Sleep hours (normal distribution)
    row[df_columns[13]] = int(np.clip(np.random.normal(7, 1.5), 1, 10))

    # Exercise days
    row[df_columns[14]] = random.randint(0, 7)

    # Screen time (biased higher)
    row[df_columns[15]] = int(np.clip(np.random.normal(6, 2), 1, 10))

    # Self-harm (rare)
    row[df_columns[16]] = random.choices(
        self_harm_options,
        weights=[0.85, 0.1, 0.05]
    )[0]

    return row

# ===============================
# 4. GENERATE NORMAL DATA
# ===============================
new_data = [generate_row(df.columns) for _ in range(300)]

# ===============================
# 5. ADD SEVERE CASES (IMPORTANT)
# ===============================
for _ in range(50):
    row = generate_row(df.columns)

    # Extreme mental condition
    for col in df.columns[1:11]:
        row[col] = "Nearly every day"

    row[df.columns[11]] = random.randint(8, 10)  # stress high
    row[df.columns[12]] = random.randint(8, 10)  # pressure high
    row[df.columns[13]] = random.randint(2, 5)   # poor sleep
    row[df.columns[14]] = random.randint(0, 1)   # low exercise
    row[df.columns[15]] = random.randint(8, 10)  # high screen time
    row[df.columns[16]] = random.choice(["Sometimes", "Yes"])

    new_data.append(row)

# ===============================
# 6. CREATE DATAFRAME
# ===============================
df_new = pd.DataFrame(new_data)

print("Generated dataset shape:", df_new.shape)

# ===============================
# 7. MERGE DATA
# ===============================
df_final = pd.concat([df, df_new], ignore_index=True)

# ===============================
# 8. CLEAN DATA (FIXED VERSION ✅)
# ===============================

# Define columns
categorical_cols = df.columns[1:11].tolist() + [df.columns[16]]
numeric_cols = df.columns[11:16].tolist()

# Fill categorical columns
for col in categorical_cols:
    df_final[col] = df_final[col].fillna("Several days")

# Convert numeric columns properly
for col in numeric_cols:
    df_final[col] = pd.to_numeric(df_final[col], errors="coerce")

# Fill numeric columns with median
for col in numeric_cols:
    df_final[col] = df_final[col].fillna(df_final[col].median())

# ===============================
# 9. SHUFFLE DATA
# ===============================
df_final = df_final.sample(frac=1).reset_index(drop=True)

# ===============================
# 10. SAVE DATASET
# ===============================
df_final.to_csv("augmented_dataset.csv", index=False)

print("✅ Final dataset shape:", df_final.shape)
print("✅ Dataset saved as: augmented_dataset.csv")