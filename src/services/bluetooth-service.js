import { ToastAndroid, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

// Models
import { BtConnectionModel } from '../models/bluetooth-model';

const bt = new BleManager();


export default class BluetoothService {
    constructor() { }

    scanDevices({ setSearching }) {
        let raw = [];
        setTimeout(() => {
            this.stopScan(setSearching);
        }, 60000);
        setSearching(null);

        bt.startDeviceScan(null, null, async (err, device) => {

            if (err) {
                console.warn(err.reason);
            } else if (device && device.serviceUUIDs && device.serviceUUIDs.length > 0) {
                let repeat = raw.find(x => x.id === device.id);

                if (!repeat) {
                    raw.push(device);
                    setSearching(device);

                    // console.log('\n-----------------------------------');
                    // console.log('ID: ', device.id);
                    // console.log('Nome: ', device.name);
                    // console.log('Services: ', device.serviceUUIDs);
                    // console.log('-----------------------------------\n');
                }
            }
        });
    }

    async connect({ device }) {
        return new Promise(async (resolve, reject) => {

            try {
                let connected = await device.connect();
                console.log('>> Dispositivo conectado >>>>>>>');
                ToastAndroid.showWithGravity(
                    `Dispositivo ${device.name} conectado!`,
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER
                );

                let servicesLoaded = await connected.discoverAllServicesAndCharacteristics('esc-pos');
                console.log('>> Serviços carregados >>>>>>>');

                let services = await servicesLoaded.services();
                services.map(async (service) => {
                    device.serviceUUIDs.find(async (uuid) => {
                        if (uuid === service.uuid) {
                            let characs = await service.characteristics();
                            characs.map(async (charac) => {
                                if (charac.isWritableWithResponse) {
                                    resolve(new BtConnectionModel({
                                        device: connected,
                                        service: service,
                                        characteristic: charac,
                                    }));
                                }
                            });
                        }
                    });
                });

            } catch (err) {
                Alert.alert(
                    'Erro',
                    'Erro conectar com o dispositivo',
                    [
                        {
                            text: 'OK',
                        },
                    ]
                );
                reject(err);
            }
        });
    }

    async sendData({ id, btConnection, dataToPrint }) {
        return new Promise(async (resolve, reject) => {
            try {
                let sent = await btConnection.characteristic.writeWithResponse(dataToPrint, id);
                resolve(sent);
            } catch (err) {
                reject(err);
            }
        });
    }

    async disconnect({ btConnection }) {
        return new Promise((resolve, reject) => {
            bt.cancelDeviceConnection(btConnection.device.id).then(res => {
                ToastAndroid.showWithGravity(
                    `Dispositivo ${btConnection.device.name || 'Desconhecido'} desconectado!`,
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER
                );
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    }

    stopScan(setSearching) {
        bt.stopDeviceScan();
        setSearching(false);
    }

}
