import { View, Text, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navigation_bar from '../components/footer/navigation_bar'
import Header from '../components/header/header'
import { useNavigation } from '@react-navigation/native'
export default function Add() {
    const navigation = useNavigation()
    return (
        <SafeAreaView >
            <View style={{ paddingBottom: 10, backgroundColor: "#0d0d0d", height: "100%", }} >
                <View style={{ width: "100%", }}>
                    <Header />
                    <View style={{ paddingHorizontal: 25, paddingVertical: 10, borderBottomColor: "#202020", borderBottomWidth: 1, backgroundColor: "#161616" }}>
                        <Text style={{ fontFamily: "Poppins_500Medium", letterSpacing: 1.2, color: "#8a8a8a", fontSize: 16, textAlign: "center" }}>ST PLAYER (STUDIO)</Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 15, marginBottom: 60, alignItems: "center", justifyContent: "center", height: "100%" }}  >
                    <Text style={{ color: "white", fontSize: 16 }}>To upload videos please visit ST Player studio </Text>
                    <TouchableOpacity onPress={() => Linking.openURL('https://studio.st-player.in')}>
                        <Text style={{ color: "#2596be", fontSize: 16 }}>https://studio.st-player.in</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: "100%", position: "absolute", bottom: 0, }}>
                    <Navigation_bar />
                </View>
            </View>
        </SafeAreaView>
    )
}

