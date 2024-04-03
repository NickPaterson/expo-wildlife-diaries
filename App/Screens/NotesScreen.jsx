import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNotes } from '../Context/UserNotesContext';
import { Card, Modal, Portal, Button, Snackbar } from 'react-native-paper';
import Colours from '../Utils/Colours';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFeatherPointed } from '@fortawesome/pro-solid-svg-icons';

export default function NotesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [activeNote, setActiveNote] = useState(null);
  const { notes, removeNote, updateNote } = useNotes();

  const displaySnackbar = (message) => {
    setSnackBarMessage(message);
    setSnackBarVisible(true);
  }

  const handlePress = (note) => {
    setActiveNote(note);
    setModalVisible(true);
  }

  return (<>
    <ScrollView style={styles.container}>
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
      {notes && notes.map((note) => {
        console.log(note.location.longitude);
        return (
          <Card key={note.id} style={styles.card} onPress={() => handlePress(note)}>
            <Card.Cover source={{ uri: note.image }} />
            <Card.Title title={note.title} />
            <Card.Content>
              <Text>{note.description}</Text>
            </Card.Content>
            <Card.Actions>
              <Text>Created: {new Date(note.createdAt).toDateString()}</Text>
            </Card.Actions>
          </Card>
        )
      })}
      {notes.length === 0 && <Text>No diary enteries to display</Text>}

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
    backgroundColor: Colours.PRIMARY,
    color: Colours.LIGHT,
  },
  map: {
    width: '100%',
    height: 150,
  },
  marker: {
    color: Colours.DARK,
  }
});