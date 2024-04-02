import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useNavigation } from '@react-navigation/native';

import { TouchableOpacity } from 'react-native';
import MapScreen from './../Screens/MapScreen';
import NotesScreen from './../Screens/NotesScreen';
import UploadScreen from './../Screens/UploadScreen';
import FavouritesScreen from './../Screens/FavouritesScreen';
import QRScannerScreen from './../Screens/QRScannerScreen';
import ProfileScreen from './../Screens/ProfileScreen';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot, faNote, faPlus, faHeart, faQrcode } from '@fortawesome/pro-regular-svg-icons';

import { Avatar } from 'react-native-paper';

import Colours from './../Utils/Colours';

const Tab = createBottomTabNavigator();

export default function Tabs() {
    const navigation = useNavigation();
    return (
        <Tab.Navigator
            options={{
                tabBarActiveTintColor: Colours.DARK,
                tabBarInactiveTintColor: Colours.LIGHT,
                tabBarStyle: {
                    backgroundColor: Colours.LIGHT,
                    borderTopColor: Colours.DARK,
                    borderTopWidth: 1,
                },
                headerShown: false,
            }}
        >
            <Tab.Screen name="Map" component={MapScreen}
                options={{
                    tabBarActiveBackgroundColor: Colours.LIGHT,
                    tabBarInactiveBackgroundColor: Colours.LIGHT,
                    tabBarActiveTintColor: Colours.DARK,
                    tabBarInactiveTintColor: Colours.SECONDARY,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesomeIcon icon={faLocationDot} color={color} size={size} />
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Avatar.Text label="NP" size={36} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tab.Screen name="Notes" component={NotesScreen}
                options={{
                    tabBarActiveBackgroundColor: Colours.LIGHT,
                    tabBarInactiveBackgroundColor: Colours.LIGHT,
                    tabBarActiveTintColor: Colours.DARK,
                    tabBarInactiveTintColor: Colours.SECONDARY,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesomeIcon icon={faNote} color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="Upload" component={UploadScreen}
                options={{
                    tabBarActiveBackgroundColor: Colours.PRIMARY,
                    tabBarInactiveBackgroundColor: Colours.LIGHT,
                    tabBarActiveTintColor: Colours.LIGHT,
                    tabBarInactiveTintColor: Colours.SECONDARY,
                    tabBarStyle: {
                        borderRadius: 50,
                        backgroundColor: Colours.PRIMARY,
                    },
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesomeIcon icon={faPlus} color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="Favourites" component={FavouritesScreen}
                options={{
                    tabBarActiveBackgroundColor: Colours.LIGHT,
                    tabBarInactiveBackgroundColor: Colours.LIGHT,
                    tabBarActiveTintColor: Colours.DARK,
                    tabBarInactiveTintColor: Colours.SECONDARY,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesomeIcon icon={faHeart} color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="QRScanner" component={QRScannerScreen}
                options={{
                    tabBarActiveBackgroundColor: Colours.LIGHT,
                    tabBarInactiveBackgroundColor: Colours.LIGHT,
                    tabBarActiveTintColor: Colours.DARK,
                    tabBarInactiveTintColor: Colours.SECONDARY,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesomeIcon icon={faQrcode} color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen}
                options={{
                    tabBarButton: () => null
                }}

            />
        </Tab.Navigator>
    )
}
