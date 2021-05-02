import { ToastAndroid, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import CoreFunctions from '../core/functions';

// Models
import { BtConnectionModel } from '../models/bluetooth-model';

const bt = new BleManager();
const core = new CoreFunctions();


export default class BLEService {
    constructor() { }

    scanDevices({ setSearching, setLoading }) {
        let raw = [];
        setTimeout(() => {
            this.stopScan(setSearching);
            setLoading(false);
        }, 60000);
        setSearching(null);

        bt.startDeviceScan(null, null, async (err, device) => {

            if (err) {
                console.warn(err);
            } else if (device && device.serviceUUIDs && device.serviceUUIDs.length > 0) {
                let repeat = raw.find(x => x.id === device.id);

                if (!repeat) {
                    raw.push(device);
                    setSearching(device);
                }
            }
        });
    }

    async searchServicesAndCharacteristics({ device, connected }) {
        return new Promise(async (resolve, reject) => {
            try {
                let servicesLoaded = await connected.discoverAllServicesAndCharacteristics('esc-pos');
                console.log('>> Serviços carregados >>>>>>>');

                let services = await servicesLoaded.services();
                services.map(async (service) => {
                 
                    device.serviceUUIDs.find(async (uuid) => {
                        if (uuid === service.uuid) {
                            let characs = await service.characteristics();
                            characs.map(async (charac) => {
                                if (charac.isWritableWithResponse) {
                                    let model = new BtConnectionModel({
                                        type: 'ble',
                                        device: connected,
                                        service: service,
                                        characteristic: charac,
                                        serviceUUIDs: device.serviceUUIDs,
                                    });
                                    resolve(model);
                                }
                            });
                        }
                    });
                    
                });
            } catch (err) {
                reject(new Error(err.message));
            }
        });
    }

    async connect({ device }) {
        return new Promise(async (resolve, reject) => {

            try {
                let connected = await device.connect();
                console.log('>> Dispositivo conectado >>>>>>>');
                console.log(device.serviceUUIDs)
                await core.setDeviceHistory({ device, connected, type: 'ble' });

                let result = await this.searchServicesAndCharacteristics({ device, connected });

                resolve(result);

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

    async straightConnect({ device }) {
        return new Promise((resolve, reject) => {
            bt.connectToDevice(device.id).then(async (connected) => {
                try {
                    let result = await this.searchServicesAndCharacteristics({ device, connected });
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }).catch(err => {
                reject(err);
            });
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
