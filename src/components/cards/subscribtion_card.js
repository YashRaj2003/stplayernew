import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import Svg, { Path } from 'react-native-svg'

export default function Subscribtion_card({ navigation, data }) {
    const [subscribed, setsubscribed] = useState(false)
    return (
        <TouchableOpacity style={{ backgroundColor: "#202020", borderWidth: 1, borderColor: "#54545450", marginVertical: 10 }} onPress={() => navigation.navigate('channel')}>
            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-around", padding: 7 }}>
                <TouchableOpacity style={{ width: 45, height: 45, }}>
                    <Image source={{ uri: "https://yt3.ggpht.com/CVvE7vApeq2jgHhty_LsDBVJPnp-msvs7r3spAZo_14T_nBqd1CWTjhUdjg1TTAztO7MOxu2=s68-c-k-c0x00ffffff-no-rj" }} style={{ height: "100%", width: "100%" }} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 8, }}>
                    <Text numberOfLines={1} style={{ width: "100%", fontWeight: "500", fontSize: 14, fontFamily: "Poppins_500Medium", letterSpacing: 0.2, color: "white" }} >Labour Law Advisor </Text>
                    <Text numberOfLines={1} style={{ width: "100%", fontWeight: "500", fontSize: 12, fontFamily: "Poppins_300Light", letterSpacing: 0.8, color: "#c4c4c4" }} >314k subscribers</Text>
                </View>
                {subscribed === true ? <TouchableOpacity onPress={() => setsubscribed(false)} activeOpacity={0.5} style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: "#111013", flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
                    <Text style={{ color: "white", fontFamily: "Poppins_500Medium", fontSize: 13, marginTop: 1 }} >Unsubscribe</Text>
                </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => setsubscribed(true)} activeOpacity={0.5} style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: "white", flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
                        <Text style={{ color: "black", fontFamily: "Poppins_500Medium", fontSize: 13, marginTop: 1 }} >Subscribe</Text>
                    </TouchableOpacity>
                }
            </View>
        </TouchableOpacity>
    )
}