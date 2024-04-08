import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useNotes } from '../Context/UserNotesContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFeatherPointed } from '@fortawesome/pro-duotone-svg-icons';
import MapBottomSheetModal from '../components/MapBottomSheetModal';

export default function MapPolyArea({ route }) {
    const { polygonShape } = route.params;
    const { notes } = useNotes();
    const [visibleNotes, setVisibleNotes] = useState([]);
    const [activeNote, setActiveNote] = useState(null);
    const [markerList, setMarkerList] = useState();
    const bottomSheetRef = useRef(null);

    // Bottom Sheet 
    const handleClosePress = () => bottomSheetRef.current?.dismiss();
    const handleOpenPress = (note) => {
        setActiveNote(note);
        bottomSheetRef.current?.present();
    };

    const isNoteInsidePolygon = (note) => {
        let noteLocation = {
            latitude: note.location.latitude,
            longitude: note.location.longitude
        };
        let isInside = false;
        for (let i = 0, j = polygonShape.length - 1; i < polygonShape.length; j = i++) {
            let xi = polygonShape[i].latitude, yi = polygonShape[i].longitude;
            let xj = polygonShape[j].latitude, yj = polygonShape[j].longitude;
            let intersect = ((yi > noteLocation.longitude) != (yj > noteLocation.longitude))
                && (noteLocation.latitude < (xj - xi) * (noteLocation.longitude - yi) / (yj - yi) + xi);
            if (intersect) isInside = !isInside;
        }
        return isInside;
    }

    useEffect(() => {
        setVisibleNotes(notes.filter((note) => isNoteInsidePolygon(note)));
        console.log(visibleNotes);
    }, [notes], []);

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
    }, [visibleNotes], []);



    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: polygonShape[0].latitude,
                    longitude: polygonShape[0].longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Polygon
                    coordinates={polygonShape}
                    fillColor="rgba(0, 200, 0, 0.5)"
                    strokeColor="rgba(0, 0, 0, 0.5)"
                    strokeWidth={2}
                />
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
});