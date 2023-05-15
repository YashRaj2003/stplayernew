import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { icons } from '../icons'
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Rect, Circle, Polyline, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
export default function Navigation_bar() {
    const route = useRoute();
    const navigation = useNavigation();

    return (
        <View style={{ height: 65, width: "100%" }}>
            <View colors={['#111013', '#1C1A28']} style={{ height: "100%", backgroundColor: "#0d0dod" }} >
                <LinearGradient colors={['#111013', '#FFFFFF50', '#FFFFFF70', '#FFFFFF50', '#111013']} style={{ height: 0.5, width: "100%", }} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} ></LinearGradient>
                <View style={{ flexDirection: "row", alignItems: "center", height: "100%", justifyContent: "space-between", paddingHorizontal: 15 }}>
                    <TouchableOpacity style={{ height: 50, width: 50, flexDirection: "row", alignItems: "center", justifyContent: "center", position: "relative" }} onPress={() => navigation.navigate('home')}>
                        {route.name === "home" ? <Image source={icons.radial} style={{ height: 50, width: 50, opacity: 0.5, }} blurRadius={30} /> : null}
                        <Ionicons name="ios-home-outline" size={30} color="#e2e2e2" style={{ position: "absolute", justifyContent: 'center', alignItems: 'center', }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 50, width: 50, flexDirection: "row", alignItems: "center", justifyContent: "center", position: "relative" }} onPress={() => navigation.navigate('trending')}>
                        {route.name === "trending" ? <Image source={icons.radial} style={{ height: 50, width: 50, opacity: 0.3 }} blurRadius={25} /> : null}
                        <MaterialIcons name="explore" size={30} color="#e2e2e2" style={{ position: "absolute", justifyContent: 'center', alignItems: 'center', }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 50, width: 50, flexDirection: "row", alignItems: "center", justifyContent: "center", position: "relative" }} onPress={() => navigation.navigate('add')}>
                        {route.name === "add" ? <Image source={icons.radial} style={{ height: 50, width: 50, opacity: 0.3 }} blurRadius={25} /> : null}
                        <Ionicons name="ios-add-circle-outline" size={36} color="#e2e2e2" style={{ position: "absolute", justifyContent: 'center', alignItems: 'center', }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 50, width: 50, flexDirection: "row", alignItems: "center", justifyContent: "center", position: "relative" }} onPress={() => navigation.navigate('subscriptions')}>
                        {route.name === "subscriptions" ? <Image source={icons.radial} style={{ height: 50, width: 50, opacity: 0.3 }} blurRadius={25} /> : null}
                        <MaterialIcons name="subscriptions" size={30} color="#e2e2e2" style={{ position: "absolute", justifyContent: 'center', alignItems: 'center', }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 50, width: 50, flexDirection: "row", alignItems: "center", justifyContent: "center", position: "relative" }} onPress={() => navigation.navigate('settings')}>
                        {route.name === "settings" ? <Image source={icons.radial} style={{ height: 50, width: 50, opacity: 0.3 }} blurRadius={25} /> : null}
                        <Ionicons name="settings-outline" size={30} color="#e2e2e2" style={{ position: "absolute", justifyContent: 'center', alignItems: 'center', }} />
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})