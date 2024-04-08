import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCameraRotate } from '@fortawesome/pro-regular-svg-icons';
import { useNavigation } from '@react-navigation/native';

export default function QRScannerScreen() {
  const [facing, setFacing] = useState('back');
  const [hasPermission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        alert('Permission to access camera is required!');
      }
    })();
  }, []);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const successfulScan = (bounding) => {
    if (bounding.data === "lainshawwoods") {
      const polygonShape = [
        { latitude: 55.6777373056522,    longitude: -4.520536545624202   },
        { latitude: 55.676948304004455,  longitude: -4.521484718820171   },
        { latitude: 55.67634482613477,   longitude: -4.5240067049040995  },
        { latitude: 55.675027326799885,  longitude: -4.5249221457076665  },
        { latitude: 55.67319001961704,   longitude: -4.530554331535421   },
        { latitude: 55.670018173862246,  longitude: -4.531803031005033   },
        { latitude: 55.67017466564109,   longitude:  -4.533254510730395  }, 
        { latitude: 55.671768644898194,  longitude:  -4.536514336215238  },
        { latitude: 55.671389159433744,  longitude: -4.539878952101062   },
        { latitude: 55.67288431084627,   longitude: -4.543162817205626   },
        { latitude: 55.673582534580795,  longitude: -4.546258264144594   },
        { latitude: 55.674356637625536,  longitude: -4.545329630160107   },
        { latitude: 55.675501916318865,  longitude: -4.5473577995524925  },
        { latitude: 55.67818831176892,   longitude: -4.539673016869271   },
        { latitude:  55.67850702441052,  longitude: -4.537263951895022   },
        { latitude: 55.67832490321899,   longitude: -4.5369678656970684  },
        { latitude: 55.67801377755524,   longitude: -4.539498056843208   },
        { latitude: 55.67549432736985,   longitude: -4.546577208666981   },
        { latitude: 55.67457605367227,   longitude: -4.544719940698007   },
        { latitude: 55.674044811113056,  longitude: -4.542216666478954   },
        { latitude: 55.67327070189829,   longitude: -4.54244546035919    },
        { latitude: 55.67194253766057,   longitude: -4.5394173060619485  },
        { latitude:  55.67295953599992,  longitude: -4.5355681853525205  },
      ];
      
      // direct to the stack navigator with the mapPolyArea component
      navigation.navigate('Details', { polygonShape: polygonShape });

    }

  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={(bounding) => successfulScan(bounding)}
      >
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btn} onPress={toggleCameraFacing}>
            <FontAwesomeIcon icon={faCameraRotate} size={60}  style={styles.cameraIcon}/>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  btn: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    borderRadius: 50,
    padding: 4
  },
  cameraIcon: {
    color: 'white',
  }

});