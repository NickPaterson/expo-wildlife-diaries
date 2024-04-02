import { View, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { UserLocationContext } from '../Context/UserLocationContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFeatherPointed } from '@fortawesome/pro-solid-svg-icons';
import Colours from '../Utils/Colours';

export default function MapScreen() {
  const { location, setLocation } = useContext(UserLocationContext);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: location?.latitude,
          longitude: location?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: location?.latitude,
            longitude: location?.longitude,
          }}
         >
          <FontAwesomeIcon icon={faFeatherPointed} size={30} style={styles.marker}/>
         </Marker>
      </MapView>
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
  }
});