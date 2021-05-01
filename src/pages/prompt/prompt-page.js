import React from 'react';
import { useState } from 'react';
import {
    View,
    Text,
    Button,
    ScrollView,
    TextInput,
} from 'react-native';
// Controlers
import {
    handleInputCMD,
    sendCMD,
} from './prompt-controllers';
// Contexts
import { useBtConnection } from '../../core/contexts/bt-connection';
// Styles
import { GlobalStyles } from '../../styles/global';
import { PromptStyles } from './prompt-styles';

export default function PromptPage({ navigation }) {
    const [historyCMD, setHistoryCMD] = useState([]);
    const [currCMD, setCurrCMD] = useState('');
    const { btConnection } = useBtConnection();

    return (
        <>
            <ScrollView contentContainerStyle={PromptStyles.screen}>
                {historyCMD.map((item, i) => <Text key={i} style={PromptStyles.text}>{'>'} {item}</Text>)}

                <TextInput
                    style={PromptStyles.input}
                    value={currCMD}
                    onChangeText={(ev) => handleInputCMD(ev, setCurrCMD)}
                    placeholder="Insira o comando aqui"
                    placeholderTextColor="#777"
                />
            </ScrollView>
            <View style={GlobalStyles.footer}>
                <Button
                    title="Enviar"
                    onPress={() => sendCMD({btConnection, historyCMD, setHistoryCMD, currCMD, setCurrCMD})}
                />
            </View>
        </>
    );
}

