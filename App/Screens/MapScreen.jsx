import { View, StyleSheet, Text } from 'react-native'
import React, { useState, useContext, useRef, useEffect } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { UserLocationContext } from '../Context/UserLocationContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFeatherPointed } from '@fortawesome/pro-solid-svg-icons';
import Colours from '../Utils/Colours';
import { Checkbox } from 'react-native-paper';
// import MapBottomSheet from '../components/MapBottomSheet';
import MapBottomSheetModal from '../components/MapBottomSheetModal';
import { useNotes } from '../Context/UserNotesContext';
import { useAuth } from '@clerk/clerk-react';

export default function MapScreen() {
  const { location, setLocation } = useContext(UserLocationContext);
  const { notes } = useNotes();
  const { userId } = useAuth();
  let showNotes = notes;
  const [activeNote, setActiveNote] = useState(null);
  const [userNotesChecked, setUserNoteChecked] = useState(false);
  const [markerList, setMarkerList] = useState();
  const bottomSheetRef = useRef(null);
  const handleClosePress = () => bottomSheetRef.current?.dismiss();
  // const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleOpenPress = (note) => {
    setActiveNote(note);
    bottomSheetRef.current?.present();
  }

  useEffect(() => {
    setMarkers(showNotes);
  }, []); 

  // const markerList = showNotes.map((note) => {
  //   return (
  //     <Marker
  //       key={note.id}
  //       coordinate={{
  //         latitude: note.location.latitude,
  //         longitude: note.location.longitude,
  //       }}
  //       onPress={() => handleOpenPress(note)}
  //     >
  //       <FontAwesomeIcon
  //         icon={faFeatherPointed}
  //         size={30}
  //         style={styles.marker} />
  //     </Marker>
  //   );
  // });
  const setMarkers = (notes) => {
    setMarkerList(notes.map((note) => {
      return (
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
      );
    }));
  };

  useEffect(() => {
    if (userNotesChecked) {
      showNotes = notes.filter((note) => note.user.id === userId);
      setMarkers(showNotes);
      console.log(showNotes);
    } else {
      showNotes = notes;
      setMarkers(showNotes);
    }
  }, [userNotesChecked]);
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
        // <MapBottomSheet ref={bottomSheetRef} handleOpenPress={handleOpenPress} note={activeNote} />

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