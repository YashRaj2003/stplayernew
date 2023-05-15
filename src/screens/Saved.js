import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/header/header'
import axios from 'axios'
import { user } from '../../atom/user'
import { useRecoilState } from "recoil"
import ThumbnailCard from '../components/cards/thumbnail_card'
export default function Saved() {
    const [userinfo, setuserinfo] = useRecoilState(user)
    const [videos, setVideos] = useState([])
    useEffect(() => {
        getWatchHistory();
    }, [])


    async function getWatchHistory() {
        try {
            let repsonse = await axios.get(`http://192.168.1.4:8080/videos/watchLater/${userinfo?._id}`);
            console.log(repsonse?.data?.items)
            setVideos(repsonse?.data?.items)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={{ paddingBottom: 10, backgroundColor: "#0d0d0d", height: "100%", }} >
            <View style={{ flex: 1, height: "100%", }}>
                <Header />
                <View style={{ paddingHorizontal: 25, paddingVertical: 10, borderBottomColor: "#202020", borderBottomWidth: 1, backgroundColor: "#161616" }}>
                    <Text style={{ fontFamily: "Poppins_500Medium", letterSpacing: 1.2, color: "#8a8a8a", fontSize: 16, textAlign: "center" }}>WATCH LATER</Text>
                </View>
                {videos.length > 0 ?
                    <View style={{ flex: 1, height: "100%", padding: 20 }}>
                        {videos?.map((video, index) => (
                            <ThumbnailCard data={video} key={index} />
                        ))}
                    </View>
                    :
                    <View style={{ flex: 1, height: "100%", padding: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "white", letterSpacing: 0.4 }}>There is no saved videos available for your account</Text>
                    </View>
                }
            </View>
        </View>

    )
}