import { View, Text, TouchableOpacity, Image, ToastAndroid } from 'react-native'
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { user } from '../../../atom/user';
import { useRecoilState } from 'recoil'
import axios from 'axios';
import { useRef } from 'react';

export default function Subscribtion_card({ data }) {
    const [userinfo, setuserinfo] = useRecoilState(user);
    const [subscribed, setsubscribed] = useState(true);
    const navigation = useNavigation();
    const [subscribedId, setsubscribedId] = useState(data?._id);
    const [subscriberCount, setSubscriberCount] = useState(data.channel?.subscribers);

    async function subscribeChannel() {

        if (subscribed === true) {
            return
        }
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }

        let bodyContent = {
            "channelId": data?.channelId,
            "userId": userinfo?._id,
            "fromRoute": "subscription"
        };

        let reqOptions = {
            url: "http://192.168.1.4:8080/channels/subscribeChannel",
            method: "POST",
            headers: headersList,
            data: bodyContent,
        }

        let response = await axios.request(reqOptions);
        if (response.data.success === true) {
            setsubscribed(true);
            setsubscribedId(response.data._id)
            setSubscriberCount((prevCount) => prevCount + 1);

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
            "channelId": data?.channelId
        };

        let reqOptions = {
            url: "http://192.168.1.4:8080/channels/unsubscribeChannel",
            method: "POST",
            headers: headersList,
            data: bodyContent,
        }
        let response = await axios.request(reqOptions);
        if (response.data.success === true) {
            setsubscribed(false);
            setsubscribedId(null);
            setSubscriberCount((prevCount) => prevCount - 1);
            return
        }
        showToast("Something went wrong while unsubscribing")
    }

    function showToast(msg) {
        ToastAndroid.show(msg, ToastAndroid.LONG);
    }

    return (
        <TouchableOpacity style={{ backgroundColor: "#202020", borderWidth: 1, borderColor: "#54545450", marginVertical: 10 }} onPress={() => navigation.navigate('channel', { id: data.channelId })}>
            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-around", padding: 7 }}>
                <View style={{ width: 45, height: 45, }}>
                    <Image source={{ uri: data?.channel?.thumbnail }} style={{ height: "100%", width: "100%" }} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 8, }}>
                    <Text numberOfLines={1} style={{ width: "100%", fontWeight: "500", fontSize: 14, fontFamily: "Poppins_500Medium", letterSpacing: 0.2, color: "white" }}>{data.channel?.title}</Text>
                    <Text numberOfLines={1} style={{ width: "100%", fontWeight: "500", fontSize: 12, fontFamily: "Poppins_300Light", letterSpacing: 0.8, color: "#c4c4c4" }}>{subscriberCount} subscribers</Text>
                </View>
                {subscribed === true ?
                    <TouchableOpacity onPress={() => unsubscribeChannel()} activeOpacity={0.5} style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: "#111013", flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
                        <Text style={{ color: "white", fontFamily: "Poppins_500Medium", fontSize: 13, marginTop: 1 }} >Unsubscribe</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => subscribeChannel()} activeOpacity={0.5} style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: "white", flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
                        <Text style={{ color: "black", fontFamily: "Poppins_500Medium", fontSize: 13, marginTop: 1 }} >Subscribe</Text>
                    </TouchableOpacity>
                }
            </View>
        </TouchableOpacity>
    )
}