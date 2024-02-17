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
  Platform,
  Alert
} from 'react-native';
import { Dialog } from 'react-native-elements';

import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import {
    AccessToken,
    AuthenticationToken,
    LoginManager,
    Settings,
    Profile 
} from 'react-native-fbsdk-next';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid'

import {commonStyles, colorStyles} from '../assets/styles';
import '../utils/ignoreWarning';
import Constants from '../utils/constants';

// Images
const headerImg = require('../assets/images/Header.png');
const LogoImg = require('../assets/images/Logo.png');
const googleImg = require('../assets/images/Google.png');
const facebookImg = require('../assets/images/Facebook.png');
const appleImg = require('../assets/images/Apple.png');
const avatarImg = require('../assets/images/Avatar.png');
const signOutImg = require('../assets/images/Signout.png');


const AccountScreen = ({navigation}) => {
    const [photo, setPhoto] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sign, setSign] = useState(false);
    const [signType, setSignType] = useState('');
    const [alert, setAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const checkSignData = async () => {
        console.log('check sign here');
        const storageName = await AsyncStorage.getItem('spinXOName');
        const storageEmail = await AsyncStorage.getItem('spinXOEmail');
        const storagePhoto = await AsyncStorage.getItem('spinXOPhoto');
        const storageType = await AsyncStorage.getItem('spinXOSignType');

        console.log(storageType);
        if(storageType != null) {
            setSign(true);
            setSignType(storageType);
            setName(storageName);
            setEmail(storageEmail);
            setPhoto(storagePhoto);
        }
    }

    useEffect(()=>{
        GoogleSignin.configure({
            webClientId: Constants.googleWebClientId,
            offlineAccess: true
        });

        if(Platform.OS == 'ios') {
            const rawNonce = uuid();
            const state = uuid();

            appleAuthAndroid.configure({
                clientId: 'com.example.client-android',
                redirectUri: "https://example.com/auth/callback",
                responseType: appleAuthAndroid.ResponseType.ALL,
                scope: appleAuthAndroid.Scope.ALL,
                nonce: rawNonce,
                state
            })
        }

        checkSignData()

        // Settings.setAppID('167924513224886');
        // Settings.initializeSDK();
    },[])


    const errorAlert = (type) => {
        Alert.alert(
            'Error',
            type == 'google' ? 'Some Error is happened on Google Sign In.' 
            : type == 'fb' ? 'Some Error is happened on Facebook Sign In.'
            : 'Some Error is happened on Apple Sign In.',
            [
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
            ],
        );
    }

    const siteUserLogin = (profile, type) => {
        const userEmail = profile.email;

        axios.get(`${Constants.getUserInfoURL}?email=${userEmail}`)
        .then(async response => {
            const resData = response.data;

            if(resData.HasError == true) {
                setErrorMsg(resData.ErrorMessage);
                setAlert(true);

                setTimeout(() => {
                    setAlert(false);
                }, 5000);

            } else {
                try {
                    await AsyncStorage.setItem('spinXOPhoto', String(profile.photo));
                    await AsyncStorage.setItem('spinXOEmail', String(profile.email));
                    await AsyncStorage.setItem('spinXOUID', String(resData.UID));
                    await AsyncStorage.setItem('spinXOName', String(profile.name));
                    await AsyncStorage.setItem('spinXOSignType', String(type));

                    console.log('Data stored successfully.');

                    if(resData.IsNew == true) {
                        Alert.alert(
                            'Account',
                            'Your new account is created successfully.',
                            [
                              {
                                text: 'Cancel',
                                onPress: () => {},
                                style: 'cancel',
                              },
                            ],
                        );
                    } 
    
                    setPhoto(profile.photo);
                    setName(profile.name);
                    setEmail(profile.email);
                    setSign(true);
                    setSignType(type);

                } catch (error) {
                    console.log('Error storing data:', error);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const googleSignin = async () => {
        try {
            await GoogleSignin.hasPlayServices();

            const userInfo = await GoogleSignin.signIn();

            siteUserLogin(userInfo.user, 'google');

        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                errorAlert('google');
                console.log(error)
            } else if (error.code === statusCodes.IN_PROGRESS) {
                errorAlert('google');
                console.log(error)
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                errorAlert('google');
                console.log(error)
            } else {
                errorAlert('google');
                console.log(error)
            }
        }
    }

    const applesignin = async () => {
        try {
            if(appleAuthAndroid.isSupported) {
                console.log("here");
                const userInfo = await appleAuthAndroid.signIn();
                console.log(userInfo);
            }
        } catch (error) {
            if (error && error.message) {
                switch (error.message) {
                  case appleAuthAndroid.Error.NOT_CONFIGURED:
                    console.log("appleAuthAndroid not configured yet.");
                    break;
                  case appleAuthAndroid.Error.SIGNIN_FAILED:
                    console.log("Apple signin failed.");
                    break;
                  case appleAuthAndroid.Error.SIGNIN_CANCELLED:
                    console.log("User cancelled Apple signin.");
                    break;
                  default:
                    break;
                }
            }
        }
    }

    const facebookSignin = async () => {
        try {
            // Login the User and get his public profile and email id.
            const result = await LoginManager.logInWithPermissions([
              'public_profile',
              'email',
            ]);

            console.log(result);

            // If the user cancels the login process, the result will have a 
            // isCancelled boolean set to true. We can use that to break out of this function.
            if (result.isCancelled) {
              throw 'User cancelled the login process';
            } else {
                const currentProfile = await Profile.getCurrentProfile();
                console.log(currentProfile.userID);
                console.log(currentProfile.email);
                console.log(currentProfile.name);

                siteUserLogin(currentProfile, 'fb');
            }
        } catch (error) {
            errorAlert('fb');
            console.log(error)
        }
    }

    const signOut = async () => {
        if(signType == 'google') {
            GoogleSignin.signOut();
        }

        try {
            await AsyncStorage.removeItem('spinXOPhoto')
            await AsyncStorage.removeItem('spinXOEmail')
            await AsyncStorage.removeItem('spinXOUID')
            await AsyncStorage.removeItem('spinXOName')
            await AsyncStorage.removeItem('spinXOSignType')

            console.log('Data remove successfully.');

            setPhoto('');
            setName('');
            setEmail('');
            setSign(false);

        } catch (error) {
            console.log('Error storing data:', error);
        }
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
                <View style={[styles.avatar, {position: 'absolute', top: 56, right: 22, overflow: 'hidden'}]}>
                    <Image source={{uri: photo}} resizeMode='cover' style={{width: '100%', height: '100%'}} borderRadius={50}/>
                </View>
        }

        {/* Account Section */}
        <View style={styles.AccountSection}>
            <View style={styles.textSection}>
                <Text style={styles.titleText}>Account</Text>
                {
                    name == '' ? ''
                    :
                    <Text style={styles.userInfoText}>Username: <Text style={styles.userDataText}>{name}</Text></Text>
                }
                {
                    name == '' ? ''
                    :
                    <Text style={styles.userInfoText}>Email: <Text style={styles.userDataText}>{email}</Text></Text>
                }
                {
                    sign ? 
                    '' 
                    : 
                    <Text style={styles.descText}>
                        Create an account to save your settings and favorite names.
                    </Text>
                }
            </View>

            <View style={styles.bunttonList}>
                {
                    sign ? 
                    <TouchableOpacity onPress={() => {signOut()}} style={styles.buttonItem}>
                        <Image source={signOutImg} />
                        <Text style={styles.buttonText}>
                            {signType == 'google' ? 'Google' : signType == 'fb' ? 'Facebook' : 'Apple'} Sign Out
                        </Text>
                    </TouchableOpacity>
                    :
                    <>
                        <TouchableOpacity onPress={() => {googleSignin()}} style={styles.buttonItem}>
                            <Image source={googleImg} />
                            <Text style={styles.buttonText}>
                                Continue with Google
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {facebookSignin()}} style={styles.buttonItem}>
                            <Image source={facebookImg} />
                            <Text style={styles.buttonText}>
                                Continue with Facebook
                            </Text>
                        </TouchableOpacity>
                        {
                            Platform.OS == 'ios' &&
                            <TouchableOpacity onPress={() => {applesignin()}} style={styles.buttonItem}>
                                <Image source={appleImg} />
                                <Text style={styles.buttonText}>
                                    Continue with Apple
                                </Text>
                            </TouchableOpacity>
                        }
                    </>
                }

            </View>
        </View>

        <Dialog
            isVisible={alert}
        >
            <Dialog.Title title="Error" titleStyle={{color: 'black', fontSize: 20}}/>
            <Text>{errorMsg}</Text>
        </Dialog>
       
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    AccountSection: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        gap: 24
    },
    textSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 26,
        gap: 16
    },
    titleText: {
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: '700',
        fontStyle: 'normal',
        color: colorStyles.screenTitleColor,
        marginBottom: '3%'
    },
    userInfoText: {
        fontFamily: 'Arial',
        fontSize: 18,
        fontWeight: '700',
        fontStyle: 'normal',
        color: colorStyles.screenTitleColor
    },
    userDataText: {
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: '700',
        fontStyle: 'normal',
        color: colorStyles.userInfoTextColor
    },
    descText: {
        alignSelf: 'stretch',
        color: colorStyles.nameTextColor,
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 24,
        opacity: 0.4
    },
    bunttonList: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        gap: 8
    },
    buttonItem: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingHorizontal: 24,
        paddingVertical: 24,
        gap: 10,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: colorStyles.accountBtnBorderColor
    },
    buttonText: {
        fontFamily: 'Arial',
        fontSize: 17,
        fontStyle: 'normal',
        color: 'black',
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
});

export default AccountScreen;
