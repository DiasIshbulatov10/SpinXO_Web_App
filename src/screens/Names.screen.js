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
    PanResponder,
    Alert
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

import {commonStyles, colorStyles} from '../assets/styles';
import '../utils/ignoreWarning';
import Constants from '../utils/constants';

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

const NamesScreen = ({navigation, route, scrollToEnd}) => {

    const bannerWidth = parseInt(screenWidth) - 32;
    const bannerHeight1 = parseInt(bannerWidth * 50 / 320);
    const bannerHeight2 = parseInt(bannerWidth * 100 / 320);
    
    const keyboardRef = useRef(Keyboard);
    
    const [langID, setLangID] = useState(Constants.Lang_EN);
    
    const [sites, setSites] = useState([]);
    const [activeSite, setActiveSite] = useState('');

    // message status
    const [successMsg, setSuccessMsg] = useState(false);
    const [warningMsg, setWarningMsg] = useState(false);

    const [namelist, setNamelist] = useState([]);
    const [nameCount, setNameCount] = useState(0);

    const [username, setUsername] = useState('');
    const [savename, setSavename] = useState('');
    const [favo, setFavo] = useState(false);

    const [oneword, setOneword] = useState(false);
    const [exact, setExact] = useState(false);
    const [rhyming, setRhyming] = useState(false);
    const [refine, setRefine] = useState(false);

    // SignData
    const [sign, setSign] = useState(false);
    const [photo, setPhoto] = useState('');
    const [userID, setUserID] = useState('');
    const [favorites, setFavorites] = useState([]);

    const [loading, setLoading] = useState(false);
    const [percent, setPercent] = useState(0);

    // Params
    const [params, setParams] = useState(route.params)

    const initialState = () => {
        setUsername('');
        setOneword(false);
        setExact(false);
        setRhyming(false);
        setRefine(false);
        setFavo(false);
        setSavename('');
    }
    
    useEffect(() => {
        getNames();
        checkSignData();

        axios.get(`${Constants.SiteDataServiceURL}`)
        .then(response => {
            if(response.data) {
                const siteData = response.data.Sites;
                setSites(siteData);
                let repeat = false;
                siteData.map(item => {
                    if(item.IsFeatured == true && repeat == false) {
                        setActiveSite(item.Stub);
                        repeat = true;
                    } 
                })
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    }, []);
    
    // Get Names Data function
    const getNames = (stub, name, newStub, lang, refineData, onewordP, exactP, rhymingP) => {
        keyboardRef.current.dismiss();
        setLoading(true);

        let newPercent = 0;

        const interval = setInterval(() => {
            newPercent += 10;

            if(newPercent == 100) {
                setPercent(0);
                newPercent = 0;
            } else {
                setPercent(newPercent);
            }
        }, 100);


        axios.post(`${Constants.SiteNameServiceURL}`, {
            snr: {
                category: 0,
                UserName: name ? name : '',
                Hobbies: refineData ? refineData.hobbies : '',
                ThingsILike: refineData ? refineData.thingLike : '',
                Numbers: refineData ? refineData.numbers : '',
                WhatAreYouLike: refineData ? refineData.whatLike : '',
                Words: refineData ? refineData.words : '',
                Stub: stub ? stub : 'username', 
                LanguageCode: 'en', 
                NamesLanguageID: lang ? lang : langID,
                Rhyming: newStub ? false : rhymingP ? true : false,
                OneWord: newStub ? false : onewordP ? true : false,
                UseExactWords: newStub ? false : exactP ? true : false,
                ScreenNameStyleString: 'Any',
                GenderAny: false,
                GenderMale: false,
                GenderFemale: false
            }
        })
        .then(response => {
            if(response.data) {
                const resData = response.data.d;
                setNameCount(resData.Count);
                
                let list = [];
                for (let i = 0; i < resData.Names.length; i += 2) {
                    const name1 = resData.Names[i];
                    const name2 = resData.Names[i + 1];

                    if(name2 == undefined)
                        list.push({ name1 });
                    else
                        list.push({ name1, name2 });
                }
                
                // Stop Loading
                clearInterval(interval);

                setLoading(false);
                setPercent(0);

                // setPercent(100);
                // setTimeout(() => {
                //     setLoading(false);
                //     setPercent(0);
                // }, 100);

                // Set Name List
                setNamelist(list);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            clearInterval(interval);
            setPercent(100);
            setTimeout(() => {
                setLoading(false);
                setPercent(0);
            }, 100);

            // Set Name List
            setNamelist([]);
        });
    }

    // Sign info check function
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

    // check navigation route parameters
    if(params != route.params) {
        setParams(route.params)
        setFavorites([]);
        checkSignData();
    }


    useEffect(() => {
        if(params.stub) {
            initialState();
            setActiveSite(params.stub)
            getNames(params.stub, '', true);
        }
        
        if(params.lang) {
            initialState();
            setLangID(params.lang);
            getNames(activeSite, '', true, params.lang);
        }

        if(params.refine) {
            const refineData = params.refine;
            if(refineData.username) {
                scrollToEnd();
                setUsername(refineData.username);
                getNames(activeSite, refineData.username, false, langID, refineData)
            } else {
                setRefine(false);
            }
        }
    }, [params])
    

    // Go to Name check detail screen
    const goToDetail = (name) => {
        navigation.navigate('NameDetail', {name : name})
    }


    const getOneWord = () => {
        scrollToEnd();
        setRefine(false);
        getNames(activeSite, username, false, langID, null, !oneword, exact, rhyming);
        setOneword(!oneword);
    }

    const getExact = () => {
        scrollToEnd();
        setRefine(false);
        getNames(activeSite, username, false, langID, null, oneword, !exact, rhyming);
        setExact(!exact);
    }

    const getRhyming = () => {
        scrollToEnd();
        setRefine(false);
        getNames(activeSite, username, false, langID, null, oneword, exact, !rhyming);
        setRhyming(!rhyming)
    }


    const clearName = () => {
        setUsername('');
    }


    // Spin Button Click Function
    const spinBtnClick = () => {
        scrollToEnd();
        setRefine(false); 
        getNames(activeSite, username, false, langID, null, oneword, exact, rhyming);
    }

    // Click save to favorite star button.
    const saveFavo = (name) => {
        keyboardRef.current.dismiss();

        if(sign == false) {
            navigation.navigate('MainTabs', { screen: 'Account' });
            // setWarningMsg(true);

            // setTimeout(() => {
            //     setWarningMsg(false);
            // }, 3000);
        } else {
            if(favorites.indexOf(name) > -1) {
                deleteFromFavorite(name)
            } else {
                saveToFavorite(name)
            }
        }
    }

    // Save to Favorite func
    const saveToFavorite = (name) => {
        axios.get(`${Constants.saveFavoURL}?UserID=${userID}&name=${name}`)
        .then(response => {
            if(response.status == 200) {
                let list = favorites;
                list.unshift(name);
                setFavorites(list);

                setFavo(true);
                setSavename(name);
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

    // Delete from Favorite func
    const deleteFromFavorite = (name) => {
        axios.get(`${Constants.deleteFavoURL}?UserID=${userID}&name=${name}`)
        .then(response => {
            if(response.status == 200) {
                let list = favorites.filter(item => item !== name);
                setFavorites(list);

                setFavo(false);
                setSavename(name);
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

   
    return (
        <>
            {/* Header */}
            <Image source={headerImg} resizeMode="cover" style={{width: '100%'}} />
            <TouchableOpacity style={[styles.logo, {position: 'absolute', top: 64, left: 18, overflow: 'hidden'}]} onPress={() => {}}>
                <Image source={LogoImg} resizeMode='cover' style={{width: '100%', height: '100%'}}/>
            </TouchableOpacity>
            {
                photo == '' ? 
                    '' 
                : 
                    <TouchableOpacity style={[styles.avatar, {position: 'absolute', top: 56, right: 22, overflow: 'hidden'}]} onPress={() => {navigation.navigate('MainTabs', { screen: 'Account'})}}>
                        <Image source={{uri: photo}} resizeMode='cover' style={{width: '100%', height: '100%'}} borderRadius={50}/>
                    </TouchableOpacity>
            }

            {/* TabTags */}
            <View style={styles.tagsContainer}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScrollContent}>
                    {
                        sites.map((item, index) => {
                            return (
                                <TouchableOpacity key={'site-' + index} onPress={() => {setActiveSite(item.Stub); scrollToEnd(); initialState(); getNames(item.Stub, '', true)}}>
                                    <View style={item.Stub == activeSite ? [styles.tagsActiveContainer, styles.tagsActiveItem] : styles.tagsInActiveItem}>
                                        <Text style={item.Stub == activeSite ? styles.tagsActiveTitle : styles.tagsInActiveTitle}>{item.Name}</Text>
                                    </View>
                                </TouchableOpacity>
                                
                            )
                        })
                    }
                    <TouchableOpacity key={'site-more'} onPress={() => {navigation.navigate('NameType', {stub : activeSite, lang: langID});}}>
                        <View style={styles.tagsInActiveItem}>
                            <Text style={styles.tagsInActiveTitle}>More</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {
                <>
                    {/* Tags */}
                    <View style={styles.secondTagsContainer}>
                        <TouchableOpacity
                            style={[styles.secondTagsItemActive, {backgroundColor: oneword ? colorStyles.tagsActiveColor : colorStyles.tagsInActiveColor}]}
                            onPress={() => {getOneWord()}}
                        >
                            <Text style={[styles.secondTagsTitle, {color: oneword ? 'white' : colorStyles.tagsInActiveTitle}]}>
                                One-word
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.secondTagsItemActive, {backgroundColor: exact ? colorStyles.tagsActiveColor : colorStyles.tagsInActiveColor}]}
                            onPress={() => {getExact()}}
                        >
                            <Text style={[styles.secondTagsTitle, {color: exact ? 'white' : colorStyles.tagsInActiveTitle}]}>
                                Exact
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.secondTagsItemActive, {backgroundColor: rhyming ? colorStyles.tagsActiveColor : colorStyles.tagsInActiveColor}]}
                            onPress={() => {getRhyming()}}
                        >
                            <Text style={[styles.secondTagsTitle, {color: rhyming ? 'white' : colorStyles.tagsInActiveTitle}]}>
                                Rhyming
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.secondTagsItemActive, {backgroundColor: refine ? colorStyles.tagsActiveColor : colorStyles.tagsInActiveColor}]}
                            onPress={() => {setRefine(true); navigation.navigate('Refine', params.refine ? params.refine.username ? params.refine : {username: username} : {username: username})}}
                        >
                            <Text
                                style={[styles.secondTagsTitle, {color: refine ? 'white' : colorStyles.tagsInActiveTitle}]}>
                                Refine
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search View */}
                    <View style={styles.search}>
                        <View style={[styles.searchView, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                            <TextInput 
                                style={styles.searchText} 
                                placeholder='Name, Nickname or keywoard' 
                                placeholderTextColor={colorStyles.inputPlaceholderColor} 
                                value={username}
                                onChangeText={(text) => setUsername(text)}
                            />
                            <TouchableOpacity onPress={() => {clearName()}}>
                                {username == '' ? '' : <Image source={clearImg} /> }
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => {spinBtnClick()}}>
                            <Image source={spinImg} />
                        </TouchableOpacity>
                    </View>

                    
                    {/* AD Banner */}
                    <View style={[styles.adBanner, {backgroundColor: colorStyles.adBannerColor, marginTop: 9}]}>
                        <BannerAd
                            size={`${bannerWidth}x${bannerHeight1}`}
                            unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-2714345105086685/2839564526'}
                            onAdLoaded={() => {
                                console.log('Advert loaded');
                            }}
                            onAdFailedToLoad={error => {
                                console.error('Advert failed to load: ', error);
                            }}
                        />
                        {/* <Text style={[styles.adBannerText, {color: colorStyles.adBannerTextColor}]}>AD Banner</Text> */}
                    </View>

                    {
                        loading ? 
                            <View style={styles.loadingPart}>
                                <AnimatedCircularProgress
                                    size={84}
                                    width={8}
                                    fill={percent}
                                    tintColor={colorStyles.loadingProgressColor}
                                    backgroundColor={colorStyles.loadingBackColor}
                                    duration={0}
                                    rotation={0}
                                >
                                    {
                                        (fill) => (
                                            <Image source={loadingImg} />
                                        )
                                    }
                                </AnimatedCircularProgress>

                                <Text style={styles.loadingText}>Loading</Text>
                            </View>
                        :
                        <View style={styles.resultPart}>
                            {/* Result Text */}
                            <View style={styles.resultSection}>
                                <Text style={styles.resultText}>
                                    <Text style={{color: colorStyles.resultNumberColor}}>{nameCount}</Text>&nbsp;names generated. Spin for more
                                </Text>
                            </View>

                            {/* NameList Section */}
                            <View style={styles.nameList}>
                                {
                                    namelist.map((item, index) => {
                                        return (
                                            <View key={index} style={{display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 1}}>
                                                <View style={favorites.indexOf(item.name1) > -1 ? [styles.nameItem, {backgroundColor: colorStyles.nameFavoColor}] : styles.nameItem}>
                                                    <TouchableOpacity onPress={() => {saveFavo(item.name1)}}>
                                                        <Image source={favorites.indexOf(item.name1) > -1 ? favoStarImg : starImg} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => goToDetail(item.name1)}>
                                                        <Text style={favorites.indexOf(item.name1) > -1 ? [styles.nameText, {fontWeight: '700', color: colorStyles.nameFavoTextColor}] : [styles.nameText, {fontWeight: '400', color: colorStyles.nameTextColor}]}>
                                                            {item.name1.length > 15 ? item.name1.substring(0, 15) + '...' : item.name1}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                {
                                                    item.name2 ? 
                                                        <View style={favorites.indexOf(item.name2) > -1 ? [styles.nameItem, {backgroundColor: colorStyles.nameFavoColor}] : styles.nameItem}>
                                                            <TouchableOpacity onPress={() => {saveFavo(item.name2)}}>
                                                                <Image source={favorites.indexOf(item.name2) > -1 ? favoStarImg : starImg} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => goToDetail(item.name2)}>
                                                                <Text style={favorites.indexOf(item.name2) > -1 ? [styles.nameText, {fontWeight: '700', color: colorStyles.nameFavoTextColor}] : [styles.nameText, {fontWeight: '400', color: colorStyles.nameTextColor}]}>
                                                                    {item.name2.length > 15 ? item.name2.substring(0, 15) + '...' : item.name2}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    :
                                                        ''
                                                }
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    }

                    {/* Second AD Banner */}
                    <View style={[styles.adBanner, {backgroundColor: colorStyles.secondAdBannerColor}]}>
                        <BannerAd
                            size={`${bannerWidth}x${bannerHeight2}`}
                            unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-2714345105086685/2839564526'}
                            onAdLoaded={() => {
                                console.log('Advert loaded');
                            }}
                            onAdFailedToLoad={error => {
                                console.error(error);
                            }}
                        />
                    </View>

                    {
                        successMsg ? '' : ''
                    }
                </>
            }

            {/* Message */}
            {/* {
                successMsg ? 
                    <View style={[styles.messageBox, {backgroundColor: colorStyles.successMsgColor}]}>
                        <Image source={saveStarImg} />
                        <Text style={styles.messageText}><Text style={{fontWeight: '700'}}>{savename}&nbsp;</Text>{favo ? 'save to favorites' : 'removed from Favorites'} </Text>
                    </View>
                :   ''
            }

            {
                warningMsg ? 
                    <View style={[styles.messageBox, {backgroundColor: colorStyles.warningMsgColor}]}>
                        <Text style={styles.messageText}>Please Sign In with your account</Text>
                    </View>
                :   ''
            } */}
        </>
    );
};

const styles = StyleSheet.create({
    tagsContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    tagsScrollContent: {
        minWidth: '100%',
        backgroundColor: colorStyles.tagsTabBackColor,
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 3
    },
    tagsActiveContainer: {
        display: 'flex',
        padding: 16,
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
    },
    tagsActiveItem: {
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderTopWidth: 3,
        borderTopColor: '#38757D',
        backgroundColor: '#FFF',
    },
    tagsActiveTitle: {
        color: '#38757D',
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 17,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 16,
    },
    tagsInActiveItem: {
        display: 'flex',
        paddingVertical: 11,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: '#4BA1A3',
    },
    tagsInActiveTitle: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 17,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 16,
    },
    secondTagsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        gap: 4,
        flexWrap: 'wrap',
        marginVertical: 8,
        marginHorizontal: 16,
    },
    secondTagsItemActive: {
        display: 'flex',
        height: 40,
        // paddingVertical: 16,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        borderRadius: 8,
    },
    secondTagsTitle: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: '700',
    },
    search: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 8,
        marginHorizontal: 16,
    },
    searchView: {
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
    searchText: {
        display: 'flex',
        flex: 1,
        backgroundColor: colorStyles.searchBackColor,
        height: 69,
        fontSize: 16,
        fontWeight: '700',
        color: colorStyles.searchTextColor,
    },
    adBanner: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // height: 72,
        marginHorizontal: 16,
        marginBottom: 11,
        borderRadius: 3,
    },
    adBannerText: {
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 17,
        fontStyle: 'normal',
        fontWeight: '700',
        opacity: 0.3
    },
    resultText: {
        fontFamily: 'Arial',
        fontSize: 19,
        fontStyle: 'normal',
        fontWeight: '700',
        color: colorStyles.resultTextColor
    },
    resultSection: {
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: 16
    },
    nameList: {
        display: 'flex',
        marginHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginVertical: 11
    },
    nameItem: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        paddingHorizontal: 1,
        alignItems: 'center',
        gap: 5,
        alignSelf: 'stretch',
        borderRadius: 5
    },
    nameText: {
        fontFamily: 'Arial',
        fontSize: 15,
        fontStyle: 'normal',
    },
    loadingPart: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'center',
        height: 420
    },
    resultPart: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: 420
    },
    loadingText: {
        color: colorStyles.loadingTextColor,
        fontFamily: 'Arial',
        fontSize: 24,
        fontStyle: 'normal',
        fontWeight: '700',
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

export default NamesScreen;
