import React, {useEffect, useRef, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Button, Tab, TabView} from 'react-native-elements';

import {commonStyles, colorStyles} from '../assets/styles';
import '../utils/ignoreWarning';
import Constants from '../utils/constants';

// Images
const spinImg = require('../assets/images/Spin_Btn.png');
const closeImg = require('../assets/images/Close.png');
const clearImg = require('../assets/images/Clear.png');

const RefineScreen = ({navigation, route}) => {
    console.log(route.params)
    const [username, setUsername] = useState('');
    const [whatLike, setWhatLike] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [thingLike, setThingLike] = useState('');
    const [words, setWords] = useState('');
    const [numbers, setNumbers] = useState('');


    const [params, setParams] = useState(route.params)

    if(params != route.params) {
        setParams(route.params)
    }

    useEffect(() => {
        setUsername(route.params.username)
        
        setHobbies(route.params.hobbies ? route.params.hobbies : '')
        setThingLike(route.params.thingLike ? route.params.thingLike : '')
        setWords(route.params.words ? route.params.words : '')
        setNumbers(route.params.numbers ? route.params.numbers : '')
        setWhatLike(route.params.whatLike ? route.params.whatLike : '')
    }, [params])

    const clearUsername = () => {
        setUsername('');
    }

    const clearWhatLike = () => {
        setWhatLike('');
    }

    const clearHobbies = () => {
        setHobbies('');
    }

    const clearThingLike = () => {
        setThingLike('');
    }

    const clearWords = () => {
        setWords('');
    }

    const clearNumbers = () => {
        setNumbers('');
    }

    return (
        <>
            <StatusBar
                barStyle={'light-content'}
                backgroundColor={colorStyles.statusBarColor}
            />

            <SafeAreaView style={commonStyles.SafeAreaView}>

                {/* Header */}
                <View style={styles.headerPart}>
                    <Text style={styles.titleText}>Refine</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Names', params: {refine: {}} })}>
                        <Image source={closeImg}/>
                    </TouchableOpacity>
                </View>

                <ScrollView >
                    {/* Input Parts */}
                    <View style={styles.inputParts}>
                        {/* Input Block */}
                        <View style={styles.inputBlock}>
                            <Text style={styles.inputLabel}>Name or nickname?</Text>
                            <View style={[styles.inputField, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                                <TextInput value={username} onChangeText={(text) => setUsername(text)} style={styles.inputText}></TextInput>
                                <TouchableOpacity onPress={() => {clearUsername()}}>
                                    {username == '' ? '' : <Image source={clearImg} /> }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Input Block */}
                        <View style={styles.inputBlock}>
                            <Text style={styles.inputLabel}>What are you like?</Text>
                            <View style={[styles.inputField, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                                <TextInput value={whatLike} onChangeText={(text) => setWhatLike(text)} style={styles.inputText}></TextInput>
                                <TouchableOpacity onPress={() => {clearWhatLike()}}>
                                    {whatLike == '' ? '' : <Image source={clearImg} /> }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Input Block */}
                        <View style={styles.inputBlock}>
                            <Text style={styles.inputLabel}>Hobbies?</Text>
                            <View style={[styles.inputField, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                                <TextInput value={hobbies} onChangeText={(text) => setHobbies(text)} style={styles.inputText}></TextInput>
                                <TouchableOpacity onPress={() => {clearHobbies()}}>
                                    {hobbies == '' ? '' : <Image source={clearImg} /> }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Input Block */}
                        <View style={styles.inputBlock}>
                            <Text style={styles.inputLabel}>Things you like?</Text>
                            <View style={[styles.inputField, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                                <TextInput value={thingLike} onChangeText={(text) => setThingLike(text)} style={styles.inputText}></TextInput>
                                <TouchableOpacity onPress={() => {clearThingLike()}}>
                                    {thingLike == '' ? '' : <Image source={clearImg} /> }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Input Block */}
                        <View style={styles.inputBlock}>
                            <Text style={styles.inputLabel}>Important Words?</Text>
                            <View style={[styles.inputField, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                                <TextInput value={words} onChangeText={(text) => setWords(text)} style={styles.inputText}></TextInput>
                                <TouchableOpacity onPress={() => {clearWords()}}>
                                    {words == '' ? '' : <Image source={clearImg} /> }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Input Block */}
                        <View style={styles.inputBlock}>
                            <Text style={styles.inputLabel}>Numbers?</Text>
                            <View style={[styles.inputField, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                                <TextInput value={numbers} onChangeText={(text) => setNumbers(text)} style={styles.inputText}></TextInput>
                                <TouchableOpacity onPress={() => {clearNumbers()}}>
                                    {numbers == '' ? '' : <Image source={clearImg} /> }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Spin Buntton */}
                    <View style={styles.spinBtn}>
                        <TouchableOpacity 
                            onPress={() => 
                                navigation.navigate('MainTabs', { screen: 'Names', params: {refine: {
                                    username: username,
                                    whatLike: whatLike,
                                    hobbies: hobbies,
                                    thingLike: thingLike,
                                    words: words,
                                    numbers: numbers
                                }} })
                            }
                        >
                            <Image source={spinImg} resizeMode='cover' style={{width: '100%'}} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    headerPart: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        padding: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingBottom: 24,
        backgroundColor: colorStyles.headerBackColor
    },
    titleText: {
        color: 'white',
        fontFamily: 'Arial',
        fontSize: 24,
        fontStyle: 'normal',
        fontWeight: '700',
    },
    inputParts: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12,
        margin: 16
    },
    inputBlock: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
        alignSelf: 'stretch',

    },
    inputLabel: {
        alignSelf: 'stretch',
        color: 'black',
        fontFamily: 'Arial',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 24
    },
    inputField: {
        display: 'flex',
        height: 48,
        paddingHorizontal: 16,
        alignItems: 'center',
        alignSelf: 'stretch',
        gap: 8,
        borderRadius: 6,
        borderWidth: 1, 
        borderColor: colorStyles.refineInputBorderColor
    },
    inputText: {
        display: 'flex',
        flex: 1,
        height: 46,
        alignItems: 'center',
    },
    spinBtn: {
        marginTop: 10,
        marginHorizontal: 16,
        marginBottom: 10
    }
});

export default RefineScreen;
