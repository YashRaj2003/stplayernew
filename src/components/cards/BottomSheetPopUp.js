import { View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
export default function BottomSheetPopUp({ children, close }) {
    const bottomSheetModalRef = useRef(null);
    const [modal_content, setmodal_content] = useState({
        height: 1,
        width: 1,
    })

    const onLayout = (event) => {
        const { x, y, height, width } = event.nativeEvent.layout;
        setmodal_content({ height: height, width: width })
    }

    return (
        // <View style={{ position: "absolute", height: "100%", width: "100%" }} >
        //     <TouchableOpacity style={{ height: "100%", width: "100%", zIndex: 10, backgroundColor: "#04030999", }} onPress={() => close(false)}>
        //     </TouchableOpacity>
        //     <View style={{ zIndex: 20, bottom: -9, position: "absolute", width: "100%" }}>
        //         <View style={{ alignSelf: "center", marginVertical: 15, height: 3, width: "30%", backgroundColor: "#898989", borderRadius: 5, }}>

        //         </View>

        //     </View>
        // </View>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>

                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    snapPoints={[modal_content.height + 36, "50%"]}
                    initialSnapIndex={0}
                    shouldMeasureContentHeight={true}
                    style={{ zIndex: 10 }}
                    backgroundComponent={null}
                    handleStyle={{ display: 'none' }}
                >
                    <View onLayout={onLayout} >
                        {children}
                    </View>
                </BottomSheetModal>

            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}