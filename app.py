from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
import base64
from ultralytics import YOLO
from YOLO_V8 import process_image

app = Flask(__name__)

# Load models
vehicle_model = YOLO("yolov8n.pt")
ambulance_model = YOLO("runs/detect/train4/weights/best.pt")


# -------------------------------
# Utility: Encode image to base64
# -------------------------------
def encode_image(img):
    _, buffer = cv2.imencode('.jpg', img)
    return base64.b64encode(buffer).decode('utf-8')


# -------------------------------
# Process each lane
# -------------------------------
def process_lane(file):
    if file and file.filename != "":
        file.seek(0)

        file_bytes = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if img is None:
            return None, {}, 0, False, 0

        # Vehicle detection
        annotated, counts, total, _, _ = process_image(img)

        # Ambulance detection
        ambulance_results = ambulance_model(img)

        ambulance_detected = False
        max_conf = 0

        for r in ambulance_results:
            for box in r.boxes:
                conf = float(box.conf)
                if conf > 0.7:
                    ambulance_detected = True
                    max_conf = max(max_conf, conf)

        img_base64 = encode_image(annotated)

        return img_base64, counts, total, ambulance_detected, max_conf

    return None, {}, 0, False, 0


# -------------------------------
# Smart lane selection
# -------------------------------
def choose_lane(totals, scores):
    # Priority: Ambulance
    strong_ambulances = [i for i in range(len(scores)) if scores[i] > 0.7]

    if strong_ambulances:
        return max(strong_ambulances, key=lambda i: scores[i])

    # Otherwise highest traffic
    if any(totals):
        return totals.index(max(totals))

    return 0


# -------------------------------
# HOME PAGE
# -------------------------------
@app.route("/")
def index():
    return render_template("index.html")


# -------------------------------
# MAIN API (REAL PROCESSING)
# -------------------------------
@app.route("/process", methods=["POST"])
def process():

    files = [
        request.files.get("lane1"),
        request.files.get("lane2"),
        request.files.get("lane3")
    ]

    lanes = []
    totals = []
    ambulance_scores = []
    emergency_detected = False
    emergency_lane = None

    for i, file in enumerate(files):
        img, counts, total, amb, score = process_lane(file)

        lanes.append({
            "image": img,
            "counts": counts,
            "total": total,
            "ambulance": amb
        })

        totals.append(total)
        ambulance_scores.append(score)

        if amb and score > 0.7:
            emergency_detected = True
            emergency_lane = i

    # AI decision
    active_lane = choose_lane(totals, ambulance_scores)

    # Timer logic
    timer = max(10, totals[active_lane] * 2)

    # Density classification
    def get_density(val):
        if val < 5:
            return "Low"
        elif val < 15:
            return "Medium"
        else:
            return "High"

    density = {
        f"Lane {i+1}": get_density(totals[i])
        for i in range(len(totals))
    }

    counts_dict = {
        f"Lane {i+1}": totals[i]
        for i in range(len(totals))
    }

    signal_status = {
        f"Lane {i+1}": "Red"
        for i in range(len(totals))
    }

    signal_status[f"Lane {active_lane+1}"] = "Green"

    reason = "Ambulance Detected" if emergency_detected else "Highest Density"

    return jsonify({
        "lanes": lanes,
        "counts": counts_dict,
        "density": density,
        "signal_status": signal_status,
        "selected_lane": f"Lane {active_lane+1}",
        "emergency_detected": emergency_detected,
        "emergency_lane": f"Lane {emergency_lane+1}" if emergency_lane is not None else None,
        "reason": reason,
        "timer": timer
    })


# -------------------------------
# RUN
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)