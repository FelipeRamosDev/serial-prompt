import React from 'react';
import { useState } from 'react';
import {
    View,
    TextInput,
} from 'react-native';
// Controlers
import {
    handleInputCMD,
    sendCMD,
} from './prompt-controllers';
// Contexts
import { useBtConnection } from '../../core/contexts/bt-connection';
// Components
import Header from '../../components/headers/connected-device/connected-device-header';
// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
// Style components
import {
    Activity,
    DefaultButton,
    Footer,
    P,
    RoundFlotButton,
} from '../../styles/main';
import {
    Prompt,
    PromptP,
    ContainerPrompt,
    PromptInput,
} from './prompt-styles';
// Styles
import { defaultTheme } from '../../styles/theme';

export default function PromptPage({ navigation }) {
    const [historyCMD, setHistoryCMD] = useState([]);
    const [currCMD, setCurrCMD] = useState('');
    const { btConnection } = useBtConnection();
  
    return (
        <Activity>
            <Header />
                <Prompt>
                    {historyCMD.map((item, i) => <PromptP key={i}>{'>'} {item}</PromptP>)}

                    <PromptInput
                        value={currCMD}
                        onChangeText={(ev) => handleInputCMD(ev, setCurrCMD)}
                        placeholder=">> Insira um comando aqui"
                        placeholderTextColor="#777"
                    />
                </Prompt>
            <Footer>
                <RoundFlotButton
                    onPress={() => sendCMD({btConnection, historyCMD, setHistoryCMD, currCMD, setCurrCMD})}
                >
                    <Ionicons name="send" color={defaultTheme.text[0]} size={25} />
                </RoundFlotButton>
            </Footer>
        </Activity>
    );
}

