import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useNotes } from '../Context/UserNotesContext';
import { Card, Modal, Portal, Button, Snackbar, TextInput, Tooltip, ActivityIndicator } from 'react-native-paper';
import Colours from '../Utils/Colours';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFeatherPointed, faInfoCircle, faImage, faCamera, faHeart } from '@fortawesome/pro-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/pro-regular-svg-icons';

import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@clerk/clerk-expo';
export default function NotesScreen() {
  const { userId } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [activeNote, setActiveNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    image: '',
    location: {
      latitude: 0,
      longitude: 0,
    },
  });


  const { notes, favourites, addFavourite, removeFavourite, removeNote, updateNote } = useNotes();
  const userNotes = notes.filter((note) => note.user.id === userId);


  const displaySnackbar = (message) => {
    setSnackBarMessage(message);
    setSnackBarVisible(true);
  }

  const handlePress = (note) => {
    setActiveNote(note);
    setModalVisible(true);
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
      const uri = result.assets[0].uri;
      setEditFormData({ ...editFormData, image: uri });
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
      setEditFormData({ ...editFormData, image: uri });
    }
    setIsLoading(false);
  };

  const saveNote = () => {
    updateNote({
      ...editFormData,
      id: activeNote.id,
      updatedAt: new Date().toISOString(),
    });
    setEditModalVisible(false);
    displaySnackbar('Note updated');
  }

  const toggleFavorite = (note) => {
    if (favourites.find((fav) => fav.id === note.id)) {
      removeFavourite(note.id);
      displaySnackbar('Removed from favourites');
    } else {
      addFavourite(note);
      displaySnackbar('Added to favourites');
    }
  }



  return (<>

    <ScrollView style={styles.container}>
      <Portal>
        <Modal
          visible={editModalVisible}
          onDismiss={() => setEditModalVisible(false)}
          style={styles.modal}
        >
          <ScrollView>
            <Card styles={styles.modalCard}>
              <Card.Content>
                <View style={styles.formContainer}>
                  <View style={styles.imageUploadBtns}>
                    <TouchableOpacity
                      onPress={pickImage} style={styles.imageUploadBtn}>
                      <FontAwesomeIcon icon={faImage} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={takeImage} style={styles.imageUploadBtn}>
                      <FontAwesomeIcon icon={faCamera} size={30} />
                    </TouchableOpacity>

                  </View>
                  <TextInput
                    label="Title"
                    value={editFormData.title}
                    onChangeText={(text) => setEditFormData({ ...editFormData, title: text })}
                    mode="outlined"
                    style={styles.input}
                    outlineColor={Colours.DARK}
                    activeOutlineColor={Colours.DARK}
                  />
                </View>
                {isLoading ? (
                  <ActivityIndicator size="large" color={Colours.PRIMARY} />
                ) : (
                  editFormData?.image && (
                    <View style={styles.imagePreviewContainer}>

                      <Image source={{ uri: editFormData?.image }} style={styles.imagePreview} resizeMode="contain" />
                    </View>
                  )
                )}

                <TextInput
                  label="Description"
                  value={editFormData.description}
                  onChangeText={(text) => setEditFormData({ ...editFormData, description: text })}
                  mode="outlined"
                  style={styles.input}
                  outlineColor={Colours.DARK}
                  activeOutlineColor={Colours.DARK}
                  multiline={true}
                  numberOfLines={4}
                />
                <Tooltip title='Drag Marker'>
                  <FontAwesomeIcon icon={faInfoCircle} size={30} style={styles.tooltip}
                    onPress={() => { displaySnackbar('Hold and drag feather to change location') }}
                  />

                </Tooltip>

                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  region={{
                    latitude: editFormData?.location.latitude,
                    longitude: editFormData?.location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    draggable
                    coordinate={{
                      latitude: editFormData?.location.latitude,
                      longitude: editFormData?.location.longitude,
                    }}
                    onDragEnd={(e) => {
                      setEditFormData({
                        ...editFormData,
                        location: {
                          latitude: e.nativeEvent.coordinate.latitude,
                          longitude: e.nativeEvent.coordinate.longitude,
                        }
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faFeatherPointed} size={30} style={styles.marker} />
                  </Marker>
                </MapView>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    saveNote()
                  }}
                >
                  <Text>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => { setEditModalVisible(false) }}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
              </Card.Content>

            </Card>
          </ScrollView>
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)} style={styles.modal}>
          <Card styles={styles.modalCard}>
            <Card.Cover source={{ uri: activeNote?.image }} />
            <Card.Title title={activeNote?.title} />
            <Card.Content>
              <Text>{activeNote?.description}</Text>
            </Card.Content>
            <Card.Content>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                  latitude: activeNote?.location.latitude,
                  longitude: activeNote?.location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}  >
                <Marker
                  coordinate={{
                    latitude: activeNote?.location.latitude,
                    longitude: activeNote?.location.longitude,
                  }}>
                  <FontAwesomeIcon icon={faFeatherPointed} size={30} style={styles.marker} />
                </Marker>
              </MapView>
            </Card.Content>
            <Card.Actions>
              <Text>Created: {new Date(activeNote?.createdAt).toDateString()}</Text>
            </Card.Actions>
            <Card.Actions>
              <Button
                theme={{ colors: { primary: 'white' } }}
                buttonColor='green'
                onPress={() => {
                  setEditFormData(activeNote);
                  setModalVisible(false);
                  setEditModalVisible(true)
                }
                }
              >
                Edit
              </Button>



              <Button
                theme={{ colors: { primary: 'red' } }}
                onPress={() => {
                  removeNote(activeNote.id);
                  setModalVisible(false);
                  displaySnackbar('Note deleted');
                }}
              >
                Delete
              </Button>
              <Button onPress={() => setModalVisible(false)}>Close</Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
      {userNotes && userNotes.map((note) => {
        return (
          <Card key={note.id} style={styles.card} onPress={() => handlePress(note)}>
            <Card.Cover source={{ uri: note.image }} />
            <Card.Title title={note.title} />
            <Card.Content>
              <Text>{note.description}</Text>
            </Card.Content>
            <Card.Actions>
              <Text>Created: {new Date(note.createdAt).toLocaleString('en-UK', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}
              </Text>
            </Card.Actions>
            <Card.Actions>
              <Text>Updated: {new Date(note.updatedAt).toLocaleString('en-UK', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}</Text>
            </Card.Actions>
            <Card.Actions>
              <Button
                onPress={() => toggleFavorite(note)}
              >
              
                {favourites.includes(note)
                  ? <FontAwesomeIcon icon={faHeart} style={styles.heartIcon} />
                  : <FontAwesomeIcon icon={faHeartOutline} style={styles.heartOutlineIcon} />
                  
                }

                
              </Button>
            </Card.Actions>
          </Card>
        )
      })}
      {userNotes.length === 0 && <Text>No diary enteries to display</Text>}

    </ScrollView>



    {/* Popup messages */}
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
  container: {
    padding: 20,
  },
  card: {
    margin: 10,
  },
  modal: {
    margin: 20,
    marginTop: '30%',
    padding: 20,
    height: '70%',
    borderRadius: 20,
  },
  modalCard: {
    backgroundColor: Colours.DARK,
    height: '100%',

  },
  snackbar: {
    backgroundColor: Colours.BLACK,
    color: Colours.LIGHT,
  },
  map: {
    width: '100%',
    height: 150,
  },
  marker: {
    color: Colours.DARK,
  },

  input: {
    width: '100%',
    backgroundColor: Colours.LIGHT,
    borderRadius: 10,

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
  cancelButton: {
    backgroundColor: Colours.DANGER,
    marginTop: 10,
  },
  tooltip: {
    position: 'relative',
    top: 10,
    left: "90%",
    marginBottom: 15,
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
  heartIcon: {
    color: Colours.DANGER,
  },
  heartOutlineIcon: {
    color: 'grey',
  },

});