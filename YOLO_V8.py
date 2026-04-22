from ultralytics import YOLO
import cv2


model = YOLO("yolov8n.pt")

vehicle_classes = {
    2: "car",
    3: "motorbike",
    5: "bus",
    7: "truck"
}

def process_image(img):

    img = cv2.resize(img, (800, 600))


    results = model(img)


    counts = {
        "car": 0,
        "motorbike": 0,
        "bus": 0,
        "truck": 0
    }


    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            if cls in vehicle_classes:
                counts[vehicle_classes[cls]] += 1


    total_vehicles = sum(counts.values())


    if total_vehicles < 5:
        density = "LOW"
        green_time = (1.5*total_vehicles)
    elif total_vehicles < 15:
        density = "MEDIUM"
        green_time = (1.5*total_vehicles)
    else:
        density = "HIGH"
        green_time = (1.5*total_vehicles)




    annotated = results[0].plot()

    return annotated, counts, total_vehicles, density, green_time