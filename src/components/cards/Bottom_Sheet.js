import { Button, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

export default function Bottom_Sheet({ children, isopen, isclose }) {
    const [modal_content, setmodal_content] = useState({
        height: 1,
        width: 1,
    })
    const bottomSheetModalRef = useRef(null);

    useEffect(() => {
        if (isopen === false) {

            const close = useCallback(() => {
                bottomSheetModalRef.current?.absent();
            }, []);
        }
        if (isopen === true) {
            const open = useCallback(() => {
                bottomSheetModalRef.current?.present();
            }, []);
        }


    }, [])

    const onLayout = (event) => {
        const { x, y, height, width } = event.nativeEvent.layout;
        setmodal_content({ height: height, width: width })
    }
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <TouchableWithoutFeedback >
                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        snapPoints={[modal_content.height + 36, "50%"]}
                        initialSnapIndex={0}
                        shouldMeasureContentHeight={true}
                        style={{ zIndex: 10 }}
                        backgroundComponent={null}
                        handleStyle={{ display: 'none' }}
                    >

                        <View style={{ alignSelf: "center", marginVertical: 15, height: 3, width: "30%", backgroundColor: "#898989", borderRadius: 5, }}>

                        </View>
                        <View onLayout={onLayout} style={{}}>

                            <View style={{ height: 3, backgroundColor: "#cbcbcb", borderTopLeftRadius: 9, borderTopRightRadius: 9 }}>

                            </View>
                            {children}
                            <View style={{ height: 100, backgroundColor: "#121212", }}></View>
                        </View>
                    </BottomSheetModal>
                </TouchableWithoutFeedback>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({})