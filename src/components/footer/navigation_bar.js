import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { icons } from '../icons'
import { useRoute } from '@react-navigation/native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
export default function Navigation_bar({ navigation }) {
    const route = useRoute();

    return (
        <View style={{ height: 65, width: "100%" }}>
            <LinearGradient colors={['#111013', '#1C1A28']} style={{ height: "100%", }} >
                <LinearGradient colors={['#111013', '#FFFFFF80', '#FFFFFF', '#FFFFFF80', '#111013']} style={{ height: 0.5, width: "100%", }} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} ></LinearGradient>
                <View style={{ flexDirection: "row", alignItems: "center", height: "100%", justifyContent: "space-between", paddingHorizontal: 25 }}>
                    <TouchableOpacity style={{ height: 50, width: 50, flexDirection: "row", alignItems: "center", justifyContent: "center" }} onPress={() => navigation.navigate('home')}>
                        {/* {route.name === "Home" ? <Image source={icons.radial} style={{ height: 50, width: 50, }} /> : null} */}
                        {route.name === "home" ? <Image source={icons.radial} style={{ height: 50, width: 50, }} /> : null}
                        <Ionicons name="ios-home-outline" size={30} color="#e2e2e2" style={{ position: "absolute" }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 50, width: 50, flexDirection: "row", alignItems: "center", justifyContent: "center" }} onPress={() => navigation.navigate('trending')}>
                        {route.name === "trending" ? <Image source={icons.radial} style={{ height: 50, width: 50, }} /> : null}
                        <MaterialIcons name="explore" size={30} color="#e2e2e2" style={{ position: "absolute" }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 50, width: 50, flexDirection: "row", alignItems: "center", justifyContent: "center" }} onPress={() => navigation.navigate('add')}>
                        {route.name === "add" ? <Image source={icons.radial} style={{ height: 50, width: 50, }} /> : null}
                        <Ionicons name="ios-add-circle-outline" size={36} color="#e2e2e2" style={{ position: "absolute" }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 50, width: 50, flexDirection: "row", alignItems: "center", justifyContent: "center" }} onPress={() => navigation.navigate('subscriptions')}>
                        {route.name === "subscriptions" ? <Image source={icons.radial} style={{ height: 50, width: 50, }} /> : null}
                        <MaterialIcons name="subscriptions" size={30} color="#e2e2e2" style={{ position: "absolute" }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 50, width: 50, flexDirection: "row", alignItems: "center", justifyContent: "center" }} onPress={() => navigation.navigate('settings')}>
                        {route.name === "settings" ? <Image source={icons.radial} style={{ height: 50, width: 50, }} /> : null}
                        <Ionicons name="settings-outline" size={30} color="#e2e2e2" style={{ position: "absolute" }} />
                    </TouchableOpacity>

                </View>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({})