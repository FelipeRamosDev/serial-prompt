import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';

const bt = new BleManager();

const dataToPrint = base64.encode('Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. FF');

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
                console.warn(err);
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
        try {
            let connected = await device.connect();
            console.log('>> Dispositivo conectado >>>>>>>');

            let servicesLoaded = await connected.discoverAllServicesAndCharacteristics('esc-pos');
            console.log('>> Serviços carregados >>>>>>>');

            let services = await servicesLoaded.services();
            services.map(async (service)=>{
                device.serviceUUIDs.find(async (uuid)=>{
                    if (uuid === service.uuid) {
                        let characs = await service.characteristics();
                        characs.map(async (charac) => {
                            if (charac.isWritableWithResponse) {
                                await charac.writeWithResponse(dataToPrint, 'esc-pos');
                                let closeConnection = await device.cancelConnection();
                                let isConnected = await closeConnection.isConnected();

                                if (!isConnected) {
                                    console.log('>> Conexão encerrada >>>>>>>');
                                } else {
                                    console.error('>> Erro ao encerrar a conexão >>>>>>>');
                                }
                            }
                        });
                    }
                });
            });

        } catch (err){
            console.error('>> Erro conectar com o dispositivo >>>>>>>', err);
        }
    }

    stopScan(setSearching) {
        bt.stopDeviceScan();
        setSearching(false);
    }

}
