import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, useWindowDimensions, Dimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Navigation_bar from '../components/footer/navigation_bar';
const screen_height = Dimensions.get('window').height;
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home!</Text>
        </View>
    );
}

function SettingsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings!</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();
const FirstRoute = () => (
    <View style={[{ flex: 1, height: "100%", }]} >
        <Text>Hello</Text>
    </View>
);
const SecondRoute = () => (
    <View style={[{ flex: 1, height: "100%", }]} >
    </View>
);
const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: SecondRoute,
    fourth: SecondRoute,
});

export default function Channel({ navigation }) {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Home' },
        { key: 'second', title: 'Videos' },
        { key: 'third', title: 'About' },
    ]);

    return (
        <SafeAreaView >
            <View style={{ paddingBottom: 10, backgroundColor: "#141214", height: "100%", }} >
                <ScrollView style={{ flex: 1, height: "100%", }} stickyHeaderIndices={[1]} scrollToOverflowEnabled={true}  >
                    <View style={{ paddingHorizontal: 15, }}>
                        <View style={{ height: 150, width: 150, borderWidth: 1, borderRadius: 150, alignSelf: "center", marginTop: 50, borderColor: "#ffffff40", justifyContent: "center", alignItems: "center" }}>
                            <View style={{ height: 125, width: 125, borderWidth: 1, borderRadius: 150, borderColor: "#ffffff50", justifyContent: "center", alignItems: "center" }}>
                                <Image source={{ uri: "https://yt3.ggpht.com/CVvE7vApeq2jgHhty_LsDBVJPnp-msvs7r3spAZo_14T_nBqd1CWTjhUdjg1TTAztO7MOxu2=s68-c-k-c0x00ffffff-no-rj" }} style={{ height: 100, width: 100, borderRadius: 100 }} />
                            </View>
                        </View>
                        <Text style={{ fontSize: 25, color: "white", fontFamily: "Balivia", marginTop: 20, alignSelf: "center", letterSpacing: 1.5 }}>Labour Law Advisor</Text>
                    </View>
                    <View style={{ flex: 1, height: screen_height, backgroundColor: "blue", marginTop: 50 }}>

                    </View>
                </ScrollView>
                <View style={{ width: "100%", }}>
                    <Navigation_bar navigation={navigation} />
                </View>
            </View >
        </SafeAreaView >
    )
}
