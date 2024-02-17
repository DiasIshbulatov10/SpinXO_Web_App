import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Header,
  View
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Screens
import Names from '../screens/Names.screen';
import NamesContainer from '../screens/NamesWrapper.screen';
import Favorites from '../screens/Favorites.screen';
import Availability from '../screens/Availability.screen';
import Account from '../screens/Account.screen';

import Refine from '../screens/Refine.screen';
import NameType from '../screens/NameType.screen';
import NameDetail from '../screens/NameDetail.screen';

import SplashScreen from '../screens/Splash.screen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

import { commonStyles, colorStyles } from '../assets/styles';

// Images
const nameImg = require('../assets/images/Name_Enable.png');
const nameDisableImg = require('../assets/images/Name_Disable.png');
const favoriteImg = require('../assets/images/Favorite_Enable.png');
const favoriteDisableImg = require('../assets/images/Favorite_Disable.png');
const availableImg = require('../assets/images/Available_Enable.png');
const availableDisableImg = require('../assets/images/Available_Disable.png');
const accountImg = require('../assets/images/Account_Enable.png');
const accountDisableImg = require('../assets/images/Account_Disable.png');

// Bottom Tabs
function MainTabs() {

  return (
    <Tab.Navigator>

      <Tab.Screen name="Names" component={NamesContainer} initialParams={{}}
        options={{ 
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            return (
              focused ? 
              <Image source={nameImg} />
              : 
              <Image source={nameDisableImg}/>
              
            )
          },
          tabBarActiveTintColor: colorStyles.tabEnableColor,
          tabBarInactiveTintColor: colorStyles.tabDisableColor,
          tabBarIconStyle: styles.tabBarIcon,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarStyle: styles.bottomBar,
          tabBarItemStyle: styles.tabBarItem,
        }}
      />

      <Tab.Screen name="Favorites" component={Favorites} initialParams={{reload: true}}
        options={{ 
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => { 
            return (
                focused ? 
                <Image source={favoriteImg}/>
                : 
                <Image source={favoriteDisableImg} style={{opacity: 0.3}}/>
            )
          },
          tabBarActiveTintColor: colorStyles.tabEnableColor,
          tabBarInactiveTintColor: colorStyles.tabDisableColor,
          tabBarIconStyle: styles.tabBarIcon,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarStyle: styles.bottomBar,
          tabBarItemStyle: styles.tabBarItem,
        }}
      />

      <Tab.Screen name="Availability" component={Availability} initialParams={{name: ''}}
        options={{ 
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => { 
            return (
                focused ? 
                <Image source={availableImg}/>
                : 
                <Image source={availableDisableImg} style={{opacity: 0.3}}/>
            )
          },
          tabBarActiveTintColor: colorStyles.tabEnableColor,
          tabBarInactiveTintColor: colorStyles.tabDisableColor,
          tabBarIconStyle: styles.tabBarIcon,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarStyle: styles.bottomBar,
          tabBarItemStyle: styles.tabBarItem,
        }}
      />

      <Tab.Screen name="Account" component={Account}
        options={{ 
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => { 
            return (
                focused ? 
                <Image source={accountImg}/>
                : 
                <Image source={accountDisableImg} style={{opacity: 0.3}}/>
            )
          },
          tabBarActiveTintColor: colorStyles.tabEnableColor,
          tabBarInactiveTintColor: colorStyles.tabDisableColor,
          tabBarIconStyle: styles.tabBarIcon,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarStyle: styles.bottomBar,
          tabBarItemStyle: styles.tabBarItem,
        }}
      />
      
    </Tab.Navigator>
  )
}


const MainNavigation = () => {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 1500);
  }, []);

  return (
    <NavigationContainer>
      {
        splash ? <SplashScreen />
        :
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MainTabs">
          
          <Stack.Screen name="MainTabs" component={MainTabs}
            options={{ 
              headerShown: false,
            }}
          />

          <Stack.Screen name="Refine" component={Refine} initialParams={{}}
            options={{ 
              headerShown: false,
            }}
          />

          <Stack.Screen name="NameType" component={NameType}
            options={{ 
              headerShown: false,
            }}
          />

          <Stack.Screen name="NameDetail" component={NameDetail}
            options={{ 
              headerShown: false,
            }}
          />
          
        </Stack.Navigator>
      }
    </NavigationContainer>
  )
}


const styles = StyleSheet.create({
  bottomBar: {
    display: 'flex',
    flexDirection: "row",
    height: 64,
    width: '100%',
    paddingTop: 16,
    paddingBottom: 8,
    // paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  tabBarItem: {
    display: 'flex',
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  tabBarLabel: {
    textAlign: 'center',
    fontFamily: 'Arial',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: -0.42,
  },
  tabBarIcon: {
    width: 24, 
    height: 24
  }
});

export default MainNavigation
