import { View, Text, TouchableOpacity, } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navigation_bar from '../components/footer/navigation_bar'
import Header from '../components/header/header'
export default function Add({ navigation }) {
    return (
        <SafeAreaView >
            <View style={{ paddingBottom: 10, backgroundColor: "#0d0d0d", height: "100%", }} >
                <View style={{ width: "100%", }}>
                    <Header />
                </View>
                <View style={{ paddingHorizontal: 15, marginBottom: 60, alignItems: "center", justifyContent: "center", height: "100%" }}  >
                    <Text style={{ color: "white", fontSize: 16 }}>To upload videos please visit ST Player studio </Text>
                    <TouchableOpacity>
                        <Text style={{ color: "#2596be", fontSize: 16 }}>https://studio.st-player.in</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: "100%", position: "absolute", bottom: 0, }}>
                    <Navigation_bar navigation={navigation} />
                </View>
            </View>
        </SafeAreaView>
    )
}

