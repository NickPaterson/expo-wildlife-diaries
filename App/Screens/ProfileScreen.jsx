import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Avatar, TextInput } from 'react-native-paper';
import Colours from '../Utils/Colours';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  console.log(user);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => console.log("TODO: Update Avatar")}>
        <Avatar.Image source={{ uri: user.imageUrl }} size={72} />
      </TouchableOpacity>

      <Text style={styles.text}>Welcome {user.firstName}</Text>

      <Text style={styles.text}>Username: {user.username}</Text>

      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  text: {
    fontSize: 24,
    marginTop: 12,
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colours.PRIMARY,
    color: Colours.DARK,
    display: 'flex',
    borderRadius: 99,
    width: 320,
    padding: 15,
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },
  input: {
    width: '100%',
    backgroundColor: Colours.LIGHT,
    borderRadius: 10,
  },
});