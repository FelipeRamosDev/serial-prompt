import { BleManager } from 'react-native-ble-plx';

const bt = new BleManager();

export default class BluetoothService{
    constructor(){}

    scanDevices({devices, setDevices}){
        bt.startDeviceScan(null, { allowDuplicates: false }, (err, discover)=>{
            if (err){
                console.error(err);
            } else {
                devices.push(discover);
                setDevices(devices);
            }
        });
    }

    stopScan(){
        bt.stopDeviceScan();
    }
}
