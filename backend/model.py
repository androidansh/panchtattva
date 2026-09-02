from sklearn.ensemble import RandomForestClassifier
import pandas as pd


# -----------------------------
# DEMO TRAINING DATA
# -----------------------------

data = {
    "slope": [
        2, 3, 4, 5, 7,
        8, 9, 10, 12, 13,
        2, 3, 4, 6, 7,
        9, 11, 12, 14, 15
    ],

    "rainfall": [
        700, 750, 800, 850, 900,
        1000, 1050, 1100, 1150, 1200,
        720, 780, 820, 880, 920,
        1020, 1080, 1120, 1180, 1250
    ],

    "ndvi": [
        0.75, 0.70, 0.68, 0.65, 0.60,
        0.40, 0.35, 0.30, 0.25, 0.20,
        0.72, 0.67, 0.63, 0.58, 0.55,
        0.38, 0.32, 0.28, 0.22, 0.18
    ],

    "pond_count": [
        5, 5, 4, 4, 3,
        2, 2, 1, 1, 0,
        5, 4, 4, 3, 3,
        2, 2, 1, 1, 0
    ],

    "priority": [
        "LOW", "LOW", "LOW", "LOW", "LOW",
        "MEDIUM", "MEDIUM", "HIGH", "HIGH", "HIGH",
        "LOW", "LOW", "LOW", "LOW", "LOW",
        "MEDIUM", "MEDIUM", "HIGH", "HIGH", "HIGH"
    ]
}

df = pd.DataFrame(data)

X = df[
    [
        "slope",
        "rainfall",
        "ndvi",
        "pond_count"
    ]
]

y = df["priority"]


# -----------------------------
# TRAIN DEMO MODEL
# -----------------------------

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)


# -----------------------------
# PREDICT
# -----------------------------

def predict_watershed(
    slope,
    rainfall,
    ndvi,
    pond_count
):

    input_data = pd.DataFrame(
        [[
            slope,
            rainfall,
            ndvi,
            pond_count
        ]],
        columns=[
            "slope",
            "rainfall",
            "ndvi",
            "pond_count"
        ]
    )

    prediction = model.predict(
        input_data
    )[0]

    probability = max(
        model.predict_proba(
            input_data
        )[0]
    )

    return prediction, probability