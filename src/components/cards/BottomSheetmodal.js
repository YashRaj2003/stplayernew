import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function BottomSheetmodal({ children, close }) {
    return (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', alignItems: 'flex-end', zIndex: 10, elevation: 10 }} >
            <TouchableOpacity style={{ height: "100%", width: "100%", backgroundColor: "#080309D9", position: "absolute", zIndex: 40 }} onPress={() => close(false)}>
            </TouchableOpacity>
            <View style={{ width: "100%", position: "absolute", zIndex: 50 }}>
                <View style={{ height: 3, width: 100, backgroundColor: "#898989", marginBottom: 15, alignSelf: "center", borderRadius: 3 }}></View>
                <View style={{ height: 4, width: "100%", backgroundColor: "#cdcdcd", borderTopLeftRadius: 6, borderTopRightRadius: 6 }}></View>
                <View style={{ backgroundColor: "white", }}>
                    {children}
                </View>

            </View>

        </View>
    )
}