# Import the necessary libraries
import numpy as np          # For numerical array handling
import os                   # For file and directory operations
import pandas as pd         # For working with CSV and dataframes
import cv2                  # For image processing

# Define constants for image size and full-size dimensions
IMAGE_SIZE = (160, 160)     # Reduced size to avoid memory overflow
IMAGE_FULL_SIZE = (160, 160, 3)  # Includes color channels (RGB)

# Define paths — use raw strings (r"") to avoid escape character errors
TRAIN_FOLDER = r"C:\Users\panig\OneDrive\Desktop\pythonTest\train"
LABELS_CSV = r"C:\Users\panig\OneDrive\Desktop\pythonTest\labels.csv"

# Load the CSV file containing image IDs and dog breeds
df = pd.read_csv(LABELS_CSV)

# Display basic information and preview
print("Head of labels:")
print("================")
print(df.head())  # First few rows of the dataframe
print("\nDescribe:")
print(df.describe())  # Statistical summary
print("\n---")

# Group by breed and count how many images belong to each breed
groupables = df.groupby("breed")["id"].count()

# Display a few grouped results
print("Breed counts:")
print(groupables.head(50))

# Display one image to verify
imgPath = r"C:\Users\panig\OneDrive\Desktop\pythonTest\train\0ab8d4c80ae4e6bbeacd66fb7e52b851.jpg"
img = cv2.imread(imgPath)
# cv2.imshow("Test Image", img)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

# Prepare all the images and labels
allImages = []
allLabels = []

# Loop through each row in the DataFrame, process each image and label
for idx, (image, breed) in enumerate(df[['id', 'breed']].values):
    img_path = os.path.join(TRAIN_FOLDER, image + '.jpg')  # Construct full image path
    img = cv2.imread(img_path)  # Read the image from disk

    if img is None:
        print(f"Error loading image: {img_path}")
        continue

    resized = cv2.resize(img, IMAGE_SIZE, interpolation=cv2.INTER_AREA)  # Resize image
    allImages.append(resized)  # Append resized image to list
    allLabels.append(breed)  # Append label to the list

print(len(allImages))  # Print total number of images loaded
print(len(allLabels))  # Print total number of labels loaded

print("Saving the data...")
# Save smaller float16 arrays to reduce size
np.save(r"c:\Users\panig\OneDrive\Desktop\pythonTest\DogsImages.npy", np.array(allImages, dtype='float16'))
np.save(r"c:\Users\panig\OneDrive\Desktop\pythonTest\DogsLabels.npy", np.array(allLabels))

print("Data saved successfully.")
