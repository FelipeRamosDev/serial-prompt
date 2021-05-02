/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
} from 'react-native';
// Controllers
import {
    scanBLEDevices,
    connect,
    stopScan,
} from './scan-ble-controllers';
// Icons
// Contexts
import { useBtConnection } from '../../../core/contexts/bt-connection';
// Styled components
import {
    MediumModalBox,
    DefaultModal,
    ScrollModal,
    P,
    DefaultButton,
    ItemListModal,
} from '../../../styles/main';
// Styles
import { defaultTheme } from '../../../styles/theme';

export default function ConnectBluetoothModal({ setVisible, setStatusbarColor }) {
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [devices, setDevices] = useState([]);
    const { setBtConnection } = useBtConnection();

    useEffect(() => {
        scanBLEDevices({ setLoading, setDevices, setSearching });
    }, []);

    useEffect(() => {
        if (searching) {
            setDevices([...devices, searching]);
        }
    }, [searching]);

    /*-------------------------------------------------------------
        RENDER
    -------------------------------------------------------------*/
    return (
        <DefaultModal>
            <MediumModalBox rounded="soft">

                <ScrollModal>
                    {devices.map((d, i) => {
                        return (
                            <ItemListModal
                                key={i}
                                rounded="soft"
                                color="#fff"
                                onPress={() => connect({ device: d, setBtConnection, setSearching, setVisible, setStatusbarColor })}
                            >
                                <P color="#111" size="1.1">{d.name || 'Desconhecido'}</P>
                                <P color="#777" size="0.8">Id: {d.id || 'Desconhecido'}</P>
                                <P color="#777" size="0.8">Qualidade do sinal: {d.rssi || 'Deconhecido'}</P>
                            </ItemListModal>
                        );
                    })}

                    {loading && <ActivityIndicator size="large" color={defaultTheme.contrast} />}
                </ScrollModal>

                {(
                    <DefaultButton
                        onPress={() => stopScan({ setSearching, setLoading, setVisible })}
                        color={'danger'}
                    >
                        <P>Cancelar</P>
                    </DefaultButton>
                )}
            </MediumModalBox>
        </DefaultModal>
    );
}
