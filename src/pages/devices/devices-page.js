/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
    Modal,
    View,
    ScrollView,
} from 'react-native';
import base64 from 'react-native-base64';
// Functions
import {
    btConnect,
    disconnectDevice,
    getHistory,
    print,
    openConnectModal,
} from './devices-controllers';
// Components
import ConnectBLEModal from '../../components/modals/scan-ble/scan-ble';
import ConnectBTClassicModal from '../../components/modals/scan-serial/scan-serial';
// Styled components
import {
    Activity,
    Toolbar,
    ToolbarItem,
    P,
    Label,
    Card,
    CardP,
    ItemListModal,
    DefaultButton,
    Footer,
} from '../../styles/main';
// Components
import Header from '../../components/headers/connected-device/connected-device-header';
// Contexts
import { useBtConnection } from '../../core/contexts/bt-connection';
// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
// Styles
import { GlobalStyles } from '../../styles/global';
import { defaultTheme } from '../../styles/theme';
import { useEffect } from 'react';

const dataToPrint = base64.encode('Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste. Esse é um texto de teste.');

export default function DevicesPage({ navigation }) {
    const { btConnection, setBtConnection } = useBtConnection();
    const [ modalConnectBLEVisible, setModalConnectBLEVisible ] = useState(false);
    const [ modalConnectClassicVisible, setModalConnectClassicVisible ] = useState(false);
    const [ bluetoothHistory, setBluetoothHistory ] = useState([]);
    const [ statusbarColor, setStatusbarColor ] = useState(defaultTheme.secondary);

    // Get the history of devices connected
    useEffect(()=>{
        getHistory({ setBluetoothHistory });
    },[]);

    return (
        <Activity>
            <Header />
            
            <ScrollView contentContainerStyle={GlobalStyles.container}>

                {btConnection && (
                    <Card>
                        <DefaultButton
                            onPress={() => print({btConnection, dataToPrint})}
                            rounded="soft"
                        >
                            <P>Imprimir QR-Code</P>
                        </DefaultButton>
                    </Card>
                )}

                {(!btConnection && bluetoothHistory && bluetoothHistory.length > 0) && (
                    <>
                        <Label>Dispositivos anteriores:</Label>
                        {
                            bluetoothHistory.map((h, i)=>{
                                return (
                                    <ItemListModal
                                        key={i}
                                        color="secondary"
                                        rounded="soft"
                                        onPress={()=>btConnect({device: h, setBtConnection})}
                                    >
                                        <Toolbar>
                                            <ToolbarItem>
                                                <Ionicons name="bluetooth" color={defaultTheme.primary} size={30} style={{ marginRight: 10 }} />
                                            </ToolbarItem>
                                            <ToolbarItem>
                                                <CardP>Nome: {h.name || '---'}</CardP>
                                                <CardP>MAC Address: {h.address || h.id || '---'}</CardP>
                                            </ToolbarItem>
                                        </Toolbar>
                                    </ItemListModal>
                                );
                            })
                        }
                    </>
                )}

            </ScrollView>

            <Footer>
                {(!btConnection) ? (
                    <DefaultButton
                        onPress={() => openConnectModal({setModalConnectBLEVisible, setModalConnectClassicVisible})}
                    >
                        <Ionicons name="bluetooth" color={defaultTheme.text[0]} size={15} style={{ marginRight: 2 }} />
                        <P>BUSCAR</P>
                    </DefaultButton>
                ) : (
                    <DefaultButton
                        onPress={() => disconnectDevice({ btConnection, setBtConnection, setStatusbarColor })}
                        color={'danger'}
                    >
                        <P>DESCONECTAR</P>
                    </DefaultButton>
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalConnectClassicVisible && !btConnection}
                >
                    <ConnectBTClassicModal setVisible={setModalConnectClassicVisible} setStatusbarColor={setStatusbarColor} />
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalConnectBLEVisible && !btConnection}
                >
                    <ConnectBLEModal setVisible={setModalConnectBLEVisible} setStatusbarColor={setStatusbarColor} />
                </Modal>
            </Footer>
        </Activity>
    );
}
