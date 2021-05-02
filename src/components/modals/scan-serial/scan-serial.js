import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
} from 'react-native';
// Controllers
import {
    scanClassicDevices,
    connect,
    stopScan,
} from './scan-serial-controllers';
// Icons
// Contexts
import { useBtConnection } from '../../../core/contexts/bt-connection';
// Styled components
import {
    DefaultButton,
    P,
    DefaultModal,
    MediumModalBox,
    ScrollModal,
    ItemListModal,
} from '../../../styles/main';
// Styles
import { defaultTheme } from '../../../styles/theme';

export default function ConnectBluetoothModal({ setVisible }) {
    const [loading, setLoading] = useState(false);
    // const [ searching, setSearching ] = useState(false);
    const [devices, setDevices] = useState([]);
    const { setBtConnection } = useBtConnection();

    useEffect(() => {
        scanClassicDevices({ setLoading, setDevices });
    }, []);

    /*-------------------------------------------------------------
        RENDER
    -------------------------------------------------------------*/
    return (
        <DefaultModal>
            <MediumModalBox
                rounded="soft"
            >

                <ScrollModal>
                    {devices.map((d, i) => {
                        return (
                            <ItemListModal
                                key={i}
                                rounded="soft"
                                color="#fff"
                                onPress={() => connect({ device: d, setBtConnection, setVisible })}
                            >
                                <P color="#111" size="1.1">{d.name || 'Desconhecido'}</P>
                                <P color="#777" size="0.8">Id: {d.id || 'Desconhecido'}</P>
                                <P color="#777" size="0.8">Qualidade do sinal: {d.rssi || 'Deconhecido'}</P>
                            </ItemListModal>
                        );
                    })}

                    {loading && <ActivityIndicator size="large" color={defaultTheme.contrast} />}
                </ScrollModal>

                <DefaultButton
                    color="danger"
                    onPress={() => stopScan({ setVisible })}
                >
                    <P>Cancelar</P>
                </DefaultButton>
            </MediumModalBox>
        </DefaultModal>
    );
}
