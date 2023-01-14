import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'

export default function Thumbnail_card({ navigation, data }) {
    // console.log(data.snippet.thumbnails.medium)
    return (
        <TouchableOpacity style={{ backgroundColor: "white", borderWidth: 1, borderColor: "black", marginVertical: 10 }} onPress={() => navigation.navigate('video')}>
            <View style={{ width: "100%", aspectRatio: 16 / 9, }}>
                <Image source={{ uri: `https://i.ytimg.com/vi/ciF7WZXmpjU/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDAhMdNIazTdDYHytMfIbI8074A1Q` }} style={{ height: "100%", width: "100%" }} />
            </View>
            <View style={{ height: 65, width: "100%", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-around", padding: 7 }}>
                <TouchableOpacity style={{ width: 50, height: 50, }}>
                    <Image source={{ uri: "https://yt3.ggpht.com/CVvE7vApeq2jgHhty_LsDBVJPnp-msvs7r3spAZo_14T_nBqd1CWTjhUdjg1TTAztO7MOxu2=s68-c-k-c0x00ffffff-no-rj" }} style={{ height: "100%", width: "100%" }} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 8, }}>
                    <Text numberOfLines={2} style={{ width: "100%", fontWeight: "500", fontSize: 16, fontFamily: "Balivia", letterSpacing: 0.8, lineHeight: 16 }} >The Dark Side of Open Source // What really happened to Faker.js?</Text>
                    <Text numberOfLines={1} style={{ width: "100%", fontWeight: "500", fontSize: 12, color: "#606060", }} >Yesterday, a popular open-source package, Faker.js, was abruptly taken down from GitHub. Its readme simply said “What really happened to Aaron Swartz?”. Let’s take a look at why Open Source Software can be a bad deal for many independent developers. </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}