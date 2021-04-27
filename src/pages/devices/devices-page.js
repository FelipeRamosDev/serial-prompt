import React, { useState } from 'react';
import {
    Button,
    Alert,
    Modal,
    View,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';
// Components
import ConnectBLEModal from '../../components/modals/connect-ble';
import ConnectBTClassicModal from '../../components/modals/connect-bt-classic';
// Services
import BluetoothService from '../../services/bluetooth-service';
import BLEService from '../../services/ble-service';
import EscPosService from '../../services/escpos-service';
// Contexts
import { useBtConnection } from '../../core/contexts/bt-connection';
// Styles
import { GlobalStyles } from '../../styles/global';

// Main declarations
const btService = new BluetoothService();
const bleService = new BLEService();
const escpos = new EscPosService();

const dataToPrint = base64.encode('Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste.');

export default function DevicesPage({ navigation }) {
    const { btConnection, setBtConnection } = useBtConnection();
    const [modalConnectBLEVisible, setModalConnectBLEVisible] = useState(false);
    const [ modalConnectClassicVisible, setModalConnectClassicVisible ] = useState(false);
    const [ bluetoothHistory, setBluetoothHistory ] = useState([]);

    AsyncStorage.getItem('bluetooth-history', (err, result)=>{
        if (err){
            Alert.alert(
                'Historico',
                'Ocorreu um erro ao carregar o histórico de dispositivos bluetooth!',
                [
                    {
                        text: 'OK',
                    },
                ]
            );
        }

        setBluetoothHistory(JSON.parse(result));
    });

    function btConnect({device}){
        btService.connect({device}).then(connected=>{
            setBtConnection(connected);
        }).catch(err=>{
            ToastAndroid.showWithGravity(
                err.message,
                ToastAndroid.LONG,
                ToastAndroid.CENTER
            );
        });
    }

    function disconnectDevice() {
        if (btConnection) {
            if (btConnection.type === 'classic') {
                btConnection.device.disconnect().then(disconnected => {
                    if (disconnected) {
                        setBtConnection(false);

                        ToastAndroid.showWithGravity(
                            'O dispositivo foi desconectado ocm sucesso!',
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER
                        );
                    } else {
                        ToastAndroid.showWithGravity(
                            'O dispositivo não foi desconectado corretamente!',
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER
                        );
                    }
                }).catch(() => {
                    Alert.alert(
                        'Erro',
                        'Ocorreu um erro desconectar com o dispositivo!',
                        [
                            {
                                text: 'OK',
                            },
                        ]
                    );
                });
            } else if (btConnection.type === 'ble') {
                bleService.disconnect({ btConnection }).then(res => {
                    setBtConnection(false);
                }).catch(() => {
                    Alert.alert(
                        'Erro',
                        'Erro desconectar com o dispositivo!',
                        [
                            {
                                text: 'OK',
                            },
                        ]
                    );
                });
            }
        } else {
            ToastAndroid.showWithGravity(
                'O dispositivo já está desconectado!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        }
    }

    function sendCommand(){
        btService.sendCmd({
            device: btConnection.device,
            cmd: 'device=on;',
        }).then(res=>{
            console.log(res.message);
        }).catch((err)=>{
            ToastAndroid.showWithGravity(
                err.message,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        });
    }

    async function print() {
        escpos.print({ id: 'esc-pos', btConnection, dataToPrint });
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

                {(bluetoothHistory.length > 0) && (
                    <>
                        <Text>Dispositivos anteriores:</Text>
                        <View style={GlobalStyles.card}>
                            {
                                bluetoothHistory.map((h, i)=>{
                                    return (
                                        <TouchableOpacity key={i} onPress={()=>btConnect({device: h})}>
                                            <Text>Nome: {h.name || '---'}</Text>
                                            <Text>MAC Address: {h.address || h.id || '---'}</Text>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </View>
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
                        onPress={() => disconnectDevice()}
                        color="#d00"
                    />
                )}
                {(btConnection) && <Button
                    title="Comando"
                    onPress={() => sendCommand()}
                />}

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
        </>
    );
}
