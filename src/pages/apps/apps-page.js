import React from 'react';
import {
} from 'react-native';
// Components
import Header from '../../components/headers/connected-device/connected-device-header';
// Icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// Style components
import {
    Activity,
    RoundFlotButton,
} from '../../styles/main';
// Styles
import { defaultTheme } from '../../styles/theme';

export default function AppsPage({navigation}){
    return (
        <Activity>
            <Header />
            <RoundFlotButton>
                <MaterialIcons name="edit" color={defaultTheme.text[0]} size={25} />
            </RoundFlotButton>
        </Activity>
    );
}
