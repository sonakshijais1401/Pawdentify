import numpy as np

IMAGE_SIZE = (160, 160, 3)
batch_size = 8

# Load preprocessed data
allImages = np.load(r"c:\Users\panig\OneDrive\Desktop\pythonTest\DogsImages.npy")
allLabels = np.load(r"c:\Users\panig\OneDrive\Desktop\pythonTest\DogsLabels.npy")

print(allImages.shape)
print(allLabels.shape)

# Convert text labels to integers
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
integerLabels = le.fit_transform(allLabels)
print(integerLabels)

# Count unique categories
numOfCategories = len(np.unique(integerLabels))
print("Number of categories:", numOfCategories)

# Convert integer labels to categorical
from tensorflow.keras.utils import to_categorical
allLabelsCategorical = to_categorical(integerLabels, num_classes=numOfCategories)

# Normalize images (0–1 range)
allImages = allImages.astype('float16') / 255.0

# Split train/test sets
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    allImages, allLabelsCategorical, test_size=0.3, random_state=42
)

print(X_train.shape, X_test.shape)
print(y_train.shape, y_test.shape)

# Free some memory
del allImages
del allLabels
del integerLabels
del allLabelsCategorical

# ✅ Use MobileNetV2 (much faster than NASNetLarge)
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, Flatten, GlobalAveragePooling2D
from tensorflow.keras.models import Model

baseModel = MobileNetV2(input_shape=IMAGE_SIZE, weights='imagenet', include_top=False)

# Freeze pretrained layers
for layer in baseModel.layers:
    layer.trainable = False

# Add custom layers
x = GlobalAveragePooling2D()(baseModel.output)
x = Dense(256, activation='relu')(x)
predictions = Dense(numOfCategories, activation='softmax')(x)

Model = Model(inputs=baseModel.input, outputs=predictions)

# Compile model
from tensorflow.keras.optimizers import Adam
lr = 1e-4
opt = Adam(learning_rate=lr)

Model.compile(
    loss='categorical_crossentropy',
    optimizer=opt,
    metrics=['accuracy']
)

stepsPerEpoch = int(np.ceil(len(X_train) / batch_size))
validationSteps = int(np.ceil(len(X_test) / batch_size))

# Callbacks
from keras.callbacks import ModelCheckpoint, ReduceLROnPlateau, EarlyStopping

best_model_file = r"c:\Users\panig\OneDrive\Desktop\pythonTest\mobilenetv2-dog-breed-model.h5"

checkpoint = [
    ModelCheckpoint(best_model_file, verbose=1, save_best_only=True),
    ReduceLROnPlateau(monitor='val_loss', factor=0.1, patience=3, verbose=1, min_lr=1e-6),
    EarlyStopping(monitor='val_loss', patience=7, verbose=1)
]

# Train the model
r = Model.fit(
    X_train,
    y_train,
    validation_data=(X_test, y_test),
    epochs=20,  # You can increase later if accuracy is good
    batch_size=batch_size,
    steps_per_epoch=stepsPerEpoch,
    validation_steps=validationSteps,
    callbacks=checkpoint
)
