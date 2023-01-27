import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from "../components/colors"
import { LinearGradient } from 'expo-linear-gradient'
import Navigation_bar from '../components/footer/navigation_bar'
import Header from '../components/header/header'
import Subscribtion_card from '../components/cards/subscribtion_card'
export default function Subscriptions({ navigation }) {
    return (
        <SafeAreaView >
            <View style={{ paddingBottom: 10, backgroundColor: "#0d0d0d", height: "100%", }} >
                <View style={{ width: "100%", }}>
                    <Header />
                </View>
                <ScrollView style={{ flex: 1, paddingHorizontal: 15, marginBottom: 60 }} scrollToOverflowEnabled={true}  >
                    <View>
                        <Subscribtion_card navigation={navigation} />
                        <Subscribtion_card navigation={navigation} />
                        <Subscribtion_card navigation={navigation} />
                        <Subscribtion_card navigation={navigation} />
                        <Subscribtion_card navigation={navigation} />
                    </View>
                </ScrollView>
                <View style={{ width: "100%", position: "absolute", bottom: 0, }}>
                    <Navigation_bar navigation={navigation} />
                </View>
            </View>
        </SafeAreaView>
    )
}

