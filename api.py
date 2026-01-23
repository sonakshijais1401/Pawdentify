from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
import cv2
import json
from pathlib import Path
import base64
import tensorflow as tf

app = FastAPI(title="Pawdentify API")

# --- CORS setup: allow your React frontend ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Paths ---
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "mobilenetv2-dog-breed-model.h5"
LABELS_PATH = BASE_DIR / "DogsLabels.npy"
BREED_INFO_PATH = BASE_DIR / "breed_info.json"

# --- Load model ---
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
model = tf.keras.models.load_model(str(MODEL_PATH))

# --- Load labels ---
if not LABELS_PATH.exists():
    raise FileNotFoundError(f"Labels file not found at {LABELS_PATH}")
allLabels = np.load(str(LABELS_PATH))
categories = np.unique(allLabels)

# --- Load breed info JSON ---
if not BREED_INFO_PATH.exists():
    raise FileNotFoundError(f"Breed info JSON not found at {BREED_INFO_PATH}")
with open(BREED_INFO_PATH, "r", encoding="utf-8") as f:
    breed_info = json.load(f)

# --- Preprocessing ---
INPUT_SHAPE = (160, 160)

def prepare_image_cv2(bgr_image: np.ndarray):
    resized = cv2.resize(bgr_image, INPUT_SHAPE, interpolation=cv2.INTER_AREA)
    imgResult = np.expand_dims(resized, axis=0)
    imgResult = imgResult / 255.0
    return imgResult

def img_to_dataurl(bgr_image: np.ndarray) -> str:
    success, encoded = cv2.imencode('.jpg', bgr_image)
    if not success:
        return None
    b64 = base64.b64encode(encoded.tobytes()).decode('ascii')
    return f"data:image/jpeg;base64,{b64}"

# --- Prediction endpoint ---
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file")

    # Convert to OpenCV image
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Could not decode image")

    # Convert image to base64 for frontend
    data_url = img_to_dataurl(img)

    try:
        # Preprocess and predict
        imageForModel = prepare_image_cv2(img)
        resultArray = model.predict(imageForModel)

        # Predicted class and confidence
        answers = np.argmax(resultArray, axis=1)
        predicted_breed = categories[int(answers[0])]
        confidence = float(np.max(resultArray) * 100)

        # Top 3 predictions
        top3_indices = np.argsort(resultArray[0])[-3:][::-1]
        top3 = [
            {"breed": str(categories[int(idx)]), "confidence": round(float(resultArray[0][int(idx)] * 100), 2)}
            for idx in top3_indices
        ]

        # Breed info
        info_dict = breed_info.get(predicted_breed, {})
        nature = info_dict.get("nature", "Not available")
        diet = info_dict.get("food_diet", "Not available")
        healthcare = info_dict.get("health_care", "Not available")

        return {
            "predicted_breed": str(predicted_breed),
            "confidence": round(confidence, 2),
            "top3": top3,
            "info": {"nature": nature, "diet": diet, "healthcare_tips": healthcare},
            "image": data_url,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
