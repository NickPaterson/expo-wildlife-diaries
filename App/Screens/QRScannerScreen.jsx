import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCameraRotate } from '@fortawesome/pro-regular-svg-icons';
export default function QRScannerScreen() {
  const [facing, setFacing] = useState('back');
  const [hasPermission, requestPermission] = useCameraPermissions();

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
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