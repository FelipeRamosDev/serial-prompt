/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { useEffect } from 'react';
import {
    ScrollView,
    Text,
    Button,
    TouchableOpacity,
} from 'react-native';

// Services
import BluetoothService from '../../services/bluetooth-service';

// Main declarations
const btService = new BluetoothService();

export default function DevicesPage({ navigation }) {
    const [connectedBT, setConnectedBT] = useState(null);
    const [searching, setSearching] = useState(false);
    const [devices, setDevices] = useState([]);

    function scanDevices() {
        setDevices([]);
        btService.scanDevices({ setSearching });
    }
    function connectBT({device}) {
        btService.connect({ device }).then(connected => {
            setConnectedBT(connected);
        }).catch(err => {
            console.error(err);
        });
    }

    useEffect(() => {
        if (searching) {
            setDevices([...devices, searching]);
        }
    }, [searching]);

    return (
        <ScrollView>

            {devices.map((d, i) => {
                return (
                    <TouchableOpacity key={i} style={{ marginVertical: 15 }} onPress={() => connectBT({device: d})}>
                        <Text>Id: {d.id || 'Desconhecido'}</Text>
                        <Text>Name: {d.name || 'Desconhecido'}</Text>
                        <Text>Qualidade do sinal: {d.rssi || 'Deconhecido'}</Text>
                    </TouchableOpacity>
                );
            })}

            {(searching === false) && <Button
                title="Buscar"
                onPress={() => scanDevices()}
            />}
            {(searching === null || searching) && <Button
                title="Parar"
                onPress={() => btService.stopScan(setSearching)}
                color="#d00"
            />}

            {/* <Button
                title="Serviços"
                onPress={() => getServices()}
                color="#d00"
            /> */}


        </ScrollView>
    );
}
