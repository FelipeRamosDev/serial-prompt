import React from 'react';
import { useState } from 'react';
import {
    View,
    Text,
    Button,
    ScrollView,
    TextInput,
    ToastAndroid,
    Alert,
} from 'react-native';
// Services
import BluetoothServie from '../../services/bluetooth-service';
// Contexts
import { useBtConnection } from '../../core/contexts/bt-connection';
// Styles
import { GlobalStyles } from '../../styles/global';
import { PromptStyles } from './prompt-styles';

// Main declarations
const btService = new BluetoothServie();

export default function PromptPage({ navigation }) {
    const [historyCMD, setHistoryCMD] = useState([]);
    const [currCMD, setCurrCMD] = useState('');
    const { btConnection } = useBtConnection();

    function handleInputCMD(ev) {
        setCurrCMD(ev);
    }

    function sendCMD() {
        if (btConnection && btConnection.type === 'classic'){
            btService.sendCmd({ device: btConnection.device, cmd: currCMD }).then(res => {
                setHistoryCMD([...historyCMD, currCMD, res.message]);
                setCurrCMD('');
            }).catch(err => {
                ToastAndroid.show(
                    err.message,
                    ToastAndroid.LONG
                );
            });
        } else {
            Alert.alert(
                'Erro',
                'Você precisa estar conectado a um dispositivo bluetooth serial para enviar comandos!',
                [{ text: 'OK'}]
            );
        }
    }

    return (
        <>
            <ScrollView contentContainerStyle={PromptStyles.screen}>
                {historyCMD.map((item, i) => <Text key={i} style={PromptStyles.text}>{'>'} {item}</Text>)}

                <TextInput
                    style={PromptStyles.input}
                    value={currCMD}
                    onChangeText={(ev) => handleInputCMD(ev)}
                    placeholder="Insira o comando aqui"
                    placeholderTextColor="#777"
                />
            </ScrollView>
            <View style={GlobalStyles.footer}>
                <Button
                    title="Enviar"
                    onPress={() => sendCMD()}
                />
            </View>
        </>
    );
}

