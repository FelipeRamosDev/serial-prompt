import AsyncStorage from '@react-native-async-storage/async-storage';// Models
import { BtHistoryModel } from '../models/bluetooth-model';

export default class CoreFunctions {
    constructor() { }

    async setDeviceHistory({ device, connected, type }) {
        let storage = await AsyncStorage.getItem('bluetooth-history');
        if (!storage) {
            await AsyncStorage.setItem(
                'bluetooth-history',
                JSON.stringify([
                    new BtHistoryModel({
                        type: type,
                        id: connected.id,
                        name: connected.name,
                        address: connected.address,
                        serviceUUIDs: device.serviceUUIDs,
                    }),
                ])
            );
            return true;
        } else {
            let parsedHistory = JSON.parse(storage);

            if (!parsedHistory.find(x => x.id === connected.id)) {
                parsedHistory.push(
                    new BtHistoryModel({
                        type: type,
                        id: connected.id,
                        name: connected.name,
                        address: connected.address,
                        serviceUUIDs: device.serviceUUIDs,
                    })
                );
                await AsyncStorage.setItem(
                    'bluetooth-history',
                    JSON.stringify(parsedHistory)
                );
                return true;
            }
        }
    }
}
