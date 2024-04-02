import { View, Text, StyleSheet, Button, Image, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { TextInput, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Colours from '../Utils/Colours';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faImage } from '@fortawesome/pro-solid-svg-icons';
import { useNotes } from '../Context/UserNotesContext';
import { UserLocationContext } from '../Context/UserLocationContext';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

export default function UploadsScreen() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const { addNote } = useNotes();
  const { userLocation } = useContext(UserLocationContext);
  console.log("userLocation", userLocation);
  const [markerLocation, setMarkerLocation] = useState({
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
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
    console.log(result);
    if (!result.canceled) {
      setImage(result.uri);
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      setError('Please fill in all fields');
      return;
    }
    const note = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      image: image,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      location: {
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
    };

  }

  return (
    <View>
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
            initialRegion={userLocation}
            onRegionChangeComplete={(region) => setMarkerLocation(region)}
          >
            <Marker
              draggable
              coordinate={{
                latitude: markerLocation.latitude,
                longitude: markerLocation.longitude,
              }}
              onDragEnd={(e) => markerLocation(e.nativeEvent.coordinate)}
            />
          </MapView>

          <TouchableOpacity
            style={styles.button}
            onPress={() => { console.log('Upload', formData, image) }}
          >
            <Text>Upload</Text>
          </TouchableOpacity>
        </View>

      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({

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
    borderRadius: 30,
  },
  map: {
    width: '100%',
    height: 240,
    borderRadius: 30,
  },
});
