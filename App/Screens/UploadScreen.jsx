import { View, Text, StyleSheet, Button, Image, TouchableOpacity, ImageBackground, ScrollView } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { TextInput, ActivityIndicator, Snackbar, Checkbox } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Colours from '../Utils/Colours';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faImage, faFeatherPointed } from '@fortawesome/pro-solid-svg-icons';
import { useNotes } from '../Context/UserNotesContext';
import { UserLocationContext } from '../Context/UserLocationContext';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useUser, useAuth } from '@clerk/clerk-expo';

export default function UploadsScreen() {
  const { userId } = useAuth();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: {
      latitude: location?.latitude,
      longitude: location?.longitude,
    }
  });
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const { addNote } = useNotes();
  const { location } = useContext(UserLocationContext);

  const [markerLocation, setMarkerLocation] = useState({
    latitude: location?.latitude,
    longitude: location?.longitude,
  });

  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const displaySnackbar = (message) => {
    setSnackBarMessage(message);
    setSnackBarVisible(true);
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
    setIsLoading(false);
  };

  const takeImage = async () => {
    // No permissions request is necessary for launching the image library
    setIsLoading(true);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    console.log("Submitting form");
    if (!formData.title || !formData.description) {
      setError('Please fill in all fields');
      alert('Please fill in all fields');
      return;
    }
    const note = {
      id: Date.now(),
      user_id: userId,
      username: user.username,
      title: formData.title,
      description: formData.description,
      image: image,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      latitude: markerLocation.latitude,
      longitude: markerLocation.longitude,
    };

    addNote(note);
    displaySnackbar('Note added');
    setFormData({
      title: '',
      description: '',
      image: '',
      location: {
        latitude: location?.latitude,
        longitude: location?.longitude,
      },
    });
    setImage(null);


  }

  return (
    <>
      <ScrollView>
        <ImageBackground source={require('./../../assets/images/wildlife-app-bg.png')} style={styles.backgroundImage}>

          <View style={styles.formContainer}>
            <View style={styles.imageUploadBtns}>
              <TouchableOpacity onPress={pickImage} style={styles.imageUploadBtn}>
                <FontAwesomeIcon icon={faImage} size={30} style={styles.icon} />
                <Text style={styles.text}>Pick an image</Text>

                {error && <Text style={styles.error}>{error}</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={takeImage} style={styles.imageUploadBtn}>
                <FontAwesomeIcon icon={faCamera} size={30} style={styles.icon} />
                <Text style={styles.text}>Take a picture</Text>
                {error && <Text style={styles.error}>{error}</Text>}
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color={Colours.PRIMARY} />
            ) : (
              image && (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: image }} style={styles.imagePreview} resizeMode="contain" />
                </View>
              )
            )}

            {error && <Text style={styles.error}>{error}</Text>}



            <TextInput
              label="Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              mode="outlined"
              style={styles.input}
              outlineColor={Colours.DARK}
              activeOutlineColor={Colours.DARK}
            />
            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              mode="outlined"
              style={styles.input}
              outlineColor={Colours.DARK}
              activeOutlineColor={Colours.DARK}
              multiline={true}
              numberOfLines={4}
            />

            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: location?.latitude,
                longitude: location?.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}

            >
              <Marker
                draggable
                coordinate={{
                  latitude: markerLocation?.latitude,
                  longitude: markerLocation?.longitude,
                }}
                onDragEnd={(e) => {
                  setMarkerLocation({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                  });
                  setFormData({
                    ...formData,
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                  });
                }}
              >
                <FontAwesomeIcon icon={faFeatherPointed} size={30} style={styles.marker} />

              </Marker>
            </MapView>

            <TouchableOpacity
              style={styles.button}
              onPress={() => { handleSubmit() }}
            >
              <Text>Upload</Text>
            </TouchableOpacity>
          </View>

        </ImageBackground>
      </ScrollView>
      <Snackbar
        visible={snackBarVisible}
        onDismiss={() => setSnackBarVisible(false)}
        duration={5000}
        style={styles.snackbar}
        action={{
          label: 'X',
        }}
      >
        {snackBarMessage}
      </Snackbar>
    </>
  )
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    width: '90%',
    gap: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',

  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: Colours.LIGHT,
    borderRadius: 10,


  },
  imageUploadBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '100%',
    gap: 32,
  },
  imageUploadBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '100%',
    height: 100,
    backgroundColor: Colours.LIGHT,
    borderWidth: 1,
    borderColor: Colours.DARK,
    padding: 12,
  },
  icon: {
    color: Colours.DARK,
  },
  button: {
    backgroundColor: Colours.PRIMARY,
    color: Colours.DARK,
    display: 'flex',
    borderRadius: 99,
    width: '100%',
    padding: 15,
    alignItems: 'center',
    marginTop: 40,

  },
  imagePreviewContainer: {
    width: '100%',
    height: 240,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 240,
    objectFit: 'contain',
  },
  map: {
    width: '100%',
    height: 240,
  },
  marker: {
    color: Colours.DARK,
  }
});
