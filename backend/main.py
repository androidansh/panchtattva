from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from model import predict_watershed


app = FastAPI(
    title="Watershed Development API"
)


# =========================================
# ALLOW REACT TO CONNECT
# =========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================
# DEMO PATNA AREA DATA
# =========================================

areas = {

    "PATNA_RURAL_01": {

        "area_name": "Rural Patna - Area 1",

        "slope": 9,

        "rainfall": 1100,

        "ndvi": 0.25,

        "pond_count": 1,

        "water_bodies": 1,

        "existing_check_dams": 0

    },


    "PATNA_RURAL_02": {

        "area_name": "Rural Patna - Area 2",

        "slope": 5,

        "rainfall": 950,

        "ndvi": 0.52,

        "pond_count": 3,

        "water_bodies": 3,

        "existing_check_dams": 1

    },


    "PATNA_RURAL_03": {

        "area_name": "Rural Patna - Area 3",

        "slope": 12,

        "rainfall": 1150,

        "ndvi": 0.20,

        "pond_count": 0,

        "water_bodies": 0,

        "existing_check_dams": 0

    }

}


# =========================================
# HOME
# =========================================

@app.get("/")
def home():

    return {

        "message":
        "Watershed Development API is running"

    }


# =========================================
# AREA REQUEST
# =========================================

class AreaRequest(BaseModel):

    state: str

    district: str

    area_id: str


# =========================================
# ANALYZE AREA
# =========================================

@app.post("/analyze-area")
def analyze_area(data: AreaRequest):

    area = areas.get(
        data.area_id
    )


    if area is None:

        return {

            "error":
            "Area not found"

        }


    # -----------------------------
    # ML MODEL
    # -----------------------------

    prediction, probability = predict_watershed(

        area["slope"],

        area["rainfall"],

        area["ndvi"],

        area["pond_count"]

    )


    # -----------------------------
    # PROBLEMS
    # -----------------------------

    problems = []


    if area["ndvi"] < 0.35:

        problems.append(
            "Low vegetation cover"
        )


    if area["slope"] > 8:

        problems.append(
            "High runoff potential"
        )


    if area["pond_count"] <= 1:

        problems.append(
            "Limited water storage"
        )


    # -----------------------------
    # RECOMMENDATIONS
    # -----------------------------

    recommendations = []


    if prediction == "HIGH":

        recommendations = [

            "Construct check dam",

            "Develop farm pond",

            "Contour bunding",

            "Vegetation restoration"

        ]

    elif prediction == "MEDIUM":

        recommendations = [

            "Improve existing ponds",

            "Contour bunding",

            "Rainwater harvesting",

            "Vegetation improvement"

        ]

    else:

        recommendations = [

            "Continue monitoring",

            "Maintain existing water bodies",

            "Protect vegetation"

        ]


    # -----------------------------
    # FINAL RESPONSE
    # -----------------------------

    return {

        "state": data.state,

        "district": data.district,

        "area_id": data.area_id,

        "area_name":
        area["area_name"],

        "priority":
        prediction,

        "confidence":
        round(
            probability * 100,
            2
        ),

        "existing_facilities": {

            "ponds":
            area["pond_count"],

            "water_bodies":
            area["water_bodies"],

            "check_dams":
            area["existing_check_dams"]

        },

        "environment": {

            "slope":
            area["slope"],

            "rainfall":
            area["rainfall"],

            "ndvi":
            area["ndvi"]

        },

        "problems":
        problems,

        "recommendations":
        recommendations

    }