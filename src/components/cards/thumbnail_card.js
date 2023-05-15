import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import moment from 'moment/moment';
import { useNavigation } from '@react-navigation/native';

export default function ThumbnailCard({ data }) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={{ backgroundColor: "#161616", borderWidth: 1, borderColor: "#2f2f2f", marginVertical: 10 }} onPress={() => navigation.navigate('video', { id: data?._id })}>
            <View style={{ width: "100%", aspectRatio: 16 / 9, padding: 10 }}>
                <Image source={{ uri: data?.video?.thumbnail }} style={{ height: "100%", width: "100%" }} />
            </View>
            <View style={{ height: 65, width: "100%", borderTopWidth: 1, borderColor: "#2f2f2f", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-around", padding: 10 }}>
                <TouchableOpacity style={{ width: 50, height: 50, borderWidth: 1, borderColor: "#2f2f2f", }} onPress={() => navigation.navigate('channel', { id: data?.channel?._id })}>
                    <Image source={{ uri: data?.channel?.thumbnail }} style={{ height: "100%", width: "100%" }} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 8, }}>
                    <Text numberOfLines={2} style={{ width: "100%", color: "white", fontWeight: "500", fontSize: 16, fontFamily: "Balivia", letterSpacing: 0.8, lineHeight: 16 }} >{data?.video?.title}</Text>
                    <Text numberOfLines={1} style={{ width: "100%", fontWeight: "500", fontSize: 12, color: "#b3b3b3", letterSpacing: 0.2, fontFamily: "Poppins_400Regular" }} >{data?.channel?.title} <Text >&#183;</Text> {data?.video?.views ?? 0} views <Text >&#183;</Text> {moment(data?.video?.publishedAt).startOf('seconds').fromNow()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
