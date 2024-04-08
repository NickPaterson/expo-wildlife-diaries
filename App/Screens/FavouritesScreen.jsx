import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Colours from '../Utils/Colours';
import { Card, Button, Snackbar } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/pro-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/pro-regular-svg-icons';
import { ScrollView } from 'react-native-gesture-handler';

import { useNotes } from '../Context/UserNotesContext';
export default function FavouritesScreen() {
  const { favourites, addFavourite, removeFavourite } = useNotes();
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const toggleFavorite = (note) => {
    if (favourites.includes(note)) {
      removeFavourite(note.id);
      displaySnackbar('Removed from favourites');
    } else {
      addFavourite(note);
      displaySnackbar('Added to favourites');
    }
  };
  const displaySnackbar = (message) => {
    setSnackBarMessage(message);
    setSnackBarVisible(true);
  }

  return (
    <ScrollView style={styles.container}>
      {favourites && favourites.length > 0 ? (
        favourites.map((note) => (
          <Card key={note.id} style={styles.card} >
            <Card.Cover source={{ uri: note.image }} />
            <Card.Title title={note.title} />
            
            <Card.Content>
              <Text style={styles.username}>By: {note.user.username}</Text>
              <Text>{note.description}</Text>
            </Card.Content>
            <Card.Actions>
              <Text>Created: {new Date(note.createdAt).toLocaleString('en-UK', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}
              </Text>
            </Card.Actions>
            <Card.Actions>
              <Text>Updated: {new Date(note.updatedAt).toLocaleString('en-UK', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}</Text>
            </Card.Actions>
            <Card.Actions>
              <Button
                onPress={() => toggleFavorite(note)}
              >
                {favourites.includes(note)
                  ? <FontAwesomeIcon icon={faHeart} style={styles.heartIcon} />
                  : <FontAwesomeIcon icon={faHeartOutline} style={styles.heartOutlineIcon} />
                }
              </Button>
            </Card.Actions>
          </Card>
        ))
      ) : (
        <Text style={styles.text}>No favourites yet</Text>
      )}
      <Snackbar
        visible={snackBarVisible}
        onDismiss={() => setSnackBarVisible(false)}
        duration={5000}
        style={styles.snackbar}
        action={{
          label: 'X',
        }}
      >
        {snackBarMessage}
      </Snackbar>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    marginBottom: 50,
  },
  card: {
    margin: 10,
  },
  snackbar: {
    backgroundColor: Colours.BLACK,
    color: Colours.LIGHT,
  },
  heartIcon: {
    color: Colours.DANGER,
  },
  heartOutlineIcon: {
    color: 'grey',
  },
  username: {
    backgroundColor: 'lightgrey',
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 5,
    marginBottom: 10,
  }
});