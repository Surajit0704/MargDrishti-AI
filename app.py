from flask import Flask, render_template, request
import cv2
import numpy as np
import base64
from ultralytics import YOLO
from YOLO_V8 import process_image

app = Flask(__name__)

# Load models
vehicle_model = YOLO("yolov8n.pt")
ambulance_model = YOLO("runs/detect/train4/weights/best.pt")


# Convert image to base64 for display
def encode_image(img):
    _, buffer = cv2.imencode('.jpg', img)
    return base64.b64encode(buffer).decode('utf-8')


# Process each lane
def process_lane(file):
    if file and file.filename != "":
        file.seek(0)  # 🔥 important fix

        file_bytes = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if img is None:
            return None, {}, 0, False, 0

        # Vehicle detection
        annotated, counts, total, _, _ = process_image(img)

        # Ambulance detection
        ambulance_results = ambulance_model(img)

        ambulance_detected = False
        max_conf = 0  # 🔥 track best confidence

        for r in ambulance_results:
            for box in r.boxes:
                conf = float(box.conf)

                # 🔥 stricter condition to avoid false positives
                if conf > 0.7:
                    ambulance_detected = True
                    max_conf = max(max_conf, conf)

        img_base64 = encode_image(annotated)

        return img_base64, counts, total, ambulance_detected, max_conf

    return None, {}, 0, False, 0


# Smart lane selection
def choose_lane(totals, ambulances, scores):

    # 🚑 Only consider strong ambulance detections
    strong_ambulances = [
        i for i in range(len(scores)) if scores[i] > 0.7
    ]

    if strong_ambulances:
        # Choose lane with highest confidence ambulance
        best_lane = max(strong_ambulances, key=lambda i: scores[i])
        return best_lane

    # 🚗 Otherwise choose highest traffic lane
    if any(totals):
        return totals.index(max(totals))

    return 0


@app.route("/", methods=["GET", "POST"])
def index():
    lanes = []
    totals = []
    ambulances = []
    ambulance_scores = []
    timer = 10

    if request.method == "POST":
        files = [
            request.files.get("lane1"),
            request.files.get("lane2"),
            request.files.get("lane3")
        ]

        for file in files:
            img, counts, total, amb, score = process_lane(file)

            lanes.append({
                "image": img,
                "counts": counts,
                "total": total,
                "ambulance": amb
            })

            totals.append(total)
            ambulances.append(amb)
            ambulance_scores.append(score)

        # 🔥 Correct decision logic
        active_lane = choose_lane(totals, ambulances, ambulance_scores)

        # Timer based on traffic
        timer = max(10, totals[active_lane] * 2)

        return render_template(
            "index.html",
            lanes=lanes,
            active_lane=active_lane,
            timer=timer
        )

    return render_template("index.html", lanes=None)


if __name__ == "__main__":
    app.run(debug=True)