import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback } from 'react';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import LoginScreen from './App/Screens/LoginScreen';
import * as SecureStore from "expo-secure-store";
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './App/Navigation/Tabs';
import { PaperProvider } from 'react-native-paper';
SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'poppings': require('./assets/fonts/Poppins-Regular.ttf'),
    'poppings-bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'poppings-medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'poppings-semi-bold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'poppings-light': require('./assets/fonts/Poppins-Light.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    console.log('Error loading fonts');
    return null;
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={Constants.expoConfig.extra.clerkPublishableKey}
    >
      <PaperProvider>
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
      </PaperProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,

  },
});
