import { View, StyleSheet, Text } from 'react-native'
import React, { useState, useContext, useRef, useEffect } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { UserLocationContext } from '../Context/UserLocationContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFeatherPointed } from '@fortawesome/pro-duotone-svg-icons';
import Colours from '../Utils/Colours';
import { Checkbox } from 'react-native-paper';
import MapBottomSheetModal from '../components/MapBottomSheetModal';
import { useNotes } from '../Context/UserNotesContext';
import { useAuth } from '@clerk/clerk-react';

export default function MapScreen() {
  const { location } = useContext(UserLocationContext);
  const { notes } = useNotes();

  const { userId } = useAuth();
  const [activeNote, setActiveNote] = useState(null);
  const [visibleNotes, setVisibleNotes] = useState(notes);
  const [userNotesChecked, setUserNoteChecked] = useState(false);
  const [markerList, setMarkerList] = useState();
  const bottomSheetRef = useRef(null);

  // Bottom Sheet 
  const handleClosePress = () => bottomSheetRef.current?.dismiss();
  const handleOpenPress = (note) => {
    setActiveNote(note);
    bottomSheetRef.current?.present();
  };

  // Visble Notes
  useEffect(() => {
    userNotesChecked
      ? setVisibleNotes(notes.filter((note) => note.user.id === userId))
      : setVisibleNotes(notes);
  }, [userNotesChecked]);

  useEffect(() => {
    setMarkerList(
      visibleNotes.map((note) => (
        <Marker
          key={note.id}
          coordinate={{
            latitude: note.location.latitude,
            longitude: note.location.longitude,
          }}
          onPress={() => handleOpenPress(note)}
        >
          <FontAwesomeIcon
            icon={faFeatherPointed}
            size={30}
            style={styles.marker} />
        </Marker>
      ))
    );
  }, [visibleNotes]);


  return (
    <View style={styles.container}>
      <Text style={styles.checkboxContainer}>Show My Notes Only
        <Checkbox
          style={styles.checkbox}
          status={userNotesChecked ? 'checked' : 'unchecked'}
          onPress={() => setUserNoteChecked(!userNotesChecked)}
        />
      </Text>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: location?.latitude,
          longitude: location?.longitude,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }}
        showsUserLocation={true}
      >
        {markerList}
      </MapView>
      {activeNote && (
        <MapBottomSheetModal
          ref={bottomSheetRef}
          handleOpenPress={handleOpenPress}
          handleClosePress={handleClosePress}
          note={activeNote} />
      )}


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  map: {
    width: '100%',
    height: '100%',
  },
  marker: {
    color: Colours.DARK,
  },
  checkboxContainer: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  checkbox: {
    marginLeft: 10,
  }

});