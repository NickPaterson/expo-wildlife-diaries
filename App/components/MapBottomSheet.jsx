import React, { useMemo, useCallback, forwardRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const MapBottomSheet = forwardRef((props, ref) => {
    console.log(props.note.image);
    const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

    return (
        <View style={styles.bottomSheetContainer}>
            <BottomSheet
                ref={ref}
                snapPoints={snapPoints}
                index={0}
                enablePanDownToClose={true}
            >
                <View style={styles.contentContainer}>
                    <Image source={{ uri: props.note.image }} style={styles.imagePreview} resizeMode="contain" />
                    <View style={styles.content}>
                        <Text style={styles.title}>{props.note.title}</Text>
                        <Text>{props.note.description}</Text>
                    </View>
                </View>
            </BottomSheet>
        </View>
    )
});

const styles = StyleSheet.create({
    bottomSheetContainer: {

        flex: 1,
        padding: 24,
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 2,
        flexDirection: 'row',
        paddingLeft: 12,
        paddingRight: 12,
        gap: 12,
    },
    imagePreview: {
        width: 150,
        height: 112,
        borderRadius: 5,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
});

export default MapBottomSheet;