import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from "../components/colors";
import { LinearGradient } from 'expo-linear-gradient';
import Thumbnail_card from '../components/cards/thumbnail_card';
import Navigation_bar from '../components/footer/navigation_bar';
import Header from '../components/header/header';
const baseUrl = "http://192.168.0.100:3000/api/";


export default function Home({ navigation }) {

    const [videos, setvideos] = useState([]);


    useEffect(() => {
        fetch(`${baseUrl}/video`)
            .then((response) => response.json())
            .then((data) => setvideos(data));
    }, [])



    return (
        <SafeAreaView >
            <View style={{ paddingBottom: 10, backgroundColor: "#0d0d0d", height: "100%", }} >
                <View style={{ width: "100%", }}>
                    <Header />
                </View>
                <ScrollView style={{ flex: 1, paddingHorizontal: 15, marginBottom: 60 }} scrollToOverflowEnabled={true}  >
                    <View>
                        {videos.map((video, index) => (
                            <Thumbnail_card navigation={navigation} data={video} key={index} />
                        ))}
                        <Thumbnail_card navigation={navigation} />

                    </View>
                </ScrollView>
                <View style={{ width: "100%", position: "absolute", bottom: 0, }}>
                    <Navigation_bar navigation={navigation} />
                </View>
            </View>
        </SafeAreaView>
    )
}

