import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from "../components/colors"
import { LinearGradient } from 'expo-linear-gradient'
import Thumbnail_card from '../components/cards/thumbnail_card'
import Navigation_bar from '../components/footer/navigation_bar'
import Header from '../components/header/header'
export default function Add({ navigation }) {
    return (
        <SafeAreaView >
            <LinearGradient colors={['#111013', '#1B1716', '#3E2E24']} locations={[0, 0.5, 1]} style={{ paddingBottom: 10, backgroundColor: colors.background, height: "100%", }} >
                <View style={{ width: "100%", }}>
                    <Header />
                </View>
                <ScrollView style={{ paddingHorizontal: 15, marginBottom: 60, }} scrollToOverflowEnabled={true}  >
                    <TouchableOpacity style={{ marginVertical: 10, height: 50, width: "100%", backgroundColor: "white" }}>

                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginVertical: 10, height: 50, width: "100%", backgroundColor: "white" }}>

                    </TouchableOpacity>
                </ScrollView>
                <View style={{ width: "100%", position: "absolute", bottom: 0, }}>
                    <Navigation_bar navigation={navigation} />
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}

