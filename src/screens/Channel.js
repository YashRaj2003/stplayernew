import { View, Text, Image, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navigation_bar from '../components/footer/navigation_bar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import env from './env';

export default function Channel({ route }) {
    const navigation = useNavigation();
    const { id } = route.params;
    const [channel, setchannel] = useState({})
    useEffect(() => {
        fetchData()
    }, [id])

    const fetchData = async () => {
        try {
            const response = await axios.get(`${env.API_BASE_URL}/channels/${id}`);
            setchannel(response?.data?.channel)
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <SafeAreaView >
            <View style={{ paddingBottom: 10, backgroundColor: "#0d0d0d", height: "100%", }} >
                <View style={{ paddingHorizontal: 15, backgroundColor: "#202020", width: "100%", paddingBottom: 50 }}>
                    <View style={{ height: 150, width: 150, borderWidth: 1, borderRadius: 150, alignSelf: "center", marginTop: 50, borderColor: "#ffffff40", justifyContent: "center", alignItems: "center" }}>
                        <View style={{ height: 125, width: 125, borderWidth: 1, borderRadius: 150, borderColor: "#ffffff50", justifyContent: "center", alignItems: "center" }}>
                            <Image source={{ uri: channel?.snippet?.thumbnails?.high?.url }} style={{ height: 100, width: 100, borderRadius: 100 }} />
                        </View>
                    </View>
                    <Text style={{ fontSize: 25, color: "white", fontFamily: "Balivia", marginTop: 20, alignSelf: "center", letterSpacing: 1.5 }}>{channel?.snippet?.title}</Text>
                </View>


                <View style={{ backgroundColor: "#0d0d0d", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 18, color: "white", fontFamily: "Poppins_400Regular", marginTop: 20, alignSelf: "center", letterSpacing: 1.5 }}>Channel Page coming soon</Text>
                </View>
                <View style={{ width: "100%", }}>
                    <Navigation_bar />
                </View>
            </View >
        </SafeAreaView >
    )
}
