import { View, Text, StyleSheet, Image } from 'react-native'
import React, { forwardRef, useMemo, useState } from 'react'
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { Avatar, Button, Snackbar } from 'react-native-paper';
import { useNotes } from '../Context/UserNotesContext';
import { faHeart } from '@fortawesome/pro-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/pro-regular-svg-icons';
import Colours from '../Utils/Colours';
const MapBottomSheetModal = forwardRef((props, ref) => {
    const { addFavourite, removeFavourite, favourites } = useNotes();
    const snapPoints = useMemo(() => ['40%', '50%', '75%'], []);

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
        <>
            <BottomSheetModal
                ref={ref}
                index={0}
                enablePanDownToClose={true}
                snapPoints={snapPoints}

            >
                <View style={styles.contentContainer}>
                    <Image source={{ uri: props.note.image }} style={styles.imagePreview} resizeMode="contain" />
                    <View style={styles.content}>
                        <Text style={styles.username}>
                            By: {props.note.username}</Text>

                        <Text style={styles.title}>{props.note.title}</Text>

                        <Text style={styles.description}>{props.note.description}</Text>
                        <View style={styles.favouriteContainer}>
                            <Button
                                onPress={() => toggleFavorite(props.note)}
                            >
                                {favourites.includes(props.note)
                                    ? <FontAwesomeIcon icon={faHeart} style={styles.heartIcon} />
                                    : <FontAwesomeIcon icon={faHeartOutline} style={styles.heartOutlineIcon} />
                                }
                            </Button>
                        </View>
                    </View>
                    <Button style={styles.closeBtn} title="Close" onPress={props.handleClosePress}>
                        <FontAwesomeIcon icon={faTimes} size={30} />
                    </Button>
                </View>
            </BottomSheetModal>
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

        </>
    )
});


const styles = StyleSheet.create({
    bottomSheetContainer: {
        zIndex: 99,
        flex: 1,
        padding: 24,
    },
    contentContainer: {
        flex: 1,
        paddingLeft: 12,
        paddingRight: 12,
    },
    content: {
        flex: 2,
        paddingRight: 12,

    },
    imagePreview: {
        width: '100%',
        aspectRatio: 1.333,

        backgroundColor: 'grey',
        borderRadius: 5,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    closeBtn: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'white',
        borderRadius: 0,
        borderBottomLeftRadius: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: 'lightgrey',
        padding: 5,
        borderRadius: 5,
        width: '100%',
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



});

export default MapBottomSheetModal