import { View, ToastAndroid, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, TouchableWithoutFeedback, ActivityIndicator, BackHandler, NativeModules, Image, TouchableHighlight } from 'react-native'
import { setStatusBarHidden } from 'expo-status-bar';
import React, { useEffect, useRef, useState, } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Video } from 'expo-av';
import { Entypo } from '@expo/vector-icons'
import * as ScreenOrientation from 'expo-screen-orientation';
import Slider from '@react-native-community/slider';
import Svg, { Path, } from 'react-native-svg';
import BottomSheetmodal from '../components/cards/BottomSheetmodal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import DescriptionWithLinks from '../components/DescriptionWithLinks';
import ThumbnailCard from '../components/cards/thumbnail_card';
import env from './env';
const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = StatusBarManager.HEIGHT;

const windowHeight = Dimensions.get('window').width * (9 / 16);
const windowWidth = Dimensions.get('window').width;
const height = Dimensions.get('window').width;
const width = Dimensions.get('window').height;



const Videoplayer = ({ route, userData }) => {
    const navigation = useNavigation();
    const { id } = route.params;
    const videoref = useRef(null);
    const [videoDetails, setvideoDetails] = useState({})
    const [status, setStatus] = useState({});
    const [currentTime, setcurrentTime] = useState(0)
    const [duration, setduration] = useState(0)
    const [show_control, setshow_control] = useState(false);
    const [isfull_screen, setisfull_screen] = useState(false);
    const [show_video_details, setshow_video_details] = useState(false);
    const [show_settings, setshow_settings] = useState(false);
    const [isloop, setisloop] = useState(false);
    const [show_playbackmodal, setshow_playbackmodal] = useState(false);
    const [playback_rate, setplayback_rate] = useState(1.0);
    const [show_qualitymodal, setshow_qualitymodal] = useState(false);
    const [videoquality, setvideoquality] = useState("auto");
    const [videosource_change, setvideosource_change] = useState({
        poster_source: ``,
        source: "",
        positionMillis: 0
    });
    const [subscribed, setsubscribed] = useState(false);
    const [subscribedId, setsubscribedId] = useState(null);
    const [watchedTime, setWatchedTime] = useState(0);
    const [subscribers, setsubscribers] = useState(0);
    const [recommendation, setrecommendation] = useState([])
    useEffect(() => {
        async function getVideo() {
            try {
                const response = await axios.get(`${env.API_BASE_URL}/videos/${id}`);
                setvideoDetails(response.data.items[0]);
                setvideosource_change({
                    poster_source: response.data.items[0].snippet.thumbnails.medium.url,
                    source: `https://d151s1fm39inn2.cloudfront.net/media/${id}/index.m3u8`,
                    positionMillis: 0
                });
                setsubscribers(response?.data?.items[0]?.channel?.statistics?.subscriberCount)
                let headersList = {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                }

                let bodyContent = {
                    "channelId": response?.data?.items[0]?.channel?._id,
                    "userId": userData?._id,
                };

                let reqOptions = {
                    url: `${env.API_BASE_URL}/channels/checkSubscribe`,
                    method: "POST",
                    headers: headersList,
                    data: bodyContent,
                }

                await axios.request(reqOptions).then(res => {
                    if (res.data.success === true) {
                        setsubscribed(true);
                        setsubscribedId(res?.data?.result?._id)
                        return
                    }
                }).catch(err => {
                    if (err.response) {
                        showToast(err.response.data.message);
                    }
                });
            } catch (error) {
                showToast("Something went wrong");
            }
        }

        getVideo()
        getRecommendation()
    }, [id])

    async function getRecommendation() {
        try {
            const response = await axios.get(`${env.API_BASE_URL}/videos/videoRecommendation/${id}`);
            if (response.data.items.length === 0) {
                return
            }
            setrecommendation(response.data.items);
        } catch (error) {
            console.error(error);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (show_settings === true) {
                    setshow_settings(false)
                    return true;
                }
                else if (show_video_details === true) {
                    setshow_video_details(false)
                    return true;
                }
                else if (Dimensions.get('window').height < Dimensions.get('window').width) {
                    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
                    setisfull_screen(false);
                    setStatusBarHidden(false);
                    setTimeout(() => setshow_control(false), 5000);
                    return true;
                }
                else return false
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [show_settings, show_video_details])
    );
    useEffect(() => {
        setvideosource_change({
            poster_source: `${videoDetails?.snippet?.thumbnails?.medium?.url}`,
            source: videoquality === "auto" ? `https://d151s1fm39inn2.cloudfront.net/media/${id}/index.m3u8` : videoDetails?.videoUrls?.[videoquality],
            positionMillis: currentTime
        })
        videoref.current.playAsync()
    }, [videoquality, id])

    useEffect(() => {
        setvideosource_change({
            poster_source: `${videoDetails?.snippet?.thumbnails?.medium?.url}`,
            source: `https://d151s1fm39inn2.cloudfront.net/media/${id}/${videoquality === "auto" ? "index" : videoquality}.${videoquality === "auto" ? "m3u8" : "m3u8"}`,
            positionMillis: currentTime
        })
        videoref.current.playAsync()
    }, [playback_rate, id])

    function showToast(msg) {
        ToastAndroid.show(msg, ToastAndroid.LONG);
    }
    const handlePlaying = () => {
        if (status.isPlaying) {
            videoref.current.pauseAsync();
            setTimeout(() => setshow_control(false), 2000)
        }
        else {
            videoref.current.playAsync();
            setTimeout(() => setshow_control(false), 2000)
        }
    }

    const forward_10sec = () => {
        videoref.current.setStatusAsync({
            positionMillis: currentTime + 10000,
            shouldPlay: true,
        })
        setcurrentTime(currentTime + 10000)
        setTimeout(() => setshow_control(false), 2000);
    }
    const revert_10sec = () => {
        videoref.current.setStatusAsync({
            positionMillis: currentTime - 10000,
            shouldPlay: true,
        })
        setcurrentTime(currentTime - 10000)
        setTimeout(() => setshow_control(false), 2000);
    }

    const getMinutesfromsecond = (time) => {
        const min = Math.floor((time / 1000 / 60) << 0);
        const sec = Math.floor((time / 1000) % 60);
        return `${min >= 10 ? min : min}:${sec >= 10 ? sec : "0" + sec}`;
    }

    const position = getMinutesfromsecond(currentTime);
    const Duration = getMinutesfromsecond(duration);


    const showcontrols = () => {
        if (show_control === true) {
            setshow_control(false)
            setTimeout(() => setshow_control(false), 3000);
        }
        else {
            setshow_control(true)
            // setTimeout(() => setshow_control(false), 5000);
        }
    }

    const handleFullscreen = () => {
        if (isfull_screen === true) {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
            setisfull_screen(false);
            setStatusBarHidden(false);
            setTimeout(() => setshow_control(false), 5000);
        }
        if (isfull_screen === false) {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            setisfull_screen(true);
            setStatusBarHidden(true);
            setTimeout(() => setshow_control(false), 5000)
        }
    };

    const changeplaybackrate = (rate) => {
        setplayback_rate(rate);
        setshow_playbackmodal(false);
        setshow_settings(false);
        videoref.current.playAsync();
    }

    const changevideoquality = (quality) => {
        setvideoquality(quality);
        setshow_qualitymodal(false);
        setshow_settings(false);
        // videoref.current.playFromPositionAsync(5000);
        videoref.current.playAsync();

    }

    async function subscribeChannel() {

        if (subscribed === true) {
            return
        }
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }

        let bodyContent = {
            "channelId": videoDetails?.channel?._id,
            "userId": userData?._id,
            "fromRoute": "watchVideos"
        };

        let reqOptions = {
            url: `${env.API_BASE_URL}/channels/subscribeChannel`,
            method: "POST",
            headers: headersList,
            data: bodyContent,
        }

        let response = await axios.request(reqOptions);
        if (response.data.success === true) {
            setsubscribed(true);
            setsubscribedId(response.data._id)
            setsubscribers(prevValue => prevValue + 1)
            return
        }
        showToast("Something went wrong while subscribing")

    }
    async function unsubscribeChannel() {
        if (subscribed === false) {
            return
        }
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }

        let bodyContent = {
            "subscribesId": subscribedId,
            channelId: videoDetails?.channel?._id
        };

        let reqOptions = {
            url: `${env.API_BASE_URL}/channels/unsubscribeChannel`,
            method: "POST",
            headers: headersList,
            data: bodyContent,
        }
        let response = await axios.request(reqOptions);
        if (response.data.success === true) {
            setsubscribed(false);
            setsubscribedId(null);
            setsubscribers(prevValue => prevValue - 1)
            return
        }
        showToast("Something went wrong while unsubscribing")
    }

    async function addViews() {

        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }

        let bodyContent = JSON.stringify({
            "channelId": "EUquYlZ30kbabBh9mT1EEsRpF5z1",
            "userId": "whwvBRVPQrU8F8g6KDrU0BYN8mO2",
            "videoId": "mk3eGvK2H6Sols0Jso6f",
            "fromRoute": "watchVideos"
        });

        let reqOptions = {
            url: `${env.API_BASE_URL}/videos/addViews`,
            method: "POST",
            headers: headersList,
            data: bodyContent,
        }

        let response = await axios.request(reqOptions);
        if (response.data.success === false) {
            showToast("Something went wrong while adding views")
        }

    }

    return (
        <SafeAreaView >
            <View style={{ paddingBottom: 10, backgroundColor: "#0d0d0d", height: "100%", }} >
                {show_video_details === true &&
                    <BottomSheetmodal close={setshow_video_details}>
                        <ScrollView style={{ height: "100%", maxHeight: 500 }}>
                            <View style={{ padding: 25 }}>
                                <Text style={{ color: "#929292", fontFamily: "Poppins_600SemiBold", letterSpacing: 3 }}>VIDEO DETAILS</Text>

                                <View style={{ paddingVertical: 30, borderBottomColor: "#e3e3e3", borderBottomWidth: 1 }}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-around", }}>
                                        <TouchableOpacity style={{ width: 73, height: 73, borderColor: "#e3e3e3", borderWidth: 2 }} onPress={() => navigation.navigate('channel', { id: videoDetails?.channel?._id })}>
                                            <Image source={{ uri: videoDetails?.channel?.thumbnail }} style={{ height: "100%", width: "100%" }} />
                                        </TouchableOpacity>
                                        <View style={{ flex: 1, paddingHorizontal: 8, }}>
                                            <Text numberOfLines={2} style={{ width: "100%", fontSize: 16, letterSpacing: 0.4, }} >{videoDetails?.channel?.title} <Text >&#183;</Text> <Text style={{ color: "#939393", fontSize: 16 }} >{subscribers} subscribers </Text></Text>
                                            <TouchableOpacity onPress={() => subscribed === false ? subscribeChannel() : unsubscribeChannel()} activeOpacity={0.5} style={{ marginTop: 5, width: 180, paddingVertical: 8, backgroundColor: subscribed === true ? "#111013" : "#3351ff", flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
                                                <Text style={{ color: "white", fontFamily: "Poppins_500Medium", marginRight: 10, fontSize: 16, marginTop: 1 }}>{subscribed === true ? "Unsubscribe" : "Subscribe"}</Text>
                                                <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="white" />
                                                </Svg>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ paddingVertical: 30, borderBottomColor: "#e3e3e3", borderBottomWidth: 1 }}>
                                    <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Title</Text>
                                    <Text style={{ color: "#939393", }}>{videoDetails?.snippet.title}</Text>
                                </View>
                                <View style={{ paddingVertical: 30, borderBottomColor: "#e3e3e3", borderBottomWidth: 1 }}>
                                    <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Description</Text>
                                    <DescriptionWithLinks description={videoDetails?.snippet.description} />
                                </View>
                            </View>
                        </ScrollView>
                    </BottomSheetmodal>
                }
                {show_settings === true &&
                    <BottomSheetmodal close={setshow_settings}>
                        <ScrollView style={{ height: "100%", maxHeight: 500, position: "relative" }}>
                            <View >
                                <Text style={{ paddingHorizontal: 25, marginTop: 20, color: "#929292", fontFamily: "Poppins_600SemiBold", letterSpacing: 3 }}>SETTINGS</Text>
                                <>
                                    {show_qualitymodal === true ?
                                        <ScrollView style={{ position: "absolute", height: "100%", width: "100%", backgroundColor: "white", zIndex: 60, paddingVertical: 25 }}>
                                            <>
                                                <TouchableHighlight underlayColor="#abdbe350" activeOpacity={0.7} onPress={() => setshow_qualitymodal(false)} style={{ paddingHorizontal: 25, width: 50, height: 50, alignItems: "flex-start", justifyContent: "center" }}>
                                                    <Svg style={{ transform: [{ rotate: '180deg' }] }} width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                    </Svg>
                                                </TouchableHighlight>
                                                <Text style={{ marginTop: 10, color: "#929292", fontFamily: "Poppins_600SemiBold", paddingHorizontal: 25, letterSpacing: 2.5 }}>VIDEO RESOLUTION</Text>
                                                <TouchableHighlight underlayColor="#abdbe350" onPress={() => changevideoquality("auto")}>
                                                    <View style={{ paddingVertical: 20, paddingHorizontal: 25, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Video Quality</Text>
                                                            <Text style={{ color: "#939393", }}>auto</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                                {videoDetails?.videoUrls?.["144p"] !== null && <TouchableHighlight underlayColor="#abdbe350" onPress={() => changevideoquality("144p")}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Video Quality</Text>
                                                            <Text style={{ color: "#939393", }}>144p</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>}
                                                {videoDetails?.videoUrls?.["240p"] !== null && <TouchableHighlight underlayColor="#abdbe350" onPress={() => changevideoquality("240p")}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Video Quality</Text>
                                                            <Text style={{ color: "#939393", }}>240p</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>}
                                                {videoDetails?.videoUrls?.["360p"] !== null && <TouchableHighlight underlayColor="#abdbe350" onPress={() => changevideoquality("360p")}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Video Quality</Text>
                                                            <Text style={{ color: "#939393", }}>360p</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>}
                                                {videoDetails?.videoUrls?.["480p"] !== null && <TouchableHighlight underlayColor="#abdbe350" onPress={() => changevideoquality("480p")}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Video Quality</Text>
                                                            <Text style={{ color: "#939393", }}>480p</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>}
                                                {videoDetails?.videoUrls?.["720p"] !== null && <TouchableHighlight underlayColor="#abdbe350" onPress={() => changevideoquality("720p")}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Video Quality</Text>
                                                            <Text style={{ color: "#939393", }}>720p</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>}
                                                {videoDetails?.videoUrls?.["1080p"] !== null && <TouchableHighlight underlayColor="#abdbe350" onPress={() => changevideoquality("1080p")}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Video Quality</Text>
                                                            <Text style={{ color: "#939393", }}>1080p</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>}
                                            </>
                                            <View style={{ paddingBottom: 25 }}></View>
                                        </ScrollView> : null}
                                    <TouchableHighlight underlayColor="#abdbe350" onPress={() => setshow_qualitymodal(true)}>
                                        <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                            <View style={{ height: 45, width: 45, borderColor: "#e3e3e3", borderWidth: 1, alignItems: "center", justifyContent: "center" }}>
                                                <Svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" enable-background="new 0 0 24 24" viewBox="0 0 24 24" >
                                                    <Path fill="#5e5e5e" d="M12,9.5c1.38,0,2.5,1.12,2.5,2.5s-1.12,2.5-2.5,2.5S9.5,13.38,9.5,12S10.62,9.5,12,9.5 M12,8.5c-1.93,0-3.5,1.57-3.5,3.5 s1.57,3.5,3.5,3.5s3.5-1.57,3.5-3.5S13.93,8.5,12,8.5L12,8.5z M13.22,3l0.55,2.2l0.13,0.51l0.5,0.18c0.61,0.23,1.19,0.56,1.72,0.98 l0.4,0.32l0.5-0.14l2.17-0.62l1.22,2.11l-1.63,1.59l-0.37,0.36l0.08,0.51c0.05,0.32,0.08,0.64,0.08,0.98s-0.03,0.66-0.08,0.98 l-0.08,0.51l0.37,0.36l1.63,1.59l-1.22,2.11l-2.17-0.62l-0.5-0.14l-0.4,0.32c-0.53,0.43-1.11,0.76-1.72,0.98l-0.5,0.18l-0.13,0.51 L13.22,21h-2.44l-0.55-2.2l-0.13-0.51l-0.5-0.18C9,17.88,8.42,17.55,7.88,17.12l-0.4-0.32l-0.5,0.14l-2.17,0.62L3.6,15.44l1.63-1.59 l0.37-0.36l-0.08-0.51C5.47,12.66,5.44,12.33,5.44,12s0.03-0.66,0.08-0.98l0.08-0.51l-0.37-0.36L3.6,8.56l1.22-2.11l2.17,0.62 l0.5,0.14l0.4-0.32C8.42,6.45,9,6.12,9.61,5.9l0.5-0.18l0.13-0.51L10.78,3H13.22 M14,2h-4L9.26,4.96c-0.73,0.27-1.4,0.66-2,1.14 L4.34,5.27l-2,3.46l2.19,2.13C4.47,11.23,4.44,11.61,4.44,12s0.03,0.77,0.09,1.14l-2.19,2.13l2,3.46l2.92-0.83 c0.6,0.48,1.27,0.87,2,1.14L10,22h4l0.74-2.96c0.73-0.27,1.4-0.66,2-1.14l2.92,0.83l2-3.46l-2.19-2.13 c0.06-0.37,0.09-0.75,0.09-1.14s-0.03-0.77-0.09-1.14l2.19-2.13l-2-3.46L16.74,6.1c-0.6-0.48-1.27-0.87-2-1.14L14,2L14,2z">
                                                    </Path>
                                                </Svg>
                                            </View>
                                            <View style={{ width: "100%", flex: 1, marginLeft: 20 }}>
                                                <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Quality</Text>
                                                <Text style={{ color: "#939393", }}>{videoquality}</Text>
                                            </View>
                                            <View >
                                                <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                </Svg>
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                </>
                                <>
                                    {show_playbackmodal === true ?
                                        <ScrollView style={{ position: "absolute", height: "100%", width: "100%", backgroundColor: "white", zIndex: 60, paddingVertical: 25 }}>
                                            <>
                                                <TouchableOpacity activeOpacity={0.7} onPress={() => setshow_playbackmodal(false)} style={{ paddingHorizontal: 25, width: 50, height: 50, alignItems: "flex-start", justifyContent: "center" }}>
                                                    <Svg style={{ transform: [{ rotate: '180deg' }] }} width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                    </Svg>
                                                </TouchableOpacity>
                                                <Text style={{ paddingHorizontal: 25, marginTop: 10, color: "#929292", fontFamily: "Poppins_600SemiBold", letterSpacing: 2.5 }}>PLAYBACK  RATE</Text>
                                                <TouchableHighlight underlayColor="#abdbe350" onPress={() => changeplaybackrate(0.25)}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Playback Rate</Text>
                                                            <Text style={{ color: "#939393", }}>0:25x</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                                <TouchableHighlight underlayColor="#abdbe350" onPress={() => changeplaybackrate(0.5)}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Playback Rate</Text>
                                                            <Text style={{ color: "#939393", }}>0.5x</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                                <TouchableHighlight underlayColor="#abdbe350" onPress={() => changeplaybackrate(0.75)}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Playback Rate</Text>
                                                            <Text style={{ color: "#939393", }}>0:75x</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                                <TouchableHighlight underlayColor="#abdbe350" onPress={() => changeplaybackrate(1.0)}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Playback Rate</Text>
                                                            <Text style={{ color: "#939393", }}>1.0x</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                                <TouchableHighlight underlayColor="#abdbe350" onPress={() => changeplaybackrate(1.25)}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Playback Rate</Text>
                                                            <Text style={{ color: "#939393", }}>1:25x</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                                <TouchableHighlight underlayColor="#abdbe350" onPress={() => changeplaybackrate(1.5)}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Playback Rate</Text>
                                                            <Text style={{ color: "#939393", }}>1:5x</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                                <TouchableHighlight underlayColor="#abdbe350" onPress={() => changeplaybackrate(1.75)}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Playback Rate</Text>
                                                            <Text style={{ color: "#939393", }}>1:75x</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                                <TouchableHighlight underlayColor="#abdbe350" onPress={() => changeplaybackrate(2.0)}>
                                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                                        <View style={{ width: "100%", flex: 1, }}>
                                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Playback Rate</Text>
                                                            <Text style={{ color: "#939393", }}>2:0x</Text>
                                                        </View>
                                                        <View >
                                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>
                                            </>
                                            <View style={{ paddingBottom: 25 }}></View>
                                        </ScrollView> : null}
                                    <TouchableHighlight underlayColor="#abdbe350" onPress={() => setshow_playbackmodal(true)}>
                                        <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                            <View style={{ height: 45, width: 45, borderColor: "#e3e3e3", borderWidth: 1, alignItems: "center", justifyContent: "center" }}>
                                                <Svg height="30" width="30" viewBox="0 0 24 24" >
                                                    <Path d="M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z            M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z            M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z            M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z            M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z" fill="#5e5e5e">
                                                    </Path>
                                                </Svg>
                                            </View>
                                            <View style={{ width: "100%", flex: 1, marginLeft: 20 }}>
                                                <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Playback Rate</Text>
                                                <Text style={{ color: "#939393", }}>{playback_rate}x</Text>
                                            </View>
                                            <View >
                                                <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                                </Svg>
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                </>
                                <TouchableHighlight underlayColor="#abdbe350" onPress={() => { setisloop(!isloop); setvideosource_change({ ...videosource_change, positionMillis: currentTime }) }}>
                                    <View style={{ paddingHorizontal: 25, paddingVertical: 20, borderBottomColor: "#e3e3e3", borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                        <View style={{ height: 45, width: 45, borderColor: "#e3e3e3", borderWidth: 1, alignItems: "center", justifyContent: "center" }}>
                                            <Svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <Path d="M8.75 8.75H21.25V12.5L26.25 7.5L21.25 2.5V6.25H6.25V13.75H8.75V8.75ZM21.25 21.25H8.75V17.5L3.75 22.5L8.75 27.5V23.75H23.75V16.25H21.25V21.25Z" fill="black" />
                                                {isloop === true ?
                                                    <Path d="M15.7536 11.7273V19H14.2159V13.1868H14.1733L12.5078 14.2308V12.8672L14.3082 11.7273H15.7536Z" fill="black" />
                                                    : null}
                                            </Svg>

                                        </View>
                                        <View style={{ width: "100%", flex: 1, marginLeft: 20 }}>
                                            <Text style={{ color: "#272727", fontFamily: "Poppins_600SemiBold", letterSpacing: 1 }}>Loop Video</Text>
                                            <Text style={{ color: "#939393", }}>{isloop === true ? "On" : "Off"}</Text>
                                        </View>
                                        <View >
                                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="black" />
                                            </Svg>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                <View style={{ marginBottom: 20 }}></View>
                            </View>

                        </ScrollView>
                    </BottomSheetmodal>
                }

                <View style={isfull_screen ? styles.fullscreenContainer : null}>
                    <TouchableOpacity onPress={() => { showcontrols(); }} activeOpacity={1}>
                        <>
                            <Video
                                ref={videoref}
                                style={isfull_screen ? styles.fullscreenVideo : styles.video}
                                source={{ uri: videosource_change.source }}
                                resizeMode="contain"
                                posterSource={{ uri: videosource_change.poster_source }}
                                isLooping={isloop}
                                onPlaybackStatusUpdate={status => { setStatus(() => status); setcurrentTime(status.positionMillis); }}
                                shouldPlay
                                rate={playback_rate}
                                positionMillis={videosource_change.positionMillis}
                                progressUpdateIntervalMillis={950}
                                onLoad={(data) => setduration(data.durationMillis)}

                            />


                            {show_control && (
                                <View style={{ position: 'absolute', height: isfull_screen === true ? height : windowHeight, width: isfull_screen === true ? width : windowWidth, padding: 15, backgroundColor: "#12121290", flexDirection: "column", justifyContent: "space-between", }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                                        <TouchableOpacity onPress={() => navigation.goBack()}>
                                            <AntDesign name="arrowleft" size={24} color="white" />
                                        </TouchableOpacity>
                                        {/* <Text style={{ color: "white", width: "100%", flex: 1 }} numberOfLines={1}>This would be a very long title so this must be truncated</Text> */}
                                        {/* <Text style={{ color: "white", }}>{isfull_screen === true ? "true" : "false"}</Text> */}
                                        <TouchableOpacity onPress={() => setshow_settings(true)}>
                                            <Ionicons name="settings-outline" size={24} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginBottom: 5 }}>
                                        <TouchableOpacity style={{ height: 60, width: 60, alignItems: "center", justifyContent: "center" }} onPress={() => revert_10sec()}>
                                            <Svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <Path d="M4 5.9441L4.92742 9.09882L8.00933 8.14583M4.91672 9.05866C5.60244 7.28327 6.8858 5.81742 8.53499 4.9259C10.1842 4.03437 12.0905 3.77594 13.9095 4.19729C15.7286 4.61863 17.3405 5.69198 18.454 7.22344C19.5676 8.75491 20.1094 10.6435 19.9816 12.5481C19.8538 14.4528 19.0649 16.2478 17.7572 17.6091C16.4496 18.9703 14.7095 19.808 12.8512 19.9708C10.993 20.1337 9.13909 19.6109 7.62446 18.4969C6.10982 17.383 5.03429 15.7513 4.59212 13.8966" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                                <Path d="M10.8835 9.18182V15H9.82955V10.2074H9.79545L8.43466 11.0767V10.1108L9.88068 9.18182H10.8835ZM14.5114 15.1108C14.0436 15.1108 13.642 14.9924 13.3068 14.7557C12.9735 14.517 12.7169 14.1733 12.5369 13.7244C12.3589 13.2737 12.2699 12.7311 12.2699 12.0966C12.2718 11.4621 12.3617 10.9223 12.5398 10.4773C12.7197 10.0303 12.9763 9.68939 13.3097 9.45455C13.6449 9.2197 14.0455 9.10227 14.5114 9.10227C14.9773 9.10227 15.3778 9.2197 15.7131 9.45455C16.0483 9.68939 16.3049 10.0303 16.483 10.4773C16.6629 10.9242 16.7528 11.464 16.7528 12.0966C16.7528 12.733 16.6629 13.2765 16.483 13.7273C16.3049 14.1761 16.0483 14.5189 15.7131 14.7557C15.3797 14.9924 14.9792 15.1108 14.5114 15.1108ZM14.5114 14.2216C14.875 14.2216 15.1619 14.0426 15.3722 13.6847C15.5843 13.3248 15.6903 12.7955 15.6903 12.0966C15.6903 11.6345 15.642 11.2462 15.5455 10.9318C15.4489 10.6174 15.3125 10.3807 15.1364 10.2216C14.9602 10.0606 14.7519 9.98011 14.5114 9.98011C14.1496 9.98011 13.8636 10.16 13.6534 10.5199C13.4432 10.8778 13.3371 11.4034 13.3352 12.0966C13.3333 12.5606 13.3797 12.9508 13.4744 13.267C13.571 13.5833 13.7074 13.822 13.8835 13.983C14.0597 14.142 14.2689 14.2216 14.5114 14.2216Z" fill="white" />
                                            </Svg>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: 60, width: 60, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#00000090", borderRadius: 60, }} onPress={() => handlePlaying()}>
                                            {status.isBuffering && status.isPlaying === false ? <ActivityIndicator size="large" color="#ffffff" />
                                                :
                                                status.isPlaying === true ?
                                                    <Svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <Path d="M6 4H10V19H6V4ZM13 4H17V19H13V4Z" fill="white" />
                                                    </Svg>
                                                    :
                                                    <Svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 3 }} xmlns="http://www.w3.org/2000/svg">
                                                        <Path d="M7.00002 5.47025C7.00002 5.09676 7.57955 4.87281 7.87872 5.07784L17.7971 12.1762C18.0676 12.3616 18.0676 12.7756 17.7971 12.961L7.8787 19.9222C7.57953 20.1272 7 19.9032 7 19.5297L7.00002 12.5686V5.47025Z" fill="white" />
                                                    </Svg>
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: 60, width: 60, alignItems: "center", justifyContent: "center" }} onPress={() => forward_10sec()}>
                                            <Svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <Path d="M20.4113 5.77888L19.4363 9.01888L16.1963 8.04014M19.4476 8.97764C18.7267 7.15425 17.3775 5.64878 15.6437 4.73315C13.9099 3.81752 11.9058 3.55211 9.99348 3.98485C8.08111 4.41758 6.38654 5.51994 5.21585 7.09281C4.04517 8.66567 3.47555 10.6053 3.6099 12.5614C3.74424 14.5176 4.57369 16.3611 5.94841 17.7592C7.32314 19.1572 9.15251 20.0176 11.1061 20.1848C13.0597 20.352 15.0086 19.8151 16.601 18.6711C18.1933 17.527 19.324 15.8512 19.7888 13.9464" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                                <Path d="M9.88352 9.18182V15H8.82955V10.2074H8.79545L7.43466 11.0767V10.1108L8.88068 9.18182H9.88352ZM13.5114 15.1108C13.0436 15.1108 12.642 14.9924 12.3068 14.7557C11.9735 14.517 11.7169 14.1733 11.5369 13.7244C11.3589 13.2737 11.2699 12.7311 11.2699 12.0966C11.2718 11.4621 11.3617 10.9223 11.5398 10.4773C11.7197 10.0303 11.9763 9.68939 12.3097 9.45455C12.6449 9.2197 13.0455 9.10227 13.5114 9.10227C13.9773 9.10227 14.3778 9.2197 14.7131 9.45455C15.0483 9.68939 15.3049 10.0303 15.483 10.4773C15.6629 10.9242 15.7528 11.464 15.7528 12.0966C15.7528 12.733 15.6629 13.2765 15.483 13.7273C15.3049 14.1761 15.0483 14.5189 14.7131 14.7557C14.3797 14.9924 13.9792 15.1108 13.5114 15.1108ZM13.5114 14.2216C13.875 14.2216 14.1619 14.0426 14.3722 13.6847C14.5843 13.3248 14.6903 12.7955 14.6903 12.0966C14.6903 11.6345 14.642 11.2462 14.5455 10.9318C14.4489 10.6174 14.3125 10.3807 14.1364 10.2216C13.9602 10.0606 13.7519 9.98011 13.5114 9.98011C13.1496 9.98011 12.8636 10.16 12.6534 10.5199C12.4432 10.8778 12.3371 11.4034 12.3352 12.0966C12.3333 12.5606 12.3797 12.9508 12.4744 13.267C12.571 13.5833 12.7074 13.822 12.8835 13.983C13.0597 14.142 13.2689 14.2216 13.5114 14.2216Z" fill="white" />
                                            </Svg>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", flex: 1, marginRight: 20 }}>
                                            <Text style={{ color: "white" }}>{position}</Text>
                                            <Slider
                                                height={10}
                                                value={currentTime}
                                                minimumValue={0}
                                                maximumValue={duration}
                                                step={1}
                                                // onValueChange={(value) => setcurrentTime(value)}
                                                onSlidingStart={() => videoref.current.pauseAsync()}
                                                onSlidingComplete={(position) => videoref.current.setStatusAsync({
                                                    positionMillis: position,
                                                    shouldPlay: true,
                                                })}
                                                minimumTrackTintColor={'#F44336'}
                                                maximumTrackTintColor={'#FFFFFF'}
                                                thumbTintColor={'#F44556'}
                                                style={{ flex: 1, width: "100%" }}

                                            />
                                            <Text style={{ color: "white" }}>{Duration}</Text>
                                        </View>
                                        <View>
                                            <TouchableOpacity style={{ height: 30, width: 30, alignItems: "center", justifyContent: "center" }} onPress={() => handleFullscreen()}>
                                                {/* {isfull_screen === true ? <Image source={exit_fullscreen} /> : <Image source={full_screen} />} */}
                                                {isfull_screen === true ?
                                                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <Path d="M7.98999 5H10.125V9.6875C10.125 10.1562 9.65625 10.625 9.1875 10.625H4.5V8.479H7.98999V5Z" fill="white" />
                                                        <Path d="M19.5 8.48999V10.625H14.8125C14.3438 10.625 13.875 10.1562 13.875 9.6875V5H16.021V8.48999H19.5Z" fill="white" />
                                                        <Path d="M16.01 20H13.875V15.3125C13.875 14.8438 14.3438 14.375 14.8125 14.375H19.5V16.521H16.01V20Z" fill="white" />
                                                        <Path d="M4.5 16.51V14.375H9.1875C9.65625 14.375 10.125 14.8438 10.125 15.3125V20H7.979V16.51H4.5Z" fill="white" />
                                                    </Svg>
                                                    :
                                                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <Path d="M5.4375 5C4.91973 5 4.5 5.41973 4.5 5.9375V10.625H6.64286V7.14286H10.125V5H5.4375Z" fill="white" />
                                                        <Path d="M13.875 5V7.14286H17.3571V10.625H19.5V5.9375C19.5 5.41973 19.0803 5 18.5625 5H13.875Z" fill="white" />
                                                        <Path d="M19.5 14.375H17.3571V17.8571H13.875V20H18.5625C19.0803 20 19.5 19.5803 19.5 19.0625V14.375Z" fill="white" />
                                                        <Path d="M6.64286 17.8571H10.125V20H5.4375C4.91973 20 4.5 19.5803 4.5 19.0625V14.375H6.64286V17.8571Z" fill="white" />
                                                    </Svg>
                                                }
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </>
                    </TouchableOpacity>
                </View>


                <View style={{ height: "100%", flex: 1, }}>

                    <ScrollView style={{ flex: 1, }} stickyHeaderIndices={[1]} scrollToOverflowEnabled={true}  >
                        <TouchableWithoutFeedback onPress={() => setshow_video_details(true)}>
                            <View>
                                <View style={{ paddingHorizontal: 8, paddingVertical: 12, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-around", borderBottomWidth: 1, borderBottomColor: "#12121250", backgroundColor: "#0d0d0d" }}>
                                    <View style={{ flex: 1, paddingRight: 8, }}>
                                        <Text numberOfLines={2} style={{ width: "100%", fontWeight: "500", fontSize: 18, fontFamily: "Balivia", letterSpacing: 1.2, lineHeight: 18, color: "white" }} >{videoDetails?.snippet?.title}</Text>
                                    </View>
                                    <TouchableOpacity style={{ paddingRight: 8 }} onPress={() => setshow_video_details(true)}>
                                        <Entypo name="chevron-thin-down" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                                <LinearGradient colors={['#111013', '#FFFFFF50', '#FFFFFF70', '#FFFFFF50', '#111013']} style={{ height: 0.5, width: "100%", }} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} ></LinearGradient>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={{ paddingHorizontal: 25, paddingVertical: 10, borderBottomColor: "#202020", borderBottomWidth: 1, backgroundColor: "#161616" }}>
                            <Text style={{ fontFamily: "Poppins_500Medium", letterSpacing: 1.2, color: "#8a8a8a", fontSize: 16, textAlign: "center" }}>RECOMMENDATION</Text>
                        </View>
                        <View style={{ paddingHorizontal: 20, }}>
                            {recommendation?.map((video, index) => (
                                <ThumbnailCard data={video} key={index} />
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* <View style={{ width: "100%", position: "absolute", bottom: 0, }}>
                    <Navigation_bar navigation={navigation} />
                </View> */}
            </View >
        </SafeAreaView >
    )
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        // backgroundColor: '#040207',
    },
    fullscreenContainer: {
        flex: 1,
        // backgroundColor: '#ebebeb',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5,
    },
    video: {
        height: windowHeight,
        width: windowWidth,
        backgroundColor: 'black',
    },
    fullscreenVideo: {
        flex: 1,
        height: height,
        width: width + STATUSBAR_HEIGHT,
        backgroundColor: 'black',
    },

});



export default Videoplayer;
