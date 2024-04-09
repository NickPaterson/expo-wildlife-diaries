module.exports = {
  name: 'Wildlife Diaries',
  version: '1.0.0',
  extra: {
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    eas: {
      projectId: "dc0b4197-32b7-4dcd-845b-31688100bf5b",
    },
  },
  owner: "npgb",
  slug: "wildlife-diaries",
  scheme: "wildlife-diaries",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#FFFFFF"
    }
  },
  plugins: [
    "expo-barcode-scanner",
      ["expo-location", {
        "locationAlwaysAndWhenInUsePermission": "Allow Wildlife Diaries to use your location."
      }],
      ["expo-image-picker", {
        "photosPermission": "Wildlife Diaries accesses your photos to let you share them."
      }],
      ["expo-camera", {
        "cameraPermission": "Allow Wildlife Diaries to access your camera"
      }]
  ]
};