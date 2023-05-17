import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './src/screens/Login';
import Welcome from './src/screens/Welcome';
import Home from './src/screens/Home';
import Settings from './src/screens/Settings';
import Trending from './src/screens/Trending';
import Add from './src/screens/Add';
import Subscriptions from './src/screens/Subscriptions';
import Video from './src/screens/Video';
import Channel from './src/screens/Channel';
import { useFonts, Poppins_100Thin, Poppins_200ExtraLight, Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { JetBrainsMono_300Light, JetBrainsMono_400Regular, JetBrainsMono_500Medium, JetBrainsMono_600SemiBold, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import History from './src/screens/History';
import Saved from './src/screens/Saved';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();


export default function App() {

  const [fontsLoaded] = useFonts({ 'Balivia': require('./assets/fonts/Balivia.ttf'), Poppins_100Thin, Poppins_200ExtraLight, Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, JetBrainsMono_300Light, JetBrainsMono_400Regular, JetBrainsMono_500Medium, JetBrainsMono_600SemiBold, JetBrainsMono_700Bold });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);


  React.useEffect(() => {
    async function getStorageData() {
      let user = await AsyncStorage.getItem('user')
      if (!user) {
        setIsLoggedIn(false);
        setUserData(null);
      }
      else {
        setIsLoggedIn(true);
        setUserData(JSON.parse(user));
      }
    }
    getStorageData()
  }, [])


  const handleLogin = (loggedIn, user) => {
    setIsLoggedIn(loggedIn);
    setUserData(user);
  };



  if (fontsLoaded) {
    return (
      <SafeAreaProvider >
        <NavigationContainer>
          <StatusBar barStyle="light-content" />
          {isLoggedIn === false ?
            <Stack.Navigator initialRouteName="welcome" >
              <Stack.Screen name="welcome" component={Welcome} options={{ headerShown: false }} />

              <Stack.Screen name="login" options={{ headerShown: false }} >
                {(props) => <Login {...props} onLogin={handleLogin} />}
              </Stack.Screen>
            </Stack.Navigator>
            :
            <Stack.Navigator initialRouteName="home" screenOptions={{
              animation: "slide_from_bottom",
              headerShown: false,
            }}>
              <Stack.Screen name="home"  >
                {(props) => <Home {...props} userData={userData} />}
              </Stack.Screen>
              <Stack.Screen name="trending" >
                {(props) => <Trending {...props} userData={userData} />}
              </Stack.Screen>
              <Stack.Screen name="add" >
                {(props) => <Add {...props} userData={userData} />}
              </Stack.Screen>
              <Stack.Screen name="settings" >
                {(props) => <Settings {...props} userData={userData} />}
              </Stack.Screen>
              <Stack.Screen name="video" >
                {(props) => <Video {...props} userData={userData} />}
              </Stack.Screen>
              <Stack.Screen name="channel">
                {(props) => <Channel {...props} userData={userData} />}
              </Stack.Screen>
              <Stack.Screen name="subscriptions"  >
                {(props) => <Subscriptions {...props} userData={userData} />}
              </Stack.Screen>
              <Stack.Screen name="history" >
                {(props) => <History {...props} userData={userData} />}
              </Stack.Screen>
              <Stack.Screen name="saved"  >
                {(props) => <Saved {...props} userData={userData} />}
              </Stack.Screen>
            </Stack.Navigator>
          }
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}


