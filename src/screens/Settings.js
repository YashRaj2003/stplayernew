import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from "../components/colors"
import { LinearGradient } from 'expo-linear-gradient'
import Navigation_bar from '../components/footer/navigation_bar'
import { useRecoilState } from 'recoil'
import { user } from '../../atom/user'
import { auth } from '../utils/firebaseconfig'
import Svg, { Defs, Path, Polygon } from 'react-native-svg'
export default function Settings({ navigation }) {
    const [userinfo, setuserinfo] = useRecoilState(user);




    return (
        <SafeAreaView >
            <LinearGradient colors={['#111013', '#1B1716', '#3E2E24']} locations={[0, 0.5, 1]} style={{ paddingBottom: 10, backgroundColor: colors.background, height: "100%", }} >

                <TouchableOpacity style={{ height: 50, width: "100%", backgroundColor: "blue" }} onPress={() => { auth.signOut(); setuserinfo(null); }}>
                    <Text>Signout</Text>
                </TouchableOpacity>
                <ScrollView style={{ height: "100%", flex: 1, }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 25, paddingVertical: 20 }}>
                        {/* <TouchableOpacity style={{ height: 40, width: 60, flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
                            <Svg style={{ transform: [{ rotate: '180deg' }] }} width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M2 4.87494H0.875V7.12494H2V4.87494ZM2 7.12494H30.5V4.87494H2V7.12494ZM25.0685 9.5178e-08C25.0685 3.89997 28.1374 7.125 32 7.125V4.875C29.449 4.875 27.3185 2.72744 27.3185 0L25.0685 9.5178e-08ZM32 4.875C28.1374 4.875 25.0684 8.09999 25.0684 12H27.3184C27.3184 9.27259 29.4489 7.125 32 7.125V4.875Z" fill="white" />
                            </Svg>
                        </TouchableOpacity> */}
                        <Text style={{ fontFamily: "JetBrainsMono_500Medium", color: "white", fontSize: 16 }}>Settings</Text>
                    </View>

                    <View style={{ height: 60, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%", paddingHorizontal: 25 }}>
                        <View>
                            <Text style={{ fontFamily: "JetBrainsMono_500Medium", color: "white", fontSize: 16 }}>{(userinfo.first_name + " " + userinfo.last_name).length <= 1 ? "No name present" : (userinfo.first_name[0].toUpperCase() + userinfo.first_name.substring(1)) + " " + (userinfo.last_name ? (userinfo.last_name[0].toUpperCase() + userinfo.last_name.substring(1)) : "")}</Text>
                            <Text style={{ fontFamily: "JetBrainsMono_500Medium", color: "white", fontSize: 16 }}>{userinfo.phone}</Text>
                        </View>
                    </View>


                </ScrollView>



                <View style={{ width: "100%", position: "relative", bottom: -7 }}>
                    <Navigation_bar navigation={navigation} />
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}
