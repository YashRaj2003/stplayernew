import { View, Text, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'

export default function Slideup({ children }) {
    const [yValue] = useState(new Animated.Value(0));
    useEffect(() => {
        Animated.timing(yValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }, []);


    return (
        <Animated.View style={{
            transform: [{
                translateY: yValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [400, 0]
                })
            }],
        }}>
            {children}
        </Animated.View>
    )
}