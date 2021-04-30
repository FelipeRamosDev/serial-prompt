import {
    StyleSheet,
} from 'react-native';

export const PromptStyles = StyleSheet.create({
    main: {
        padding: 10,
        width: '100%',
        height: '100%',
    },
    screen: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: '#111',
        height: '100%',
        padding: 10,
        overflow: 'scroll',
    },
    text: {
        color: '#0d0',
        fontSize: 18,
    },
    input: {
        padding: 0,
        margin: 0,
        color: '#0d0',
        fontSize: 18,
    },
});
