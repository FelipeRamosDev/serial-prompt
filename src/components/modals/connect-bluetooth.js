/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
    Alert,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Button,
    ActivityIndicator,
} from 'react-native';
// Services
import BluetoothService from '../../services/bluetooth-service';
// Icons
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// Contexts
import { useBtConnection } from '../../core/contexts/bt-connection';
// Styles
import { GlobalStyles } from '../../styles/global';

// Main declarations
const btService = new BluetoothService();

export default function ConnectBluetoothModal({ setVisible }) {
    const [ loading, setLoading ] = useState(false);
    const [searching, setSearching] = useState(false);
    const [devices, setDevices] = useState([]);
    const { btConnection, setBtConnection } = useBtConnection();

    function scanDevices() {
        setLoading(true);
        setDevices([]);
        btService.scanDevices({ setSearching, setLoading });
    }
    
    function connect({ device }) {
        btService.connect({ device }).then(connection => {
            setBtConnection(connection);
            btService.stopScan(setSearching);
            setVisible(false);

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

    function stopScan(){
        btService.stopScan(setSearching);
        setLoading(false);
    }

    useEffect(() => {
        if (searching) {
            setDevices([...devices, searching]);
        }
    }, [searching]);

    /*-------------------------------------------------------------
        RENDER
    -------------------------------------------------------------*/
    return (
        <View style={GlobalStyles.modal1}>
            <View style={GlobalStyles.modalbox1}>
                <TouchableOpacity
                    onPress={() => setVisible(false)}
                    style={GlobalStyles.closeButton}
                >
                    <FontAwesome5 name="times" color="#333" size={25} />
                </TouchableOpacity>

                <ScrollView style={GlobalStyles.container}>
                    {devices.map((d, i) => {
                        return (
                            <TouchableOpacity key={i} style={{ marginVertical: 15, paddingHorizontal: 10 }} onPress={() => connect({ device: d })}>
                                <Text>Id: {d.id || 'Desconhecido'}</Text>
                                <Text>Name: {d.name || 'Desconhecido'}</Text>
                                <Text>Qualidade do sinal: {d.rssi || 'Deconhecido'}</Text>
                            </TouchableOpacity>
                        );
                    })}

                    {loading && <ActivityIndicator size="large" color="#ff8800" />}
                </ScrollView>

                {(searching === false && !btConnection) && <Button
                    title="Buscar"
                    onPress={() => scanDevices(true)}
                />}
                {(searching === null || searching) && <Button
                    title="Parar"
                    onPress={() => stopScan()}
                    color="#d00"
                />}
            </View>
        </View>
    );
}
