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
    BackHandler,
    Keyboard,
    Dimensions,
    PanResponder
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

import {commonStyles, colorStyles} from '../assets/styles';
import '../utils/ignoreWarning';
import Constants from '../utils/constants';

// Main Component
import NamesContainer from './Names.screen';


// Images
const headerImg = require('../assets/images/Header.png');
const LogoImg = require('../assets/images/Logo.png');
const spinImg = require('../assets/images/Spin.png');
const favoStarImg = require('../assets/images/Favo_Star.png');
const starImg = require('../assets/images/Star.png');
const loadingImg = require('../assets/images/Loading.png');
const clearImg = require('../assets/images/Clear.png');
const saveStarImg = require('../assets/images/SaveBtn_Star.png');

const screenWidth = Dimensions.get('window').width;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const NamesScreen = ({navigation, route}) => {
    const bannerWidth = parseInt(screenWidth) - 32;
    const bannerHeight1 = parseInt(bannerWidth * 50 / 320)
    const bannerHeight2 = parseInt(bannerWidth * 100 / 320)
    
    const scrollViewRef = useRef(null);

    const scrollToEnd = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }
    
    useEffect(() => {
        const backAction = () => {
            return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );

        return () => backHandler.remove();
    }, []);

   
    return (
        <>
            <StatusBar
                barStyle={'light-content'}
                backgroundColor="transparent"
                translucent={true}
            />
            
            <SafeAreaView style={commonStyles.SafeAreaView}>
                <ScrollView
                    ref={scrollViewRef}
                >

                    <NamesContainer navigation={navigation} route={route} scrollToEnd={scrollToEnd}/>
                </ScrollView>

            </SafeAreaView>
        </>
    );
};


export default NamesScreen;
