import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from "../components/colors"
import { LinearGradient } from 'expo-linear-gradient'
import Thumbnail_card from '../components/cards/thumbnail_card'
import Navigation_bar from '../components/footer/navigation_bar'
import Header from '../components/header/header'
export default function Subscriptions({ navigation }) {
    return (
        <SafeAreaView >
            <LinearGradient colors={['#111013', '#1B1716', '#3E2E24']} locations={[0, 0.5, 1]} style={{ paddingBottom: 10, backgroundColor: colors.background, height: "100%", }} >
                <View style={{ width: "100%", }}>
                    <Header />
                </View>
                <ScrollView style={{ flex: 1, paddingHorizontal: 15, marginBottom: 60 }} scrollToOverflowEnabled={true}  >
                    <View>
                        <Thumbnail_card />
                        <Thumbnail_card />
                        <Thumbnail_card />
                        <Thumbnail_card />
                        <Thumbnail_card />
                        <Thumbnail_card />
                    </View>
                </ScrollView>
                <View style={{ width: "100%", position: "absolute", bottom: 0, }}>
                    <Navigation_bar navigation={navigation} />
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}

