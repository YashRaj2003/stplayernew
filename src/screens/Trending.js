import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Thumbnail_card from '../components/cards/thumbnail_card';
import Navigation_bar from '../components/footer/navigation_bar';
import Header from '../components/header/header';
import axios from 'axios';
import env from './env';
import { useNavigation } from '@react-navigation/native'
export default function Trending() {

    const [videos, setVideos] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loadMore, setLoadMore] = useState(true);
    const navigation = useNavigation();


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://192.168.1.4:8080/videos/trending`);
            setVideos(response?.data.items)
        } catch (error) {
            console.error(error);
        }
        finally {
            setRefreshing(false)
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setVideos([]);
        fetchData();
    };
    return (
        <SafeAreaView >
            <View style={{ paddingBottom: 10, backgroundColor: "#0d0d0d", height: "100%", }} >
                <View style={{ width: "100%", }}>
                    <Header />
                    <View style={{ paddingHorizontal: 25, paddingVertical: 10, borderBottomColor: "#202020", borderBottomWidth: 1, backgroundColor: "#161616" }}>
                        <Text style={{ fontFamily: "Poppins_500Medium", letterSpacing: 1.2, color: "#8a8a8a", fontSize: 16, textAlign: "center" }}>TRENDING</Text>
                    </View>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 20, marginBottom: 60, marginTop: 10 }} >
                    <FlatList
                        data={videos}
                        renderItem={({ item }) => <Thumbnail_card data={item} navigation={navigation} />}
                        keyExtractor={item => item._id}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                        }
                    />
                </View>
                <View style={{ width: "100%", position: "absolute", bottom: 0, }}>
                    <Navigation_bar navigation={navigation} />
                </View>
            </View>
        </SafeAreaView>
    )
}

