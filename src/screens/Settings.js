import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from "../components/colors"
import { LinearGradient } from 'expo-linear-gradient'
import Navigation_bar from '../components/footer/navigation_bar'
import { useRecoilState } from 'recoil'
import { user } from '../../atom/user'
import { auth } from '../utils/firebaseconfig'
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg'
export default function Settings({ navigation }) {
    const [userinfo, setuserinfo] = useRecoilState(user);




    return (
        <SafeAreaView >
            <View style={{ paddingBottom: 10, backgroundColor: "#0d0d0d", height: "100%", }} >
                {/* <TouchableOpacity style={{ height: 50, width: "100%", backgroundColor: "blue" }} onPress={() => { auth.signOut(); setuserinfo(null); }}>
                    <Text>Signout</Text>
                </TouchableOpacity> */}
                <ScrollView style={{ height: "100%", flex: 1, }}>
                    <View style={{ paddingHorizontal: 25, paddingVertical: 20 }}>
                        <Text style={{ fontFamily: "Poppins_500Medium", letterSpacing: 1.2, color: "#8a8a8a", fontSize: 16 }}>SETTINGS</Text>
                    </View>

                    <TouchableOpacity style={{ paddingVertical: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingHorizontal: 25, borderTopColor: "#202020", borderTopWidth: 1 }}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ height: 40, width: 40, borderColor: "#242424", borderWidth: 1, alignItems: "center", justifyContent: "center" }}>
                                <MaterialIcons name="logout" size={24} color="#6b6b6b" />
                            </View>
                            <View style={{ marginLeft: 15, paddingTop: 2 }}>
                                <Text numberOfLines={1} style={{ width: "100%", fontWeight: "500", fontSize: 14, fontFamily: "Poppins_500Medium", letterSpacing: 0.2, lineHeight: 18, color: "white" }}>Profile</Text>
                                <Text numberOfLines={1} style={{ width: "100%", fontWeight: "300", fontSize: 12, fontFamily: "Poppins_300Light", letterSpacing: 0.8, color: "#c4c4c4" }} >Account details</Text>
                            </View>
                        </View>
                        <View>
                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="white" />
                            </Svg>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingVertical: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingHorizontal: 25, borderTopColor: "#202020", borderTopWidth: 1 }}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ height: 40, width: 40, borderColor: "#242424", borderWidth: 1, alignItems: "center", justifyContent: "center" }}>
                                <MaterialIcons name="logout" size={24} color="#6b6b6b" />
                            </View>
                            <View style={{ marginLeft: 15, paddingTop: 2 }}>
                                <Text numberOfLines={1} style={{ width: "100%", fontWeight: "500", fontSize: 14, fontFamily: "Poppins_500Medium", letterSpacing: 0.2, lineHeight: 18, color: "white" }}>Saved</Text>
                                <Text numberOfLines={1} style={{ width: "100%", fontWeight: "300", fontSize: 12, fontFamily: "Poppins_300Light", letterSpacing: 0.8, color: "#c4c4c4" }} >Video saved to watch later</Text>
                            </View>
                        </View>
                        <View>
                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="white" />
                            </Svg>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingVertical: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", paddingHorizontal: 25, borderTopColor: "#202020", borderTopWidth: 1 }}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ height: 40, width: 40, borderColor: "#242424", borderWidth: 1, alignItems: "center", justifyContent: "center" }}>
                                <MaterialIcons name="logout" size={24} color="#6b6b6b" />
                            </View>
                            <View style={{ marginLeft: 15, paddingTop: 2 }}>
                                <Text numberOfLines={1} style={{ width: "100%", fontWeight: "500", fontSize: 14, fontFamily: "Poppins_500Medium", letterSpacing: 0.2, lineHeight: 18, color: "white" }}>Logout</Text>
                                <Text numberOfLines={1} style={{ width: "100%", fontWeight: "300", fontSize: 12, fontFamily: "Poppins_300Light", letterSpacing: 0.8, color: "#c4c4c4" }} >Signout from this app</Text>
                            </View>
                        </View>
                        <View>
                            <Svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="white" />
                            </Svg>
                        </View>
                    </TouchableOpacity>

                </ScrollView>
                <View style={{ width: "100%", position: "relative", bottom: -7 }}>
                    <Navigation_bar navigation={navigation} />
                </View>
            </View>
        </SafeAreaView>
    )
}

