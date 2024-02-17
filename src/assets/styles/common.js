import {
    StyleSheet,
} from 'react-native';

export default StyleSheet.create({
    SafeAreaView: {
        flex: 1, 
        backgroundColor: 'white',
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    },
    titleArea: {
        flexDirection: 'row', 
        alignContent: 'space-between', 
        width: '100%', 
    },
});
    