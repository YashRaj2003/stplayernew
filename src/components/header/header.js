import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { images } from "../images"
import { LinearGradient } from 'expo-linear-gradient'
export default function Header() {
    return (
        // <LinearGradient colors={['#26223A', '#1E1B2C', '#111013']} locations={[0, 0.5, 1]} style={{ height: 60, width: "100%", }} >
        <View style={{ flexDirection: "row", backgroundColor: "#121212", alignItems: "center", borderBottomWidth: 0.3, borderBottomColor: "#909090", paddingHorizontal: 12, paddingTop: 5, height: 50, width: "100%", }}>
            <Image source={images.logo} style={{ height: 45, width: 140 }} />
        </View>
        // </LinearGradient>
    )
}

const styles = StyleSheet.create({})