import React, {useEffect, useRef, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Button, Tab, TabView} from 'react-native-elements';
import axios from 'axios';

import {commonStyles, colorStyles} from '../assets/styles';
import '../utils/ignoreWarning';
import Constants from '../utils/constants';

// Images
const splashImg = require('../assets/images/Splash.png');

const SplashScreen = ({navigation, route}) => {

    
    return (
        <>
            <ImageBackground
                source={splashImg}
                style={{flex: 1}}
                resizeMode="cover"
            >
                <StatusBar
                    barStyle={'light-content'}
                    backgroundColor={colorStyles.statusBarColor}
                />
            </ImageBackground>
        </>
    );
};


export default SplashScreen;
