from ultralytics import YOLO
import cv2

model = YOLO("runs/detect/train4/weights/best.pt")

img = cv2.imread(r"C:\Users\neetc\Downloads\WhatsApp Image 2026-03-29 at 8.09.59 PM.jpeg")

results = model(img)

output = results[0].plot()

cv2.imshow("Result", output)
cv2.waitKey(0)
cv2.destroyAllWindows()