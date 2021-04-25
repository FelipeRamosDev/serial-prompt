import React, { useState } from 'react';
import {
    Button,
    Alert,
    Modal,
    View,
    ScrollView,
    Text,
} from 'react-native';
import base64 from 'react-native-base64';
// Components
import ConnectBluetoothModal from '../../components/modals/connect-bluetooth';
// Services
import BluetoothService from '../../services/bluetooth-service';
import EscPosService from '../../services/escpos-service';
// Contexts
import { useBtConnection } from '../../core/contexts/bt-connection';
// Styles
import { GlobalStyles } from '../../styles/global';

// Main declarations
const btService = new BluetoothService();
const escpos = new EscPosService();

const dataToPrint = base64.encode('Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste.');

export default function DevicesPage({ navigation }) {
    const { btConnection, setBtConnection } = useBtConnection();
    const [modalConnectVisible, setModalConnectVisible] = useState(false);


    function disconnectDevice() {
        btService.disconnect({ btConnection }).then(res => {
            setBtConnection(false);
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
        escpos.print({id: 'esc-pos', btConnection, dataToPrint});
    }

    return (
        <>
            <ScrollView contentContainerStyle={GlobalStyles.container}>

                {btConnection ? (
                    <View style={GlobalStyles.card}>
                        <Text>Nome: {btConnection ? btConnection.device.name : '---'}</Text>
                        <Text>MAC Address: {btConnection ? btConnection.device.id : '---'}</Text>
               
                        <Button
                            title="Imprimir QR-Code"
                            onPress={() => print()}
                        />
                    </View>
                ) : (
                    <View style={GlobalStyles.card}>
                        <Text>Nenhum dispositivo conectado!</Text>
                    </View>
                )}

            </ScrollView>

            <View style={GlobalStyles.footer}>
                {(!btConnection) && <Button
                    title="Conectar"
                    onPress={() => setModalConnectVisible(true)}
                />}
                {(btConnection) && (
                    <Button
                        title="Desconectar"
                        onPress={() => disconnectDevice()}
                        color="#d00"
                    />
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalConnectVisible && !btConnection}
                >
                    <ConnectBluetoothModal setVisible={setModalConnectVisible}/>
                </Modal>
            </View>
        </>
    );
}
