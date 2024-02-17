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
import axios from 'axios';

import {commonStyles, colorStyles} from '../assets/styles';
import '../utils/ignoreWarning';
import Constants from '../utils/constants';

// Images
const collapseImg = require('../assets/images/Chevron.png');
const collapseUpImg = require('../assets/images/Chevron_less.png');
const closeImg = require('../assets/images/Close.png');

const NameTypeScreen = ({navigation, route}) => {
    const params = route.params;
    
    const [social, setSocial] = useState([]);
    const [moreSocial, setMoreSocial] = useState(false);

    const [gaming, setGaming] = useState([]);
    const [moreGaming, setMoreGaming] = useState(false);

    const [language, setLanguage] = useState([]);
    const [moreLanguage, setMoreLanguage] = useState(false);

    // Get Screen Data
    useEffect(() => {
        axios.get(`${Constants.SiteDataServiceURL}`)
        .then(response => {
            if(response.data) {
                // Sites Part
                const siteData = response.data.Sites;

                let socialTmp = [];
                let gamingTmp = [];
                siteData.map(item => {
                    if(item.IsSocial) {
                        socialTmp.push(item);
                    }
                    
                    if(item.IsGame) {
                        gamingTmp.push(item);
                    }
                })

                let socialList = [];
                for (let i = 0; i < socialTmp.length; i += 3) {
                    const name1 = socialTmp[i] ? socialTmp[i].Name : undefined;
                    const name2 = socialTmp[i + 1] ? socialTmp[i + 1].Name : undefined;
                    const name3 = socialTmp[i + 2] ? socialTmp[i + 2].Name : undefined;
                    const stub1 = socialTmp[i] ? socialTmp[i].Stub : undefined;
                    const stub2 = socialTmp[i + 1] ? socialTmp[i + 1].Stub : undefined;
                    const stub3 = socialTmp[i + 2] ? socialTmp[i + 2].Stub : undefined;

                    if(name1 == undefined)
                        socialList.push({});
                    else if(name2 == undefined)
                        socialList.push({ name1, stub1 });
                    else if(name3 == undefined)
                        socialList.push({ name1, stub1, name2, stub2 });
                    else
                        socialList.push({ name1, stub1, name2, stub2, name3, stub3 });
                }

                setSocial(socialList);

                let gamingList = [];
                for (let i = 0; i < gamingTmp.length; i += 3) {
                    const name1 = gamingTmp[i] ? gamingTmp[i].Name : undefined;
                    const name2 = gamingTmp[i + 1] ? gamingTmp[i + 1].Name : undefined;
                    const name3 = gamingTmp[i + 2] ? gamingTmp[i + 2].Name : undefined;
                    const stub1 = gamingTmp[i] ? gamingTmp[i].Stub : undefined;
                    const stub2 = gamingTmp[i + 1] ? gamingTmp[i + 1].Stub : undefined;
                    const stub3 = gamingTmp[i + 2] ? gamingTmp[i + 2].Stub : undefined;

                    if(name1 == undefined)
                        gamingList.push({});
                    else if(name2 == undefined)
                        gamingList.push({ name1, stub1 });
                    else if(name3 == undefined)
                        gamingList.push({ name1, stub1, name2, stub2 });
                    else
                        gamingList.push({ name1, stub1, name2, stub2, name3, stub3 });
                }

                setGaming(gamingList);

                // Language Part
                const languageData = response.data.Languages;
                let langList = [];
                for (let i = 0; i < languageData.length; i += 3) {
                    const name1 = languageData[i] ? languageData[i].Name : undefined;
                    const name2 = languageData[i + 1] ? languageData[i + 1].Name : undefined;
                    const name3 = languageData[i + 2] ? languageData[i + 2].Name : undefined;
                    const id1 = languageData[i] ? languageData[i].ID : undefined;
                    const id2 = languageData[i + 1] ? languageData[i + 1].ID : undefined;
                    const id3 = languageData[i + 2] ? languageData[i + 2].ID : undefined;

                    if(name1 == undefined)
                        langList.push({});
                    else if(name2 == undefined)
                        langList.push({ name1, id1 });
                    else if(name3 == undefined)
                        langList.push({ name1, id1, name2, id2 });
                    else
                        langList.push({ name1, id1, name2, id2, name3, id3 });
                }

                setLanguage(langList);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    }, []);


    // NameType Component
    const NameTypeCmp = ({item}) => {
        return (
            <View style={styles.typeButtonRow}>
    
                {/* Type Button */}
                {
                    item.name1 ? 
                        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Names',  params: {stub : item.stub1} })} style={[styles.typeButton, {backgroundColor: item.stub1 == params.stub ? colorStyles.nametypeBtnActiveColor : colorStyles.nametypeBtnInActiveColor}]}>
                            <Text style={[styles.typeButtonText, {color: item.stub1 == params.stub ? 'white' : colorStyles.nametypeBtnTextColor}]}>{item.name1}</Text>
                        </TouchableOpacity>
                    :   <View style={styles.typeButton} />
                }

                {/* Type Button */}
                {
                    item.name2 ?
                        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Names',  params: {stub : item.stub2} })} style={[styles.typeButton, {backgroundColor: item.stub2 == params.stub ? colorStyles.nametypeBtnActiveColor : colorStyles.nametypeBtnInActiveColor}]}>
                            <Text style={[styles.typeButtonText, {color: item.stub2 == params.stub ? 'white' : colorStyles.nametypeBtnTextColor}]}>{item.name2}</Text>
                        </TouchableOpacity>
                    :   <View style={styles.typeButton} />
                }

                {/* Type Button */}
                {
                    item.name3 ? 
                        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Names',  params: {stub : item.stub3} })} style={[styles.typeButton, {backgroundColor: item.stub3 == params.stub ? colorStyles.nametypeBtnActiveColor : colorStyles.nametypeBtnInActiveColor}]}>
                            <Text style={[styles.typeButtonText, {color: item.stub3 == params.stub ? 'white' : colorStyles.nametypeBtnTextColor}]}>{item.name3}</Text>
                        </TouchableOpacity>
                    : <View style={styles.typeButton} />
                }
            </View>
        )
    }

    // Language Component
    const LanguageCmp = ({item}) => {
        return (
            <View style={styles.typeButtonRow}>
                
                {/* Type Button */}
                {
                    item.name1 ? 
                        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Names',  params: {lang : item.id1} })} style={[styles.typeButton, {backgroundColor: item.id1 == params.lang ? colorStyles.nametypeBtnActiveColor : colorStyles.nametypeBtnInActiveColor}]}>
                            <Text style={[styles.typeButtonText, {color: item.id1 == params.lang ? 'white' : colorStyles.nametypeBtnTextColor}]}>{item.name1}</Text>
                        </TouchableOpacity>
                    :   <View style={styles.typeButton} />
                }

                {/* Type Button */}
                {
                    item.name2 ?
                        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Names',  params: {lang : item.id2} })} style={[styles.typeButton, {backgroundColor: item.id2 == params.lang ? colorStyles.nametypeBtnActiveColor : colorStyles.nametypeBtnInActiveColor}]}>
                            <Text style={[styles.typeButtonText, {color: item.id2 == params.lang ? 'white' : colorStyles.nametypeBtnTextColor}]}>{item.name2}</Text>
                        </TouchableOpacity>
                    :   <View style={styles.typeButton} />
                }

                {/* Type Button */}
                {
                    item.name3 ? 
                        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Names',  params: {lang : item.id3} })} style={[styles.typeButton, {backgroundColor: item.id3 == params.lang ? colorStyles.nametypeBtnActiveColor : colorStyles.nametypeBtnInActiveColor}]}>
                            <Text style={[styles.typeButtonText, {color: item.id3 == params.lang ? 'white' : colorStyles.nametypeBtnTextColor}]}>{item.name3}</Text>
                        </TouchableOpacity>
                    : <View style={styles.typeButton} />
                }
            </View>
        )
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
                    <Text style={styles.titleText}>Name Types</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
                        <Image source={closeImg}/>
                    </TouchableOpacity>
                </View>

                <ScrollView >
                    {/* Name Type Parts */}
                    <View style={styles.typeParts}>

                        {/* Type Block */}
                        <View style={styles.typeBlock}>

                            {/* Header Part */}
                            <View style={styles.typeHeader}>
                                <Text style={styles.typeTitle}>Social</Text>
                                {
                                    social.length > 2 ? 
                                        <TouchableOpacity onPress={() => {setMoreSocial(!moreSocial)}}>
                                            <View style={{justifyContent:'flex-end', alignItems: 'center', flexDirection: 'row', flex: 1}}>
                                                <Text style={styles.collapseText}>{moreSocial ? 'Show less' : 'Show more'}</Text>
                                                <Image source={moreSocial ? collapseUpImg : collapseImg} />
                                            </View>
                                        </TouchableOpacity>
                                    :   ''
                                }
                            </View>

                            {/* Type Button Part */}
                            <View style={styles.typeButtonPart}>

                                {/* Type Row Part */}
                                {
                                    social.map((item, index) => {
                                        if(moreSocial) {
                                            return (
                                                <NameTypeCmp key={'social-' + index} item={item} />
                                            )
                                        } else {
                                            if(index > 1) {
                                                return ''
                                            } else {
                                                return (
                                                    <NameTypeCmp key={'social-' + index} item={item} />
                                                )
                                            }
                                        }
                                    })
                                }

                            </View>
                        </View>


                        {/* Type Block */}
                        <View style={styles.typeBlock}>

                            {/* Header Part */}
                            <View style={styles.typeHeader}>
                                <Text style={styles.typeTitle}>Gaming</Text>
                                {
                                    gaming.length > 2 ? 
                                        <TouchableOpacity onPress={() => {setMoreGaming(!moreGaming)}}>
                                            <View style={{justifyContent:'flex-end', alignItems: 'center', flexDirection: 'row', flex: 1}}>
                                                <Text style={styles.collapseText}>{moreGaming ? 'Show less' : 'Show more'}</Text>
                                                <Image source={moreGaming ? collapseUpImg : collapseImg} />
                                            </View>
                                        </TouchableOpacity>
                                    :   ''
                                }
                            </View>

                            {/* Type Button Part */}
                            <View style={styles.typeButtonPart}>

                                {/* Type Row Part */}
                                {
                                    gaming.map((item, index) => {
                                        if(moreGaming) {
                                            return (
                                                <NameTypeCmp key={'gaming-' + index} item={item} />
                                            )
                                        } else {
                                            if(index > 1) {
                                                return ''
                                            } else {
                                                return (
                                                    <NameTypeCmp key={'gaming-' + index} item={item} />
                                                )
                                            }
                                        }
                                    })
                                }
                            </View>
                        </View>


                        {/* Type Block */}
                        <View style={styles.typeBlock}>

                            {/* Header Part */}
                            <View style={styles.typeHeader}>
                                <Text style={styles.typeTitle}>Language</Text>
                                {
                                    language.length > 2 ? 
                                        <TouchableOpacity onPress={() => {setMoreLanguage(!moreLanguage)}}>
                                            <View style={{justifyContent:'flex-end', alignItems: 'center', flexDirection: 'row', flex: 1}}>
                                                <Text style={styles.collapseText}>{moreLanguage ? 'Show less' : 'Show more'}</Text>
                                                <Image source={moreLanguage ? collapseUpImg : collapseImg} />
                                            </View>
                                        </TouchableOpacity>
                                    :   ''
                                }
                            </View>

                            {/* Type Button Part */}
                            <View style={styles.typeButtonPart}>

                                {/* Type Row Part */}
                                {
                                    language.map((item, index) => {
                                        if(moreLanguage) {
                                            return (
                                                <LanguageCmp key={'lang-' + index} item={item} />
                                            )
                                        } else {
                                            if(index > 1) {
                                                return ''
                                            } else {
                                                return (
                                                    <LanguageCmp key={'lang-' + index} item={item} />
                                                )
                                            }
                                        }
                                    })
                                }
                            </View>
                        </View>
                        
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
    typeParts: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginHorizontal: 16
    },
    typeBlock: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 16,
        paddingVertical: 32,
        borderBottomWidth: 1,
        borderBottomColor: colorStyles.nametypeDividerColor
    },
    typeHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // alignSelf: 'stretch'
    },
    typeTitle: {
        color: colorStyles.screenTitleColor,
        fontFamily: 'Arial',
        fontSize: 21,
        fontStyle: 'normal',
        fontWeight: '700',
        flex: 1
    },
    collapseText: {
        color: colorStyles.nameFavoTextColor,
        fontFamily: 'Arial',
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 24,
    },
    typeButtonPart: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 16,
        alignSelf: 'stretch'
    },
    typeButtonRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        alignSelf: 'stretch'
    },
    typeButton: {
        display: 'flex',
        height: 48,
        paddingHorizontal: 8,
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderRadius: 8,
    },
    typeButtonText: {
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 16,
    }
});

export default NameTypeScreen;
