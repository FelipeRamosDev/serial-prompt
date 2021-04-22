/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { useEffect } from 'react';
import {
    View,
    ScrollView,
    Text,
    Button,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

// Services
import BluetoothService from '../../services/bluetooth-service';

// Main declarations
const btService = new BluetoothService();
const bt = new BleManager();

export default function DevicesPage({ navigation }) {
    const [newDevice, setNewDevice] = useState(null);
    const [devices, setDevices] = useState([]);

    function scanDevices() {
        let raw = [];
        setDevices([]);
        setTimeout(() => {
            btService.stopScan();
        }, 60000);

        bt.startDeviceScan(null, null, (err, device) => {

            if (err) {
                console.warn(JSON.stringify(err));
            } else if (device && device.serviceUUIDs && device.serviceUUIDs.length > 0) {
                let repeat = raw.find(x => x.id === device.id);

                if (!repeat) {
                    raw.push(device);
                    setNewDevice(device);
                }
            }
        });
    }

    useEffect(() => {
        if (newDevice) {
            setDevices([...devices, newDevice]);
        }
    }, [newDevice]);

    return (
        <ScrollView>
            <Text>Dispositivos</Text>

            {devices.map((d, i) => {
                return (
                    <View key={i} style={{ marginVertical: 15 }}>
                        <Text>Id: {d.id || 'Desconhecido'}</Text>
                        <Text>Name: {d.name || 'Desconhecido'}</Text>
                        <Text>Qualidade do sinal: {d.rssi || 'Deconhecido'}</Text>
                    </View>
                );
            })}

            <Button
                title="Buscar"
                onPress={() => scanDevices()}
            />
            <Button
                title="Parar"
                onPress={() => btService.stopScan()}
            />
        </ScrollView>
    );
}
