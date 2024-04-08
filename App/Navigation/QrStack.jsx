import { createStackNavigator } from '@react-navigation/stack';
import QRScannerScreen from '../Screens/QRScannerScreen';
import MapPolyArea from '../Screens/MapPolyArea'; // Make sure this is the correct import path

const QRStack = createStackNavigator();

const QRStackNavigator = () => {
    return (
        <QRStack.Navigator initialRouteName="QRScanner">
            <QRStack.Screen name="QRScannerScreen" component={QRScannerScreen}
                options={{ headerShown: false }}
            />
            <QRStack.Screen name="Details" component={MapPolyArea}
                options={{ headerTitle: 'Lainshaw Woods' }}
            />
        </QRStack.Navigator>
    );
};


export default QRStackNavigator;
