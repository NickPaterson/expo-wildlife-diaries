import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import Colours from '../Utils/Colours'
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';
import { useOAuth } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    // Warm up the android browser to improve UX https://docs.expo.dev/guides/authentication/#improving-user-experience
    useWarmUpBrowser();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
    const SignInWithGoogle = async () => {
        try {
            const { createdSessionId, setActive } =
                await startOAuthFlow();
            if (createdSessionId) {
                setActive({ session: createdSessionId });
            }
        } catch (err) {
            console.error("OAuth error", err);
        }
    };

    return (
        <View>
            <ImageBackground source={require('./../../assets/images/wildlife-app-bg.png')} style={styles.backgroundImage}>
                <View style={styles.container}>
                    <ImageBackground source={require('./../../assets/images/onboarding-header-bg.png')} style={styles.headerImage}>
                        <Text style={styles.heading}>Wildlife Diaries</Text>
                    </ImageBackground>
                    <TouchableOpacity style={styles.button}
                        onPress={SignInWithGoogle}
                    >
                        <Text>Login in with Google</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 100,

        alignItems: 'center',
        gap: 20,
    },
    backgroundImage: {
        width: '100%',
        height: '100%'
    },
    headerImage: {
        width: 350,
        height: 290,
        padding: 20,
        paddingBottom: 0,
        paddingTop: 0,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',

    },
    heading: {
        fontSize: 30,
        color: Colours.DARK,
        marginBottom: 10
    },
    button: {
        backgroundColor: Colours.LIGHT,
        color: Colours.DARK,
        display: 'flex',
        borderRadius: 99,
        width: 320,
        padding: 15,
        alignItems: 'center',
        marginTop: 40,


    },
})