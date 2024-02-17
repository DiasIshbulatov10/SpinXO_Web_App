import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import {Button, Tab, TabView} from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {commonStyles, colorStyles} from '../assets/styles';
import '../utils/ignoreWarning';
import Constants from '../utils/constants';

// Images
const headerImg = require('../assets/images/Header.png');
const LogoImg = require('../assets/images/Logo.png');
const saveImg = require('../assets/images/Save.png');
const shareImg = require('../assets/images/Share.png');
const deleteImg = require('../assets/images/Trash.png');
const favoStarImg = require('../assets/images/Favo_Star.png');
const avatarImg = require('../assets/images/Avatar.png');
const clearImg = require('../assets/images/Clear.png');
const saveStarImg = require('../assets/images/SaveBtn_Star.png');

const FavoritesScreen = ({navigation, route}) => {

    const keyboardRef = useRef(Keyboard);

    const [sign, setSign] = useState(false);
    const [photo, setPhoto] = useState('');
    const [userID, setUserID] = useState('');
    const [favorites, setFavorites] = useState([]);

    const [username, setUserName] = useState('');
    
    // message status
    const [msgName, setMsgName] = useState('');
    const [msgType, setMsgType] = useState('');
    const [successMsg, setSuccessMsg] = useState(false);
    const [signMsg, setSignMsg] = useState(false);
    const [warningMsg, setWarningMsg] = useState(false);

    // Navigation route params status
    const [params, setParams] = useState(route.params);

    
    useEffect(() => {
        checkSignData();
    }, []);


    const checkSignData = async () => {
        const storagePhoto = await AsyncStorage.getItem('spinXOPhoto');
        const storageUID = await AsyncStorage.getItem('spinXOUID');
        
        if(storageUID != null) {
            setSign(true);
            setUserID(storageUID);
            setPhoto(storagePhoto);
            
            axios.get(`${Constants.getFavoNamesURL}?UserID=${storageUID}`)
            .then(response => {
                if(response.data) {
                    console.log(response.data);
                    setFavorites(response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        } else {
            console.log("sign Out=====")
            setSign(false);
            setUserID('');
            setPhoto('');
            setFavorites([]);
        }
    }

    if(params != route.params) {
        console.log("here===================")
        setParams(route.params);
        setFavorites([]);
        checkSignData();
    }

    const saveMsg = () => {
        keyboardRef.current.dismiss();

        if(sign == false) { 
            setSignMsg(true);

            setTimeout(() => {
                setSignMsg(false);
            }, 3000);

        } else {
            if(favorites.indexOf(username) > -1) {
                setWarningMsg(true);

                setTimeout(() => {
                    setWarningMsg(false);
                }, 3000);

            } else {
                saveToFavorite()
            }
        }
    }

    const saveToFavorite = () => {
        setMsgName(username);
        setMsgType('add');

        axios.get(`${Constants.saveFavoURL}?UserID=${userID}&name=${username}`)
        .then(response => {
            if(response.status == 200) {
                let list = favorites;
                list.unshift(username);
                setFavorites(list);
                setUserName('');

                setSuccessMsg(true);

                setTimeout(() => {
                    setSuccessMsg(false);
                    setMsgName('');
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }


    const deleteFavorite = (name) => {
        setMsgName(name);
        setMsgType('delete');
        axios.get(`${Constants.deleteFavoURL}?UserID=${userID}&name=${name}`)
        .then(response => {
            if(response.status == 200) {
                let list = favorites.filter(item => item !== name);
                setFavorites(list);

                setSuccessMsg(true);

                setTimeout(() => {
                    setSuccessMsg(false);
                    setMsgName('');
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }


    const clearName = () => {
        setUserName('');
    }


    return (
        <SafeAreaView style={commonStyles.SafeAreaView}>
            {/* Header */}
            <Image source={headerImg} resizeMode="cover" style={{width: '100%'}} />
            <TouchableOpacity style={[styles.logo, {position: 'absolute', top: 64, left: 18, overflow: 'hidden'}]} onPress={() => {navigation.navigate('MainTabs', { screen: 'Names'})}}>
                <Image source={LogoImg} resizeMode='cover' style={{width: '100%', height: '100%'}}/>
            </TouchableOpacity>
            <StatusBar
                barStyle={'light-content'}
                backgroundColor="transparent"
                translucent={true}
            />
            {
                photo == '' ? 
                    '' 
                : 
                    <TouchableOpacity style={[styles.avatar, {position: 'absolute', top: 56, right: 22, overflow: 'hidden'}]} onPress={() => {navigation.navigate('MainTabs', { screen: 'Account'})}}>
                        <Image source={{uri: photo}} resizeMode='cover' style={{width: '100%', height: '100%'}} borderRadius={50}/>
                    </TouchableOpacity>
            }

            {/* Favorite Title Section */}
            <View style={styles.titleSection}>
                <Text style={styles.titleText}>Favorites</Text>
                <TouchableOpacity>
                    <Image source={shareImg} />
                </TouchableOpacity>
            </View>

            {/* Search View */}
            <View style={styles.addName}>
                <View style={[styles.addNameView, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                    <TextInput value={username} onChangeText={(text) => {setUserName(text)}} style={styles.addNameText} placeholder='Add a Favorite Name' placeholderTextColor={colorStyles.inputPlaceholderColor}/>
                    <TouchableOpacity onPress={() => {clearName()}}>
                        {username == '' ? '' : <Image source={clearImg} /> }
                    </TouchableOpacity>
                </View>
                <TouchableOpacity disabled={username == '' ? true : false} onPress={() => {saveMsg()}}>
                    <Image source={saveImg} style={username == '' ? {opacity: 0.6} : ''}/>
                </TouchableOpacity>
            </View>

            <ScrollView >

                {/* FavoriteList Section */}
                <View style={styles.nameList}>
                    {
                        favorites.map((item, index) => {
                            return (
                                <View key={index} style={styles.nameItem}>
                                    <View style={styles.namePart}>
                                        <Image source={favoStarImg} />
                                        <Text style={styles.nameText}>
                                            {item.length > 22 ? item.substring(0, 22) + '...' : item}
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => {deleteFavorite(item)}}>
                                        <Image source={deleteImg} />
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    }
                </View>
            </ScrollView>

            {/* Message */}
            {
                successMsg ? 
                    <View style={[styles.messageBox, {backgroundColor: colorStyles.successMsgColor}]}>
                        <Image source={saveStarImg} />
                        <Text style={styles.messageText}><Text style={{fontWeight: '700'}}>{msgName}&nbsp;</Text>{msgType == 'add' ? 'save to favorites' : 'removed from Favorites'} </Text>
                    </View>
                :   ''
            }

            {
                signMsg ? 
                    <View style={[styles.messageBox, {backgroundColor: colorStyles.warningMsgColor}]}>
                        <Text style={styles.messageText}>Please Sign In with your account</Text>
                    </View>
                :   ''
            }

            {
                warningMsg ? 
                    <View style={[styles.messageBox, {backgroundColor: colorStyles.warningMsgColor}]}>
                        <Text style={styles.messageText}>{username} already exists in Favorites.</Text>
                    </View>
                :   ''
            }

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    titleSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 16,
        marginHorizontal: 16,
        marginBottom: 4,
        height: 48
    },
    titleText: {
        flex: 1,
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: '700',
        fontStyle: 'normal',
        color: colorStyles.screenTitleColor
    },
    addName: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 8,
        marginHorizontal: 16,
    },
    addNameView: {
        display: 'flex',
        flex: 1,
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
        gap: 8,
        borderRadius: 6,
        backgroundColor: colorStyles.searchBackColor,
        height: 69,
    },
    addNameText: {
        display: 'flex',
        flex: 1,
        backgroundColor: colorStyles.searchBackColor,
        height: 69,
        fontSize: 16,
        fontWeight: '700',
        color: colorStyles.searchTextColor,
    },
    nameList: {
        display: 'flex',
        marginHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginVertical: 16
    },
    nameItem: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        borderRadius: 10,
        backgroundColor: colorStyles.nameFavoColor,
        marginBottom: 8
    },
    namePart: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    nameText: {
        fontFamily: 'Arial',
        fontSize: 18,
        fontStyle: 'normal',
        color: colorStyles.nameFavoTextColor,
        fontWeight: '700'
    },
    avatar: {
        width: 56,
        height: 56,
        flexShrink: 0,
        borderRadius: 56,
        borderWidth: 3,
        borderColor: colorStyles.avatarBorderColor
    },
    logo: {
        width: 104,
        height: 40,
    },
    messageBox: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
        width: '90%',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 8,
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 5,
        elevation: 12,
        shadowColor: '#000',
        shadowOpacity: 0.5, 
        shadowRadius: 15,
        shadowOffset: { width: 16, height: 24 },
        gap: 8
    },
    messageText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 17,
        fontStyle: 'normal',
        lineHeight: 24
    },
});

export default FavoritesScreen;
