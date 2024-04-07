import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import LoginScreen from './App/Screens/LoginScreen';
import * as SecureStore from "expo-secure-store";
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './App/Navigation/Tabs';
import { PaperProvider } from 'react-native-paper';
import * as Location from 'expo-location';
import { UserLocationContext } from './App/Context/UserLocationContext';
import { NotesProvider } from './App/Context/UserNotesContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      console.error("Error fetching token:", err);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("Error saving token:", err);
    }
  },
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  // Expo fonts
  const [fontsLoaded, fontError] = useFonts({
    'poppins': require('./assets/fonts/Poppins-Regular.ttf'),
    'poppins-bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'poppins-medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'poppins-semi-bold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'poppins-light': require('./assets/fonts/Poppins-Light.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true); // Start loading
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false); // Stop loading
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setLoading(false); // Stop loading
    };

    fetchLocation();
  }, []);

  if (loading || !fontsLoaded) { // Show loading indicator if still loading
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  // Handling the display message based on location or error status
  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={Constants.expoConfig.extra.clerkPublishableKey}
    >
      <PaperProvider>
        <NotesProvider>
          <UserLocationContext.Provider value={{ location, setLocation }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>
                <View style={styles.container} onLayout={onLayoutRootView}>
                  <SignedIn>
                    <NavigationContainer>
                      <Tabs />
                    </NavigationContainer>
                  </SignedIn>
                  <SignedOut>
                    <LoginScreen />
                  </SignedOut>
                  <StatusBar style="auto" />
                </View>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </UserLocationContext.Provider>
        </NotesProvider>
      </PaperProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    justifyContent: 'center', // Center content vertically
  },
  loader: {
    flex: 1,
    justifyContent: 'center', // Center the loader
  },
});