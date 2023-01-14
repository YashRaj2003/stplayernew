import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';
import { user } from './atom/user'
import { useRecoilState, useRecoilValue } from 'recoil'
import ReactNativeRecoilPersist, { ReactNativeRecoilPersistGate, } from "react-native-recoil-persist";
import Login from './src/screens/Login';
import Welcome from './src/screens/Welcome';
import Home from './src/screens/Home';
import Settings from './src/screens/Settings';
import Trending from './src/screens/Trending';
import Add from './src/screens/Add';
import Subscriptions from './src/screens/Subscriptions';
import Video from './src/screens/Video';
import { useFonts, Poppins_100Thin, Poppins_200ExtraLight, Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { JetBrainsMono_300Light, JetBrainsMono_400Regular, JetBrainsMono_500Medium, JetBrainsMono_600SemiBold, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import Channel from './src/screens/Channel';

const Stack = createNativeStackNavigator();


export default function RecoilApp() {
  return (
    <RecoilRoot>
      <ReactNativeRecoilPersistGate store={ReactNativeRecoilPersist}>
        <GestureHandlerRootView style={{ flex: 1, zIndex: 20, }} >
          <BottomSheetModalProvider >
            <App />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ReactNativeRecoilPersistGate>
    </RecoilRoot>
  )
}


function App() {
  const [userinfo, setuserinfo] = useRecoilState(user);
  const [fontsLoaded] = useFonts({ 'Balivia': require('./assets/fonts/Balivia.ttf'), Poppins_100Thin, Poppins_200ExtraLight, Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, JetBrainsMono_300Light, JetBrainsMono_400Regular, JetBrainsMono_500Medium, JetBrainsMono_600SemiBold, JetBrainsMono_700Bold });

  if (fontsLoaded) {
    return (
      <SafeAreaProvider >
        <NavigationContainer>
          {userinfo === null ? <Stack.Navigator initialRouteName="welcome">
            <Stack.Screen name="welcome" component={Welcome} options={{ headerShown: false }} />
            <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
          </Stack.Navigator>
            :
            <Stack.Navigator initialRouteName="home" screenOptions={{ animation: 'none' }}>
              <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />
              <Stack.Screen name="trending" component={Trending} options={{ headerShown: false }} />
              <Stack.Screen name="add" component={Add} options={{ headerShown: false }} />
              <Stack.Screen name="subscriptions" component={Subscriptions} options={{ headerShown: false }} />
              <Stack.Screen name="settings" component={Settings} options={{ headerShown: false }} />
              <Stack.Screen name="video" component={Video} options={{ headerShown: false }} />
              <Stack.Screen name="channel" component={Channel} options={{ headerShown: false }} />
            </Stack.Navigator>
          }
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}

