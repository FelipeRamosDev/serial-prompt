import {
    PermissionsAndroid,
    ToastAndroid,
} from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import CoreFunctions from '../core/functions';
// Models
import { BtConnectionModel } from '../models/bluetooth-model';

// Main declarations
const core = new CoreFunctions();

export default class BluetoothService {
    readListener;
    constructor() { }

    async requestPermission() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Permissão de Bluetooth',
                message:
                    'É necessário autorizar o uso do bluetooth do seu dispositivo para utilizar essa funcionalidade',
                buttonNeutral: 'Perguntar depois',
                buttonNegative: 'Cancelar',
                buttonPositive: 'Permitir',
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    async startScan() {
        return new Promise(async (resolve, reject) => {
            try {
                let granted = await this.requestPermission();

                if (!granted) {
                    throw new Error('Bluetooth não permitido!');
                }

                try {
                    let devices = await RNBluetoothClassic.startDiscovery();

                    resolve(devices);
                } catch (err) {
                    reject(err);
                }

            } catch (err) {
                ToastAndroid.showWithGravity(
                    err.message,
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER
                );
            }
        });
    }

    async connect({ device }) {
        return new Promise(async (resolve, reject) => {
            try {
                let connected = await RNBluetoothClassic.connectToDevice(device.address, {
                    delimiter: ';',
                });

                await core.setDeviceHistory({ device, connected, type: 'classic' });

                resolve(new BtConnectionModel({
                    type: 'classic',
                    device: connected,
                }));
            } catch (err) {
                reject(err);
            }
        });
    }

    async sendCmd({ device, cmd }) {
        return new Promise(async (resolve, reject) => {
            try {
                let sent = await device.write(cmd);
                if (sent) {
                    this.readListener = device.onDataReceived(response => {
                        let parsed = JSON.parse(response.data);
                        this.readListener.remove();
                        resolve(parsed);
                    });
                } else {
                    throw new Error('Ocorreu um erro ao enviar o comando!');
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    async cancelDiscovery() {
        return new Promise(async (resolve, reject) => {
            try {
                let cancel = await RNBluetoothClassic.cancelDiscovery();

                if (cancel) {
                    resolve(cancel);
                } else {
                    resolve(cancel);
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}
