from ultralytics import YOLO
import cv2

# ==========================================
# LOAD MODEL
# ==========================================

model = YOLO("yolov8n.pt")

# ==========================================
# VEHICLE CLASSES
# ==========================================

vehicle_classes = {
    2: "car",
    3: "motorbike",
    5: "bus",
    7: "truck"
}

# ==========================================
# PROCESS IMAGE
# ==========================================

def process_image(img):
    print("✅ NEW YOLO FILE RUNNING")
    # Resize while preserving color
    img = cv2.resize(img, (800, 600))

    # Create clean copy for annotation
    annotated = img.copy()

    # Run YOLO
    results = model(img)

    # Vehicle counts
    counts = {
        "car": 0,
        "motorbike": 0,
        "bus": 0,
        "truck": 0
    }

    # ==========================================
    # DETECTION LOOP
    # ==========================================

    for r in results:

        for box in r.boxes:

            cls = int(box.cls[0])
            conf = float(box.conf[0])

            if cls in vehicle_classes:

                vehicle_name = vehicle_classes[cls]

                counts[vehicle_name] += 1

                # Bounding box coordinates
                x1, y1, x2, y2 = map(int, box.xyxy[0])

                # ==========================================
                # COLOR CODING
                # ==========================================

                if vehicle_name == "car":
                    color = (255, 200, 0)

                elif vehicle_name == "motorbike":
                    color = (0, 255, 255)

                elif vehicle_name == "bus":
                    color = (0, 255, 0)

                else:
                    color = (0, 140, 255)

                # ==========================================
                # DRAW BOX
                # ==========================================

                cv2.rectangle(
                    annotated,
                    (x1, y1),
                    (x2, y2),
                    color,
                    2
                )

                # Label
                label = f"{vehicle_name} {conf:.2f}"

                cv2.putText(
                    annotated,
                    label,
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    color,
                    2
                )

    # ==========================================
    # TOTAL VEHICLES
    # ==========================================

    total_vehicles = sum(counts.values())

    # ==========================================
    # DENSITY CLASSIFICATION
    # ==========================================

    if total_vehicles < 5:

        density = "LOW"

        green_time = int(1.5 * total_vehicles)

    elif total_vehicles < 15:

        density = "MEDIUM"

        green_time = int(1.5 * total_vehicles)

    else:

        density = "HIGH"

        green_time = int(1.5 * total_vehicles)

    # ==========================================
    # RETURN COLOR IMAGE
    # ==========================================

    return (
        annotated,
        counts,
        total_vehicles,
        density,
        green_time
    )
