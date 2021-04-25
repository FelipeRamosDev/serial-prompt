/* eslint-disable curly */
/* eslint-disable keyword-spacing */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    Text,
    Button,
    TouchableOpacity,
    ToastAndroid,
    Alert,
} from 'react-native';
import base64 from 'react-native-base64';

// Services
import BluetoothService from '../../services/bluetooth-service';

// Contexts
import { useBtConnection } from '../../core/contexts/bt-connection';

// Models
// import { BtConnectionModel } from '../../models/bluetooth-model';

// Main declarations
const btService = new BluetoothService();

const dataToPrint = base64.encode('Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste.');

export default function DevicesPage({ navigation }) {
    const [searching, setSearching] = useState(false);
    const [devices, setDevices] = useState([]);
    const { btConnection, setBtConnection } = useBtConnection();

    function scanDevices() {
        setDevices([]);
        btService.scanDevices({ setSearching });
    }
    function connectBT({ device }) {
        btService.connect({ device }).then(connection => {
            setBtConnection(connection);
            btService.stopScan(setSearching);

            // Listener para estado da conexão
            connection.device.onDisconnected(async (err, res) => {
                if (err) return Alert.alert(
                    'Erro',
                    'Ocorreu um erro no listener da conexão',
                    [
                        {
                            text: 'OK',
                        },
                    ]
                );
                let isConnected = await res.isConnected();

                if (!isConnected) {
                    setBtConnection(false);
                }
            });

        }).catch(err => {
            console.error(err);
        });
    }

    function disconnectDevice() {
        btService.disconnect({ btConnection }).then(res => {
            // Device disconnected
        }).catch(() => {
            Alert.alert(
                'Erro',
                'Erro desconectar com o dispositivo',
                [
                    {
                        text: 'OK',
                    },
                ]
            );
        });
    }

    async function print() {

        try {
            await btConnection.characteristic.writeWithResponse(dataToPrint, 'esc-pos');

            ToastAndroid.showWithGravity(
                'Impressão concluída com sucesso!',
                ToastAndroid.LONG,
                ToastAndroid.CENTER
            );

            let closeConnection = await btConnection.device.cancelConnection();
            let isConnected = await closeConnection.isConnected();

            if (!isConnected) {
                // Bluetooth connection closed
            } else {
                Alert.alert(
                    'Erro',
                    'Erro ao encerrar a conexão',
                    [
                        {
                            text: 'OK',
                        },
                    ]
                );
            }
        } catch (err) {
            Alert.alert(
                'Erro',
                'Erro ao imprimir',
                [
                    {
                        text: 'OK',
                    },
                ]
            );
        }

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
                    <TouchableOpacity key={i} style={{ marginVertical: 15 }} onPress={() => connectBT({ device: d })}>
                        <Text>Id: {d.id || 'Desconhecido'}</Text>
                        <Text>Name: {d.name || 'Desconhecido'}</Text>
                        <Text>Qualidade do sinal: {d.rssi || 'Deconhecido'}</Text>
                    </TouchableOpacity>
                );
            })}

            {(searching === false && !btConnection) && <Button
                title="Buscar"
                onPress={() => scanDevices()}
            />}
            {(searching === null || searching) && <Button
                title="Parar"
                onPress={() => btService.stopScan(setSearching)}
                color="#d00"
            />}
            {(btConnection) && (
                <Button
                    title="Desconectar"
                    onPress={() => disconnectDevice()}
                    color="#d00"
                />
            )}

            {(btConnection) && <Button
                title="Imprimir"
                onPress={() => print()}
            />}


        </ScrollView>
    );
}
