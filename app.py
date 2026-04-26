import os
import cv2
import numpy as np
from flask import Flask, render_template, request, jsonify
from ultralytics import YOLO
import base64

app = Flask(__name__)

# =========================
# 📁 PATHS
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

vehicle_model_path = os.path.join(BASE_DIR, "yolov8n.pt")
ambulance_model_path = os.path.join(BASE_DIR, "runs", "detect", "train4", "weights", "best.pt")

print("\n===== MODEL CHECK =====")
print("Vehicle:", os.path.exists(vehicle_model_path))
print("Ambulance:", os.path.exists(ambulance_model_path))
print("=======================\n")

vehicle_model = YOLO(vehicle_model_path)
ambulance_model = YOLO(ambulance_model_path) if os.path.exists(ambulance_model_path) else None


# =========================
# 🚗 VEHICLE COUNT (FIXED)
# =========================
def count_vehicles(img):
    results = vehicle_model(img)[0]

    vehicle_classes = [2, 3, 5, 7]  # car, bike, bus, truck

    count = 0
    for box in results.boxes:
        cls = int(box.cls[0])
        if cls in vehicle_classes:
            count += 1

    return count


# =========================
# 📊 DENSITY
# =========================
def get_density(count):
    if count < 10:
        return "Low"
    elif count < 25:
        return "Medium"
    else:
        return "High"


# =========================
# 🖼 ENCODE IMAGE
# =========================
def encode_image(img):
    _, buffer = cv2.imencode('.jpg', img)
    return base64.b64encode(buffer).decode('utf-8')


# =========================
# 🏠 ROUTE
# =========================
@app.route("/")
def dashboard():
    return render_template("index.html")


# =========================
# 🚀 MAIN PROCESS
# =========================
@app.route("/process", methods=["POST"])
def process():

    # 🔥 RESET EACH REQUEST
    best_lane = None
    best_conf_global = 0

    files = [
        request.files.get("lane1"),
        request.files.get("lane2"),
        request.files.get("lane3")
    ]

    counts = {}
    density = {}
    signal_status = {}
    lanes_output = []

    # =========================
    # 🔍 PROCESS LANES
    # =========================
    for i, file in enumerate(files):

        img = cv2.imdecode(
            np.frombuffer(file.read(), np.uint8),
            cv2.IMREAD_COLOR
        )

        # 🚗 VEHICLE COUNT
        vehicle_count = count_vehicles(img)
        counts[f"Lane {i+1}"] = vehicle_count
        density[f"Lane {i+1}"] = get_density(vehicle_count)

        # 🚑 AMBULANCE DETECTION
        best_conf_this_lane = 0

        if ambulance_model:
            results = ambulance_model(img, conf=0.4)[0]

            for box in results.boxes:
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                label = ambulance_model.names[cls]

                x1, y1, x2, y2 = map(int, box.xyxy[0])
                area = (x2 - x1) * (y2 - y1)
                width = x2 - x1

                print(f"Lane {i+1} → Label: {label}, Conf: {conf:.2f}, Area: {area}")

                # ✅ STRICT FILTER (FINAL FIX)
                if (
                    label.lower() == "ambulance"
                    and conf > 0.7
                    and area > 12000
                    and width > 120
                ):
                    if conf > best_conf_this_lane:
                        best_conf_this_lane = conf

                    # draw box
                    cv2.rectangle(img, (x1, y1), (x2, y2), (0, 0, 255), 3)
                    cv2.putText(img, f"AMB {conf:.2f}", (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

        print(f"Lane {i+1} BEST CONF:", best_conf_this_lane)

        # 🔥 GLOBAL BEST LANE
        if best_conf_this_lane > best_conf_global:
            best_conf_global = best_conf_this_lane
            best_lane = f"Lane {i+1}"

        lanes_output.append({
            "image": encode_image(img)
        })

    # =========================
    # 🧠 FINAL DECISION
    # =========================
    if best_lane is not None and best_conf_global > 0.7:
        emergency_detected = True
        selected_lane = best_lane
        reason = "🚑 Emergency vehicle detected"
    else:
        emergency_detected = False
        selected_lane = max(counts, key=counts.get)
        reason = "Highest traffic density"

    # =========================
    # 🚦 SIGNAL LOGIC
    # =========================
    for lane in counts:
        signal_status[lane] = "Green" if lane == selected_lane else "Red"

    # =========================
    # ⏱ TIMER
    # =========================
    timer = int(max(10, min(counts[selected_lane] * 1.5, 60)))

    # =========================
    # 📦 RESPONSE
    # =========================
    return jsonify({
        "counts": counts,
        "density": density,
        "signal_status": signal_status,
        "selected_lane": selected_lane,
        "reason": reason,
        "lanes": lanes_output,
        "timer": timer,
        "emergency_detected": emergency_detected,
        "emergency_lane": selected_lane if emergency_detected else None
    })


# =========================
# ▶️ RUN
# =========================
if __name__ == "__main__":
    app.run(debug=True)