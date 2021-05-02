import {
    ToastAndroid,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Services
import BluetoothService from '../../services/bluetooth-service';
import BLEService from '../../services/ble-service';
import EscPosService from '../../services/escpos-service';

// Styles
import { defaultTheme } from '../../styles/theme';

// Main declarations
const btService = new BluetoothService();
const bleService = new BLEService();
const escpos = new EscPosService();

/*-----------------------------------------------------------------
>> Functions exports
-----------------------------------------------------------------*/
export function getHistory({setBluetoothHistory}){
    AsyncStorage.getItem('bluetooth-history', (err, result)=>{
        if (err){
            Alert.alert(
                'Historico',
                'Ocorreu um erro ao carregar o histórico de dispositivos bluetooth!',
                [
                    {
                        text: 'OK',
                    },
                ]
            );
        }

        setBluetoothHistory(JSON.parse(result));
    });
}

export function btConnect({device, setBtConnection}){
    if (device.type === 'classic'){
        btService.connect({device}).then(connected=>{
            setBtConnection(connected);
        }).catch(err=>{
            ToastAndroid.showWithGravity(
                err.message,
                ToastAndroid.LONG,
                ToastAndroid.CENTER
            );
        });
    } else if (device.type === 'ble'){
        bleService.straightConnect({device}).then(connected=>{
            setBtConnection(connected);
        }).catch(err=>{
            ToastAndroid.showWithGravity(
                err.message,
                ToastAndroid.LONG,
                ToastAndroid.CENTER
            );
        });
    }
}

export function disconnectDevice({btConnection, setBtConnection, setStatusbarColor}) {
    if (btConnection) {
        if (btConnection.type === 'classic') {
            btConnection.device.disconnect().then(disconnected => {
                if (disconnected) {
                    setBtConnection(false);

                    ToastAndroid.showWithGravity(
                        'O dispositivo foi desconectado com sucesso!',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER
                    );
                } else {
                    ToastAndroid.showWithGravity(
                        'O dispositivo não foi desconectado corretamente!',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER
                    );
                }
            }).catch(() => {
                Alert.alert(
                    'Erro',
                    'Ocorreu um erro desconectar com o dispositivo!',
                    [
                        {
                            text: 'OK',
                        },
                    ]
                );
            });
        } else if (btConnection.type === 'ble') {
            bleService.disconnect({ btConnection }).then(res => {
                setBtConnection(false);
            }).catch(() => {
                Alert.alert(
                    'Erro',
                    'Erro desconectar com o dispositivo!',
                    [
                        {
                            text: 'OK',
                        },
                    ]
                );
            });
        }
    } else {
        ToastAndroid.showWithGravity(
            'O dispositivo já está desconectado!',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
        );
    }
}

export async function print({btConnection, dataToPrint}) {
    escpos.print({ id: 'esc-pos', btConnection, dataToPrint }).then(res=>{
    });
}

export function openConnectModal({setModalConnectBLEVisible, setModalConnectClassicVisible}){
    Alert.alert(
        'Tipo de conexão',
        'Escolha qual o tipo de conexão bluetooth você deseja fazer...',
        [
            { text: 'Cancelar' },
            {
                text: 'BLE',
                onPress: ()=> setModalConnectBLEVisible(true),
            },
            {
                text: 'Serial',
                onPress: ()=> setModalConnectClassicVisible(true),
            },
        ]
    );
}
