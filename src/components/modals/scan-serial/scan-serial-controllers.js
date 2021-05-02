import {
    ToastAndroid,
} from 'react-native';
// Services
import BluetoothService from '../../../services/bluetooth-service';

// Main declarations
const btService = new BluetoothService();

export function scanClassicDevices({setLoading,setDevices}){
    setLoading(true);
    setDevices([]);

    btService.startScan().then(discovered=>{
        setDevices(discovered);
    }).catch(err=>{
        ToastAndroid.showWithGravity(
            err.message,
            ToastAndroid.LONG,
            ToastAndroid.CENTER
        );
    }).finally(()=>{
        setLoading(false);
    });
}

export function connect({device, setBtConnection, setVisible}){
    btService.connect({device}).then(connected=>{
        setBtConnection(connected);
        setVisible(false);
    }).catch(err=>{
        ToastAndroid.showWithGravity(
            err.message,
            ToastAndroid.LONG,
            ToastAndroid.CENTER
        );
    });
}

export function stopScan({setVisible}){
    btService.cancelDiscovery().then(res=>{
        setVisible(false);
    }).catch(err=>{
        ToastAndroid.show(
            err.message,
            ToastAndroid.SHORT
        );
    });
}
