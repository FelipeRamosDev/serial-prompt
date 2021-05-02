import {
    ToastAndroid,
    Alert,
} from 'react-native';
// Services
import BluetoothServie from '../../services/bluetooth-service';

// Main declarations
const btService = new BluetoothServie();

export function handleInputCMD(ev, setCurrCMD) {
    setCurrCMD(ev);
}

export function sendCMD({btConnection, historyCMD, setHistoryCMD, currCMD, setCurrCMD}) {
    if (btConnection && btConnection.type === 'classic'){
        btService.sendCmd({ device: btConnection.device, cmd: currCMD }).then(res => {
            setHistoryCMD([...historyCMD, currCMD, res.message]);
            setCurrCMD('');
        }).catch(err => {
            ToastAndroid.show(
                err.message,
                ToastAndroid.LONG
            );
        });
    } else {
        Alert.alert(
            'Erro',
            'Você precisa estar conectado a um dispositivo bluetooth serial para enviar comandos!',
            [{ text: 'OK'}]
        );
    }
}
