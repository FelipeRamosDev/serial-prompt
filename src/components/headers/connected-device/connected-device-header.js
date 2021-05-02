/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
    StatusBar,
} from 'react-native';
// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
// Styled components
import {
    Header,
    Toolbar,
    ToolbarItem,
    CardP,
    P,
} from '../../../styles/main';
// Contexts
import { useBtConnection } from '../../../core/contexts/bt-connection';
// Styles
import { defaultTheme } from '../../../styles/theme';

export default function ConnectedDeviceHeader(){
    const { btConnection } = useBtConnection();
    
    if (btConnection){
        return (
            <>
                <StatusBar
                    animated={true}
                    backgroundColor={defaultTheme.contrast}
                />
                <Header color="contrast">
                    <Toolbar>
                        <ToolbarItem>
                            <Ionicons name="bluetooth" color={defaultTheme.text[0]} size={30} style={{ marginRight: 10 }} />
                        </ToolbarItem>
                        <ToolbarItem>
                            <CardP>Nome: {btConnection ? btConnection.device.name : '---'}</CardP>
                            <CardP>MAC Address: {btConnection ? btConnection.device.id : '---'}</CardP>
                        </ToolbarItem>
                    </Toolbar>
                </Header>
            </>
        );
    } else {
        return ( 
            <>
                <StatusBar
                    animated={true}
                    backgroundColor={defaultTheme.secondary}
                />
                <Header color="secondary">
                    <Toolbar>
                        <ToolbarItem>
                            <Ionicons name="bluetooth" color={defaultTheme.text[0]} size={30} style={{ marginRight: 10 }} />
                        </ToolbarItem>
                        <ToolbarItem>
                            <P>Nenhum dispositivo conectado!</P>
                        </ToolbarItem>
                    </Toolbar>
                </Header>
            </>
        );
    }
}
