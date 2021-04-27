import {
    StyleSheet,
} from 'react-native';

export const GlobalStyles = StyleSheet.create({
    main: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        padding: 0,
        margin: 0,
    },
    container: {
        padding: 10,
    },
    footer: {
        width: '100%',
        padding: 0,
        margin: 0,
    },
    modal1:{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#33333388',
    },
    modalbox1: {
        width: '80%',
        height: '70%',
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 10,
        overflow: 'hidden',
    },
    card: {
        padding: 20,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 1,
        shadowRadius: 5,
    },
    closeButton: {
        display: 'flex',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        paddingTop: 6,
    },
});
