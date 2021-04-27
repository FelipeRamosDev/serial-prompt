/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Button,
    ActivityIndicator,
    ToastAndroid,
} from 'react-native';
// Services
import BluetoothService from '../../services/bluetooth-service';
// Icons
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// Contexts
import { useBtConnection } from '../../core/contexts/bt-connection';
// Styles
import { GlobalStyles } from '../../styles/global';

// Main declarations
const btService = new BluetoothService();

export default function ConnectBluetoothModal({ setVisible }) {
    const [ loading, setLoading ] = useState(false);
    // const [ searching, setSearching ] = useState(false);
    const [ devices, setDevices ] = useState([]);
    const { btConnection, setBtConnection } = useBtConnection();

    function scanClassicDevices(){
        setLoading(true);
        setDevices([]);

        btService.startScan().then(discovered=>{
            setDevices(discovered);
        }).catch(err=>{
            ToastAndroid.showWithGravity(
                err.message,
                ToastAndroid.LONG,
                ToastAndroid.CENTER
            );
        }).finally(()=>{
            setLoading(false);
        });
    }

    function connect({device}){
        btService.connect({device}).then(connected=>{
            setBtConnection(connected);
            setVisible(false);
        }).catch(err=>{
            ToastAndroid.showWithGravity(
                err.message,
                ToastAndroid.LONG,
                ToastAndroid.CENTER
            );
        });
    }

    // function stopScan(){

    // }

    /*-------------------------------------------------------------
        RENDER
    -------------------------------------------------------------*/
    return (
        <View style={GlobalStyles.modal1}>
            <View style={GlobalStyles.modalbox1}>
                <TouchableOpacity
                    onPress={() => setVisible(false)}
                    style={GlobalStyles.closeButton}
                >
                    <FontAwesome5 name="times" color="#333" size={25} />
                </TouchableOpacity>

                <ScrollView style={GlobalStyles.container}>
                    {devices.map((d, i) => {
                        return (
                            <TouchableOpacity key={i} style={{ marginVertical: 15, paddingHorizontal: 10 }} onPress={() => connect({ device: d })}>
                                <Text>Id: {d.id || 'Desconhecido'}</Text>
                                <Text>Name: {d.name || 'Desconhecido'}</Text>
                                <Text>Qualidade do sinal: {d.rssi || 'Deconhecido'}</Text>
                            </TouchableOpacity>
                        );
                    })}

                    {loading && <ActivityIndicator size="large" color="#ff8800" />}
                </ScrollView>

                {(!btConnection) && <Button
                    title="Buscar Classic"
                    onPress={() => scanClassicDevices()}
                />}
                {/* {(searching === null || searching) && <Button
                    title="Parar"
                    onPress={() => stopScan()}
                    color="#d00"
                />} */}
            </View>
        </View>
    );
}
