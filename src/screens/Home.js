import React, { useEffect, useState, } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Thumbnail_card from '../components/cards/thumbnail_card';
import Navigation_bar from '../components/footer/navigation_bar';
import Header from '../components/header/header';
import axios from 'axios';
import env from './env';
import { ActivityIndicator, FlatList, View, RefreshControl, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function Home() {


    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${env.API_BASE_URL}/videos/home?page=${page}`);
            if (response.data.items.length === 0) {
                setLoadMore(false);
                return
            }
            setData((prevData) => [...prevData, ...response.data.items]);
            setPage((prevPage) => prevPage + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleLoadMore = () => {
        if (loadMore) {
            fetchData();
        }
    };
    const handleRefresh = () => {
        setRefreshing(true);
        setData([]);
        setPage(1);
        setLoadMore(true);
        fetchData();
    };
    return (
        <SafeAreaView style={{ backgroundColor: "#0d0d0d" }} >
            <View style={{ paddingBottom: 10, backgroundColor: "#0d0d0d", height: "100%", }} >
                <View style={{ width: "100%" }}>
                    <Header />
                    <View style={{ paddingHorizontal: 25, paddingVertical: 10, borderBottomColor: "#202020", borderBottomWidth: 1, backgroundColor: "#161616" }}>
                        <Text style={{ fontFamily: "Poppins_500Medium", letterSpacing: 1.2, color: "#8a8a8a", fontSize: 16, textAlign: "center" }}>HOME</Text>
                    </View>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 20, marginBottom: 60 }} >
                    <FlatList
                        data={data}
                        renderItem={({ item }) => <Thumbnail_card data={item} />}
                        keyExtractor={item => item._id}
                        ListFooterComponent={() => (!loading || !loadMore) ? null : <View style={{ paddingVertical: 20 }}>
                            <ActivityIndicator size="large" color="#ffffff" />
                        </View>}
                        onEndReached={() => handleLoadMore()}
                        onEndReachedThreshold={0.5}
                        ListFooterComponentStyle={{ height: 50 }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                        }
                    />
                </View>
                <View style={{ width: "100%", position: "absolute", bottom: 0, }}>
                    <Navigation_bar />
                </View>
            </View>
        </SafeAreaView >
    )
}

