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
  Icon
} from 'react-native';

import { FAB } from 'react-native-elements'

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {commonStyles, colorStyles} from '../assets/styles';
import '../utils/ignoreWarning';
import Constants from '../utils/constants';

// Images
const headerImg = require('../assets/images/Header.png');
const LogoImg = require('../assets/images/Logo.png');
const checkImg = require('../assets/images/Check.png');
const favoStarImg = require('../assets/images/Favo_Star.png');
const starImg = require('../assets/images/Star.png');
const youtubeImg = require('../assets/images/Youtube.png');
const redditImg = require('../assets/images/Reddit.png');
const instagramImg = require('../assets/images/Instagram.png');
const websiteImg = require('../assets/images/Website.png');
const clearImg = require('../assets/images/Clear.png');
const avatarImg = require('../assets/images/Avatar.png');
const saveStarImg = require('../assets/images/SaveBtn_Star.png');

const AvailabilityScreen = ({navigation, route}) => {
    const keyboardRef = useRef(Keyboard);

    const [name, setName] = useState('');
    const [favo, setFavo] = useState(false);
    const [checkName, setCheckName] = useState('');
    const [checkSites, setCheckSites] = useState([]);
    const [availability, setAvailability] = useState([]);

    const [loading, setLoading] = useState(false);

    const [sign, setSign] = useState(false);
    const [photo, setPhoto] = useState('');
    const [userID, setUserID] = useState('');
    const [favorites, setFavorites] = useState([]);

    // message status
    const [successMsg, setSuccessMsg] = useState(false);
    const [warningMsg, setWarningMsg] = useState(false);

    // Navigation route params status
    const [params, setParams] = useState(route.params);


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
                    setFavorites(response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        } else {
            setSign(false);
            setUserID('');
            setPhoto('');
            setFavorites([]);
        }
    }

    const initialState = () => {
        setName('');
        setCheckName('');
        setFavo(false);
        setAvailability([]);
    }

    useEffect(() => {
        axios.get(`${Constants.SiteDataServiceURL}`)
        .then(response => {
            if(response.data) {
                const siteData = response.data.Sites;
                let checkList = [];
                siteData.map(item => {
                    if(item.HasAvailabilityChecking == true) {
                        checkList.push(item.Name)
                    }
                })
                
                setCheckSites(checkList);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

        checkSignData();
        initialState();

    }, []);


    if(params != route.params) {
        setParams(route.params);
        checkSignData();
        initialState();
    }


    const checkAvailable = async(username) => {
        keyboardRef.current.dismiss();

        setCheckName(username);
        setLoading(true);

        let list = [];
        for (const item of checkSites) {
            console.log(item);
            const response = await axios.post(`${Constants.SiteCheckAvailableURL}`, {name: username, site: item, languageCode: 'en'});
            if(response.data.d) {
                list.push(response.data.d.includes('Available') ? true : false);
            }
        }
        
        setLoading(false);
        setAvailability(list);
    }

    const checkFavo = (username) => {
        console.log(favorites);
        if(favorites.indexOf(username) > -1) {
            setFavo(true);
        } else {
            setFavo(false);
        }
    }

    const saveFavo = () => {
        if(sign == false) {
            setWarningMsg(true);

            setTimeout(() => {
                setWarningMsg(false);
            }, 3000);
        } else {
            keyboardRef.current.dismiss();

            if(favo == true) {
                deleteFromFavorite()
            } else {
                saveToFavorite()
            }
        }
    }

    const saveToFavorite = () => {
        axios.get(`${Constants.saveFavoURL}?UserID=${userID}&name=${checkName}`)
        .then(response => {
            if(response.status == 200) {
                let list = favorites;
                list.unshift(checkName);
                setFavorites(list);
                setFavo(true);

                setSuccessMsg(true);

                setTimeout(() => {
                    setSuccessMsg(false);
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const deleteFromFavorite = () => {
        axios.get(`${Constants.deleteFavoURL}?UserID=${userID}&name=${checkName}`)
        .then(response => {
            if(response.status == 200) {
                let list = favorites.filter(item => item !== checkName);
                setFavorites(list);

                setFavo(false);

                setSuccessMsg(true);

                setTimeout(() => {
                    setSuccessMsg(false);
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const clearName = () => {
        setName('');
        setCheckName('');
        setAvailability([]);
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
            <Text style={styles.titleText}>Chek Availability</Text>
        </View>

        {/* Search View */}
        <View style={styles.checkName}>
            <View style={[styles.checkNameView, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                <TextInput value={name} onChangeText={(text) => {setName(text); setCheckName(text); checkFavo(text); setAvailability([]);}} style={styles.checkNameText} placeholder='Enter a Name To Chek' placeholderTextColor={colorStyles.inputPlaceholderColor}/>
                <TouchableOpacity onPress={() => {clearName()}}>
                    {name == '' ? '' : <Image source={clearImg} /> }
                </TouchableOpacity>
            </View>
            <TouchableOpacity disabled={name == '' ? true : false} onPress={() => {checkAvailable(name)}}>
                <Image source={checkImg} style={name == '' ? {opacity: 0.6} : ''}/>
            </TouchableOpacity>
        </View>

        {/* Name Section */}
        {
            name == '' ? '' :
            <>
                <View style={styles.nameSection}>
                    <Text style={styles.favoriteName}>{checkName}</Text>
                    {
                        checkName == '' ? 
                            ''
                        :
                            <TouchableOpacity onPress={() => {saveFavo()}}>
                                <View style={styles.saveButton}>
                                    <Text style={{fontSize: 16, color: colorStyles.nameTextColor}}>{favo ? 'Saved' : 'Save'}</Text>
                                    <Image source={favo ? favoStarImg : starImg} />
                                </View>
                            </TouchableOpacity>
                    }
                </View>

                <ScrollView>

                    {/* AvailableList Section */}
                    <View style={styles.availableList}>
                        {
                            checkSites.map((item, index) => {
                                return (
                                    <View key={index} style={styles.availableItem}>
                                        <View style={styles.availablePart}>
                                            <Image source={item == 'Youtube' ? youtubeImg : item == 'Reddit' ? redditImg : item == 'Instagram' ? instagramImg : websiteImg} width={32} height={32}/>
                                            <Text style={styles.nameText}>
                                                {item}
                                            </Text>
                                        </View>
                                        {
                                            loading ?
                                                <View style={[styles.availableIconPart, {borderColor: colorStyles.searchTextColor}]}>
                                                    <Text style={[styles.availableIconText, {color: colorStyles.searchTextColor}]}>Checking</Text>
                                                </View>
                                            : availability.length == 0 ? 
                                                <View style={[styles.availableIconPart, {borderColor: colorStyles.searchTextColor}]}>
                                                    <Text style={[styles.availableIconText, {color: colorStyles.searchTextColor}]}>Check</Text>
                                                </View>
                                            :
                                                <View style={[styles.availableIconPart, availability[index] ? {borderColor: colorStyles.availableColor}: {borderColor: 'red'}]}>
                                                    <Text style={[styles.availableIconText, availability[index] ? {color: colorStyles.availableColor}: {color: 'red'}]}>{availability[index] ? 'Available' : 'Taken'}</Text>
                                                </View>
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>

                </ScrollView>
            </>
        }


        {/* Message */}
        {
            successMsg ? 
                <View style={[styles.messageBox, {backgroundColor: colorStyles.successMsgColor}]}>
                    <Image source={saveStarImg} />
                    <Text style={styles.messageText}><Text style={{fontWeight: '700'}}>{checkName}&nbsp;</Text>{favo ? 'save to favorites' : 'removed from Favorites'} </Text>
                </View>
            :   ''
        }

        {
            warningMsg ? 
                <View style={[styles.messageBox, {backgroundColor: colorStyles.warningMsgColor}]}>
                    <Text style={styles.messageText}>Please Sign In with your account</Text>
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
        marginTop: 16,
        flex: 1,
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: '700',
        fontStyle: 'normal',
        color: colorStyles.screenTitleColor
    },
    checkName: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        marginHorizontal: 16,
        gap: 8
    },
    checkNameView: {
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
    checkNameText: {
        display: 'flex',
        flex: 1,
        backgroundColor: colorStyles.searchBackColor,
        height: 69,
        fontSize: 16,
        fontWeight: '700',
        color: colorStyles.searchTextColor,
    },
    nameSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginVertical: 12,
        marginHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colorStyles.bottomDividerColor
    },
    favoriteName: {
        fontFamily: 'Arial',
        fontSize: 23,
        fontWeight: '700',
        fontStyle: 'normal',
        color: 'black',
        lineHeight: 32,
        flex: 1
    },
    availableList: {
        display: 'flex',
        marginHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    availableItem: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginBottom: 20
    },
    availablePart: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    nameText: {
        fontFamily: 'Arial',
        fontSize: 16,
        fontStyle: 'normal',
        color: colorStyles.nameTextColor,
        fontWeight: '700'
    },
    availableIconPart: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        borderWidth: 1,
    },
    availableIconText: {
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 16
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
    saveButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 16,
        paddingRight: 8,
        paddingVertical: 3,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: colorStyles.refineInputBorderColor
    }

});

export default AvailabilityScreen;
