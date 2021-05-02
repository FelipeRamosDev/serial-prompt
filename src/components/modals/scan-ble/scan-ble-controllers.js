/* eslint-disable curly */
import {
    Alert,
} from 'react-native';
// Services
import BLEService from '../../../services/ble-service';
// Styles
import { defaultTheme } from '../../../styles/theme';

// Main declarations
const bleSevice = new BLEService();

export function scanBLEDevices({setLoading,setDevices,setSearching}) {
    setLoading(true);
    setDevices([]);
    bleSevice.scanDevices({ setSearching, setLoading });
}

export function connect({ device, setBtConnection, setSearching, setVisible, setStatusbarColor }) {
    bleSevice.connect({ device }).then(connection => {
        setBtConnection(connection);
        bleSevice.stopScan(setSearching);
        setVisible(false);
        setStatusbarColor(defaultTheme.contrast);
        console.log(connection)
        // Listener para estado da conexão
        connection.device.onDisconnected(async (err, res) => {
            if (err) return Alert.alert(
                'Erro',
                'Ocorreu um erro no listener da conexão',
                [
                    {
                        text: 'OK',
                    },
                ]
            );
            let isConnected = await res.isConnected();

            if (!isConnected) {
                setBtConnection(false);
            }
        });

    }).catch(err => {
        console.error(err);
    });
}

export function stopScan({setSearching, setLoading, setVisible}) {
    bleSevice.stopScan(setSearching);
    setLoading(false);
    setVisible(false);
}

