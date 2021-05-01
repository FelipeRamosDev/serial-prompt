import React, { useState } from 'react';
import {
    Button,
    Modal,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native';
import base64 from 'react-native-base64';
// Functions
import {
    btConnect,
    disconnectDevice,
    getHistory,
    print,
} from './devices-controllers';
// Components
import ConnectBLEModal from '../../components/modals/connect-ble';
import ConnectBTClassicModal from '../../components/modals/connect-bt-classic';
// Styled components
import {
    Activity,
    Card,
} from '../../styles/main';
// Contexts
import { useBtConnection } from '../../core/contexts/bt-connection';
// Styles
import { GlobalStyles } from '../../styles/global';

const dataToPrint = base64.encode('Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste.');

export default function DevicesPage({ navigation }) {
    const { btConnection, setBtConnection } = useBtConnection();
    const [ modalConnectBLEVisible, setModalConnectBLEVisible ] = useState(false);
    const [ modalConnectClassicVisible, setModalConnectClassicVisible ] = useState(false);
    const [ bluetoothHistory, setBluetoothHistory ] = useState([]);

    // Get the history of devices connected
    getHistory({ setBluetoothHistory });

    return (
        <Activity>
            <ScrollView contentContainerStyle={GlobalStyles.container}>

                {btConnection ? (
                    <Card>
                        <Text>Nome: {btConnection ? btConnection.device.name : '---'}</Text>
                        <Text>MAC Address: {btConnection ? btConnection.device.id : '---'}</Text>

                        <Button
                            title="Imprimir QR-Code"
                            onPress={() => print({btConnection, dataToPrint})}
                        />
                    </Card>
                ) : (
                    <Card>
                        <Text>Nenhum dispositivo conectado!</Text>
                    </Card>
                )}

                {(bluetoothHistory && bluetoothHistory.length > 0) && (
                    <>
                        <Text>Dispositivos anteriores:</Text>
                        <Card>
                            {
                                bluetoothHistory.map((h, i)=>{
                                    return (
                                        <TouchableOpacity key={i} onPress={()=>btConnect({device: h, setBtConnection})}>
                                            <Text>Nome: {h.name || '---'}</Text>
                                            <Text>MAC Address: {h.address || h.id || '---'}</Text>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </Card>
                    </>
                )}

            </ScrollView>

            <View style={GlobalStyles.footer}>
                {(!btConnection) && <Button
                    title="Conectar Classic"
                    onPress={() => setModalConnectClassicVisible(true)}
                />}
                {(!btConnection) && <Button
                    title="Conectar BLE"
                    onPress={() => setModalConnectBLEVisible(true)}
                />}
                {(btConnection) && (
                    <Button
                        title="Desconectar"
                        onPress={() => disconnectDevice({ btConnection, setBtConnection })}
                        color="#d00"
                    />
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalConnectClassicVisible && !btConnection}
                >
                    <ConnectBTClassicModal setVisible={setModalConnectClassicVisible} />
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalConnectBLEVisible && !btConnection}
                >
                    <ConnectBLEModal setVisible={setModalConnectBLEVisible} />
                </Modal>
            </View>
        </Activity>
    );
}
