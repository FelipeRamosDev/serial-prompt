import { Alert, ToastAndroid } from 'react-native';
import BLEService from './ble-service';

// Main declarations
const btService = new BLEService();

export default class EscPosService {
    constructor() { }

    async print({ btConnection, dataToPrint }) {
        return new Promise(async (resolve, reject) => {

            try {
                let printed = await btService.sendData({ btConnection, dataToPrint });

                ToastAndroid.showWithGravity(
                    'Impressão concluída com sucesso!',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER
                );

                let closeConnection = await btService.disconnect();
                let isConnected = await closeConnection.isConnected();

                if (!isConnected) {
                    // Bluetooth connection closed
                    resolve(printed);
                } else {
                    Alert.alert(
                        'Erro',
                        'Erro ao encerrar a conexão',
                        [
                            {
                                text: 'OK',
                            },
                        ]
                    );
                }
            } catch (err) {
                Alert.alert(
                    'Erro',
                    'Erro ao imprimir',
                    [
                        {
                            text: 'OK',
                        },
                    ]
                );
                reject({ reason: 'Erro ao imprimir' });
            }
        });
    }
}
