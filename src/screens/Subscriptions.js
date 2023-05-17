import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Navigation_bar from '../components/footer/navigation_bar';
import Header from '../components/header/header';
import Subscribtion_card from '../components/cards/subscribtion_card';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import env from './env';

export default function Subscriptions({ userData }) {
    const navigation = useNavigation();
    const [channels, setchannels] = useState([]);
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true);
    const [loadMore, setLoadMore] = useState(true);
    useEffect(() => {

        getSubscribedChannels();
    }, [])

    async function getSubscribedChannels() {
        try {
            const response = await axios.get(`${env.API_BASE_URL}/channels/subscribedChannels/${userData?._id}`);
            setchannels(response.data.channels)
            setLoadMore(false);
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const handleRefresh = () => {
        setRefreshing(true);
        setchannels([]);
        setLoadMore(true);
        getSubscribedChannels();
    };

    return (
        <SafeAreaView>
            <View style={{ paddingBottom: 10, backgroundColor: "#0d0d0d", height: "100%", }} >
                <View style={{ width: "100%", }}>
                    <Header />
                </View>
                <View style={{ paddingHorizontal: 25, paddingVertical: 10, borderBottomColor: "#202020", borderBottomWidth: 1, backgroundColor: "#161616" }}>
                    <Text style={{ fontFamily: "Poppins_500Medium", letterSpacing: 1.2, color: "#8a8a8a", fontSize: 16, textAlign: "center" }}>SUBSCRIPTIONS</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 20, marginBottom: 60, marginTop: 10 }} >
                    {channels.length === 0 ? <View style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "white", letterSpacing: 0.5, fontSize: 16, textAlign: "center" }}>Please subscribe some channels and then check back here</Text>
                    </View>
                        : <FlatList
                            data={channels}
                            renderItem={({ item }) => <Subscribtion_card data={item} userData={userData} />}
                            keyExtractor={item => item._id}
                            ListFooterComponent={() => (!loading || !loadMore) ? null : <View style={{ paddingVertical: 20 }}>
                                <ActivityIndicator size="large" color="#ffffff" />
                            </View>}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                            }
                        />
                    }

                </View>
                <View style={{ width: "100%", position: "absolute", bottom: 0, }}>
                    <Navigation_bar navigation={navigation} />
                </View>
            </View>
        </SafeAreaView>
    )
}

