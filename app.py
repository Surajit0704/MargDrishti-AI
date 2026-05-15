from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
import base64
import os
import random

from ultralytics import YOLO
from YOLO_V8 import process_image

app = Flask(__name__)

# ==========================================
# LOAD MODELS
# ==========================================

vehicle_model = YOLO("yolov8n.pt")
ambulance_model = YOLO("runs/detect/train4/weights/best.pt")


# ==========================================
# DATASET PATHS
# ==========================================

DATASET_PATHS = {
    "lane_1": "dataset/lane_1",
    "lane_2": "dataset/lane_2",
    "lane_3": "dataset/lane_3"
}


# ==========================================
# WEBCAM INTEGRATION (LANE 4)
# ==========================================
import threading
import time

# Initialize variables
camera = None
camera_started = False

def start_webcam_thread():
    global camera
    
    # Use DirectShow (cv2.CAP_DSHOW) backend which is the most stable for Windows
    # and prevents the MSMF "can't grab frame" warning.
    camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    
    def capture_webcam():
        """Continuously captures frames from webcam and saves them optimally."""
        # Ensure the static directory exists
        os.makedirs("static", exist_ok=True)
        last_save_time = time.time()
        
        while True:
            if camera and camera.isOpened():
                success, frame = camera.read()
                if success:
                    current_time = time.time()
                    # Process and save the frame every 1.5 seconds to reduce CPU & disk I/O
                    if current_time - last_save_time >= 1.5:
                        try:
                            cv2.imwrite("static/live_lane.jpg", frame)
                        except Exception as e:
                            print(f"Error saving webcam frame: {e}")
                        last_save_time = current_time
                        
            # Sleep slightly to flush buffer without hogging the CPU core
            time.sleep(0.03)

    # Start the background thread for webcam capture
    webcam_thread = threading.Thread(target=capture_webcam, daemon=True)
    webcam_thread.start()

@app.before_request
def initialize_camera_once():
    """
    Starts the webcam thread only on the very first HTTP request.
    This safely prevents Flask's debug mode from opening the camera twice!
    """
    global camera_started
    if not camera_started:
        start_webcam_thread()
        camera_started = True


# ==========================================
# PRIORITY OVERRIDE STATE
# ==========================================

manual_override = False
override_lane = None
override_reason = None
lane_3_first_run = True

# ==========================================
# GLOBAL TRAFFIC STATE CACHE
# ==========================================
GLOBAL_TRAFFIC_STATE = {
    "counts": {},
    "density": {},
    "signal_status": {},
    "selected_lane": None,
    "emergency_detected": False,
    "emergency_lane": None,
    "reason": "Initializing...",
    "timer": 0,
    "manual_override": False,
    "override_lane": None,
    "override_reason": None
}


# ==========================================
# ENCODE IMAGE
# ==========================================

def encode_image(img):

    _, buffer = cv2.imencode('.jpg', img)

    return base64.b64encode(buffer).decode('utf-8')


# ==========================================
# RANDOM IMAGE PICKER
# ==========================================

def get_random_image(folder_path):

    try:

        valid_extensions = (
            ".jpg",
            ".jpeg",
            ".png"
        )

        files = [

            f for f in os.listdir(folder_path)

            if f.lower().endswith(valid_extensions)

        ]

        if not files:

            print(f"❌ No images found in {folder_path}")

            return None

        selected_file = random.choice(files)

        full_path = os.path.join(
            folder_path,
            selected_file
        )

        print(f"📷 Selected: {full_path}")

        return full_path

    except Exception as e:

        print("❌ Dataset error:", e)

        return None


# ==========================================
# PROCESS IMAGE PATH
# ==========================================

def process_lane_image(image_path):

    if image_path is None:

        return None, {}, 0, False, 0

    img = cv2.imread(image_path)

    if img is None:

        return None, {}, 0, False, 0

    # ==========================================
    # VEHICLE DETECTION
    # ==========================================

    annotated, counts, total, _, _ = process_image(img)

    # ==========================================
    # AMBULANCE DETECTION
    # ==========================================

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

    return (
        img_base64,
        counts,
        total,
        ambulance_detected,
        max_conf
    )


# ==========================================
# SMART AI LANE SELECTION
# ==========================================

def choose_lane(totals, scores):

    # PRIORITY: AMBULANCE

    strong_ambulances = [

        i for i in range(len(scores))

        if scores[i] > 0.7

    ]

    if strong_ambulances:

        return max(
            strong_ambulances,
            key=lambda i: scores[i]
        )

    # OTHERWISE HIGHEST TRAFFIC

    if any(totals):

        return totals.index(max(totals))

    return 0


# ==========================================
# BOOT/LOADING PAGE
# ==========================================

@app.route("/")
@app.route("/boot")
def boot():

    return render_template(
        "loading.html",
        page="boot"
    )


# ==========================================
# DASHBOARD PAGE
# ==========================================

@app.route("/dashboard")
def dashboard():

    return render_template(
        "dashboard_test.html",
        page="dashboard"
    )


# ==========================================
# OVERRIDE PAGE
# ==========================================

@app.route("/override")
def override():

    return render_template(
        "override_new.html",
        page="override"
    )


# ==========================================
# CITY MAP PAGE
# ==========================================

@app.route("/city-map")
def city_map():

    return render_template(
        "city_map.html",
        page="city_map"
    )


# ==========================================
# CITY MAP DATA API
# ==========================================

