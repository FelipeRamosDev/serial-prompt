import {
    PermissionsAndroid,
    ToastAndroid,
} from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Models
import { BtConnectionModel, BtHistoryModel } from '../models/bluetooth-model';

export default class BluetoothService {
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

                let storage = await AsyncStorage.getItem('bluetooth-history');
                if (!storage) {
                    await AsyncStorage.setItem(
                        'bluetooth-history',
                        JSON.stringify([
                            new BtHistoryModel({
                                id: connected.id,
                                name: connected.name,
                                address: connected.address,
                            }),
                        ])
                    );
                } else {
                    let parsedHistory = JSON.parse(storage);

                    if (!parsedHistory.find(x => x.id === connected.id)) {
                        parsedHistory.push(
                            new BtHistoryModel({
                                id: connected.id,
                                name: connected.name,
                                address: connected.address,
                            })
                        );
                        await AsyncStorage.setItem(
                            'bluetooth-history',
                            JSON.stringify(parsedHistory)
                        );
                    }
                }

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
                    let response = await device.read();

                    if (response) {
                        let parsed = JSON.parse(response);

                        if (parsed.type === 'success') {
                            resolve(parsed);
                        } else if (parsed.type === 'error') {
                            reject(parsed);
                        }
                    } else {
                        throw new Error('O dispositivo não enviou nenhuma resposta!');
                    }
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}
