from ultralytics import YOLO
import cv2

model = YOLO("runs/detect/train4/weights/best.pt")

img = cv2.imread(r"D:\PYTHON_TUTEDUDE\gettyimages-1235264888-612x612.jpg")

results = model(img)

output = results[0].plot()

cv2.imshow("Result", output)
cv2.waitKey(0)
cv2.destroyAllWindows()