@app.route("/city-map-data")
def city_map_data():
    # Return cached state (excluding heavy images)
    return jsonify(GLOBAL_TRAFFIC_STATE)


# ==========================================
# MONITOR PAGE
# ==========================================

@app.route("/monitor")
def monitor():

    return render_template(
        "monitor.html",
        page="monitor"
    )


# ==========================================
# SIGNAL PAGE
# ==========================================

@app.route("/signals")
def signals():

    return render_template(
        "signals.html",
        page="signals"
    )


# ==========================================
# LOGS PAGE
# ==========================================

@app.route("/logs")
def logs():

    return render_template(
        "logs.html",
        page="logs"
    )


# ==========================================
# SETTINGS PAGE
# ==========================================

@app.route("/settings")
def settings():

    return render_template(
        "settings.html",
        page="settings"
    )


# ==========================================
# ACTIVATE OVERRIDE
# ==========================================

@app.route("/activate_override", methods=["POST"])
def activate_override():

    global manual_override
    global override_lane
    global override_reason

    data = request.json

    lane = data.get("lane")

    reason = data.get(
        "reason",
        "Manual Override"
    )

    if lane is None:

        return jsonify({

            "success": False,
            "message": "No lane selected"

        })

    manual_override = True

    override_lane = int(lane)

    override_reason = reason

    return jsonify({

        "success": True,
        "override_active": True,
        "lane": override_lane,
        "reason": override_reason

    })


# ==========================================
# DISABLE OVERRIDE
# ==========================================

@app.route("/disable_override", methods=["POST"])
def disable_override():

    global manual_override
    global override_lane
    global override_reason

    manual_override = False

    override_lane = None

    override_reason = None

    return jsonify({

        "success": True,
        "override_active": False

    })


# ==========================================
# OVERRIDE STATUS
# ==========================================

@app.route("/override_status")
def override_status():

    return jsonify({

        "manual_override": manual_override,
        "override_lane": override_lane,
        "override_reason": override_reason

    })


# ==========================================
# MAIN PROCESSING API
# ==========================================

@app.route("/process", methods=["POST"])
def process():

    global manual_override
    global override_lane
    global override_reason
    global lane_3_first_run

    # ==========================================
    # RANDOM IMAGE SELECTION
    # ==========================================

    lane_1_path = get_random_image(DATASET_PATHS["lane_1"])
    lane_2_path = get_random_image(DATASET_PATHS["lane_2"])

    if lane_3_first_run:
        lane_3_path = os.path.join(DATASET_PATHS["lane_3"], "medium_1.jpeg")
        if not os.path.exists(lane_3_path):
            lane_3_path = get_random_image(DATASET_PATHS["lane_3"])
        lane_3_first_run = False
    else:
        lane_3_path = get_random_image(DATASET_PATHS["lane_3"])

    # Define the path for the live webcam lane
    lane_4_path = "static/live_lane.jpg" if os.path.exists("static/live_lane.jpg") else None

    lane_paths = [
        lane_1_path,
        lane_2_path,
        lane_3_path,
        lane_4_path
    ]

    lanes = []

    totals = []

    ambulance_scores = []

    emergency_detected = False

    emergency_lane = None

    # ==========================================
    # PROCESS ALL LANES
    # ==========================================

    for i, path in enumerate(lane_paths):

        (
            img,
            counts,
            total,
            amb,
            score

        ) = process_lane_image(path)

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

    # ==========================================
    # PRIORITY OVERRIDE LOGIC
    # ==========================================

    if manual_override and override_lane is not None:

        active_lane = override_lane

        reason = (
            f"Priority Override - "
            f"Lane {override_lane + 1}"
        )

        timer = 9999

    else:

        active_lane = choose_lane(
            totals,
            ambulance_scores
        )

        reason = (

            "Ambulance Detected"

            if emergency_detected

            else "Highest Density"

        )

        timer = max(
            10,
            totals[active_lane] * 2
        )

    # ==========================================
    # DENSITY CLASSIFICATION
    # ==========================================

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

    # ==========================================
    # SIGNAL STATUS
    # ==========================================

    signal_status = {

        f"Lane {i+1}": "Red"

        for i in range(len(totals))

    }

    signal_status[
        f"Lane {active_lane+1}"
    ] = "Green"

    # ==========================================
    # FINAL RESPONSE & CACHE UPDATE
    # ==========================================
    
    global GLOBAL_TRAFFIC_STATE
    
    GLOBAL_TRAFFIC_STATE = {
        "counts": counts_dict,
        "density": density,
        "signal_status": signal_status,
        "selected_lane": f"Lane {active_lane+1}",
        "emergency_detected": emergency_detected,
        "emergency_lane": f"Lane {emergency_lane+1}" if emergency_lane is not None else None,
        "reason": reason,
        "timer": timer,
        "manual_override": manual_override,
        "override_lane": override_lane,
        "override_reason": override_reason
    }

    response_data = dict(GLOBAL_TRAFFIC_STATE)
    response_data["lanes"] = lanes # Add heavy images ONLY for dashboard response

    return jsonify(response_data)


# ==========================================
# MANUAL REFRESH API
# ==========================================

@app.route("/manual_refresh")
def manual_refresh():
    print("DEBUG: manual_refresh called in app.py")
    return process()


@app.route("/test-ui")
def test_ui():
    return render_template("dashboard_test.html")
# ==========================================
# RUN APP
# ==========================================

if __name__ == "__main__":

    app.run(debug=True)