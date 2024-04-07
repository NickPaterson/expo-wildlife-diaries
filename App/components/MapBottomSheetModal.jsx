import { View, Text, StyleSheet, Image } from 'react-native'
import React, { forwardRef, useMemo } from 'react'
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { Avatar, Button } from 'react-native-paper';
const MapBottomSheetModal = forwardRef((props, ref) => {
    const snapPoints = useMemo(() => ['40%', '50%', '75%'], []);

    return (

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
                            By: {props.note.user.username}</Text>
                   
                    <Text style={styles.title}>{props.note.title}</Text>

                    <Text style={styles.description}>{props.note.description}</Text>

                </View>
                <Button style={styles.closeBtn} title="Close" onPress={props.handleClosePress}>
                    <FontAwesomeIcon icon={faTimes} size={30} />
                </Button>
            </View>
        </BottomSheetModal>

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

    


});

export default MapBottomSheetModal