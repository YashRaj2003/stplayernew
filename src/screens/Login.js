import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path, } from 'react-native-svg'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import firebase from 'firebase/compat/app'
import { firebaseConfig } from '../utils/firebaseconfig'
import env from './env'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ onLogin }) {
    const [phonenumber, setphonenumber] = useState({
        countrycode: "91",
        phonenumber: ''
    })
    const [getotp, setgetotp] = useState(false);
    const recaptchaVerifier = React.useRef(null);
    const [verificationId, setVerificationId] = React.useState();
    const [verificationCode, setVerificationCode] = React.useState();
    const [show_resendotp, setshow_resendotp] = useState(false);
    const [isInit, setisInit] = useState(false)

    useEffect(() => {
        setTimeout(function () {
            setisInit(true)
        }, 1000)
    }, [])


    const handlephonenumber = (type, number) => {
        if (type === "countrycode") {
            setphonenumber({ phonenumber: phonenumber.phonenumber, countrycode: number })
        }
        if (type === "number") {
            setphonenumber({ countrycode: phonenumber.countrycode, phonenumber: number })
        }
    }

    async function submit() {
        if ((phonenumber.countrycode + phonenumber.phonenumber).length < 11) {
            alert("please enter a valid mobile number")
        }
        else {
            setgetotp(true)
            signinwithphonenumber("+" + phonenumber.countrycode + phonenumber.phonenumber)
        }
    }

    async function handleotp(otp) {
        setVerificationCode(otp);
    }


    async function signinwithphonenumber(phoneNumber) {
        const phoneprovider = new firebase.auth.PhoneAuthProvider;
        phoneprovider.verifyPhoneNumber(phoneNumber, recaptchaVerifier.current).then(setVerificationId);
        setTimeout(() => {
            setshow_resendotp(true)
        }, 30000);

    }
    async function verifyotp() {
        const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
        firebase.auth().signInWithCredential(credential).then(async (result) => {
            const user = result.user;
            setVerificationCode('');
            const data = {
                accessToken: user.accessToken,
                displayName: user.displayName,
                email: user.email,
                emailVerified: user.emailVerified,
                isAnonymous: user.isAnonymous,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                uid: user.uid,
                metadata: user.metadata,
                _id: user.uid,
                id: user.uid
            }

            let response = await axios.get(`${env.API_BASE_URL}/users/${user.uid}`).then((res) => res?.data)
            if (response.user === null) {
                await axios.request({ url: `${env.API_BASE_URL}/users`, method: "POST", headers: { "Accept": "*/*", }, data: data }).then(async res => {
                    // updateUser(res.data.user);
                    await AsyncStorage.setItem('user', JSON.stringify(res.data.user))
                    onLogin(true, res.data.user);
                    console.log("created :" + res.data.user)
                    return
                }).catch(err => console.log(err));
            } else {
                // updateUser(response.user);
                await AsyncStorage.setItem('user', JSON.stringify(response.user))
                onLogin(true, response.user);
                console.log("exist :" + response.user)
                return
            }
        }).catch(err => alert(err.message))
    }

    async function signinwithgoogle() {

    }
    return (
        <SafeAreaView>
            <LinearGradient colors={['#F6E5FE', '#FFF5EB', '#FFEDF3']} locations={[0, 0.5, 1]} style={{ paddingBottom: 10, backgroundColor: "#0d0d0d", height: "100%", position: "relative", }} >
                {isInit && (
                    <FirebaseRecaptchaVerifierModal
                        ref={recaptchaVerifier}
                        firebaseConfig={firebaseConfig}
                        attemptInvisibleVerification={true}
                    />
                )}
                <View style={{ padding: 15 }}>
                    <Text style={{ color: "#121212", fontFamily: "JetBrainsMono_700Bold", fontSize: 32, }}>ST Player</Text>
                </View>
                <>
                    <View style={{ position: "absolute", top: "10%", left: "5%" }}>
                        <Svg width="44" height="50" viewBox="0 0 44 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M21.9472 0C21.9425 2.02875 21.393 4.20031 20.8934 6.125C19.1271 12.93 15.44 18.8615 9.91846 21.9512C7.92137 23.0687 5.80615 23.8962 3.64029 24.4094C2.44828 24.6919 1.168 24.6706 0 25V25.0625C1.46957 25.0625 2.94779 25.4115 4.3789 25.786C8.70968 26.9192 12.8831 29.3775 15.9281 33.25C18.2518 36.2051 19.9016 39.9598 20.8773 43.8125C21.3722 45.7665 21.9424 47.9431 21.9472 50H22.0528C22.0576 47.9464 22.6287 45.7632 23.1227 43.8125C24.1083 39.9209 25.7793 36.1702 28.1246 33.1875C31.1479 29.3426 35.3239 26.9104 39.6211 25.786C41.051 25.4118 42.5317 25.0625 44 25.0625V25C42.832 24.6706 41.5517 24.6919 40.3597 24.4094C38.1952 23.8965 36.0774 23.0682 34.0815 21.9512C28.5611 18.8616 24.8725 12.9286 23.1066 6.125C22.6082 4.20494 22.0575 2.02381 22.0528 0H21.9472Z" fill="#FFE2D5" />
                            <Path d="M21.2806 6.22549C21.5299 5.26474 21.7961 4.2276 22.0002 3.16909C22.2045 4.22874 22.4707 5.26708 22.7194 6.22549C24.5027 13.0959 28.2405 19.1406 33.8862 22.3002C35.9136 23.4349 38.0661 24.277 40.2675 24.7987C40.5992 24.8773 40.9367 24.9332 41.2713 24.979C40.6763 25.1022 40.0905 25.2497 39.5198 25.399C35.1494 26.5426 30.8941 29.0182 27.8102 32.9403C25.423 35.9761 23.7311 39.7811 22.7349 43.7143C22.7173 43.784 22.6995 43.8542 22.6816 43.9246C22.4466 44.8513 22.1955 45.8413 22.0002 46.8502C21.8055 45.8449 21.5552 44.8583 21.3204 43.9326C21.3019 43.8595 21.2834 43.7867 21.2651 43.7143C20.2792 39.8215 18.6089 36.0121 16.2425 33.0028C13.1378 29.0543 8.88571 26.5518 4.48016 25.399C3.90922 25.2496 3.32361 25.1022 2.72897 24.9789C3.06348 24.9332 3.40092 24.8772 3.73252 24.7987C5.93534 24.2767 8.08517 23.4354 10.1138 22.3003L9.91846 21.9512L10.1138 22.3003C15.7605 19.1405 19.497 13.0972 21.2806 6.22549Z" stroke="black" stroke-opacity="0.65" stroke-width="0.8" />
                        </Svg>
                    </View>
                    <View style={{ position: "absolute", top: "30%", right: "25%" }}>
                        <Svg width="44" height="50" viewBox="0 0 44 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M21.9472 0C21.9425 2.02875 21.393 4.20031 20.8934 6.125C19.1271 12.93 15.44 18.8615 9.91846 21.9512C7.92137 23.0687 5.80615 23.8962 3.64029 24.4094C2.44828 24.6919 1.168 24.6706 0 25V25.0625C1.46957 25.0625 2.94779 25.4115 4.3789 25.786C8.70968 26.9192 12.8831 29.3775 15.9281 33.25C18.2518 36.2051 19.9016 39.9598 20.8773 43.8125C21.3722 45.7665 21.9424 47.9431 21.9472 50H22.0528C22.0576 47.9464 22.6287 45.7632 23.1227 43.8125C24.1083 39.9209 25.7793 36.1702 28.1246 33.1875C31.1479 29.3426 35.3239 26.9104 39.6211 25.786C41.051 25.4118 42.5317 25.0625 44 25.0625V25C42.832 24.6706 41.5517 24.6919 40.3597 24.4094C38.1952 23.8965 36.0774 23.0682 34.0815 21.9512C28.5611 18.8616 24.8725 12.9286 23.1066 6.125C22.6082 4.20494 22.0575 2.02381 22.0528 0H21.9472Z" fill="#FFE2D5" />
                            <Path d="M21.2806 6.22549C21.5299 5.26474 21.7961 4.2276 22.0002 3.16909C22.2045 4.22874 22.4707 5.26708 22.7194 6.22549C24.5027 13.0959 28.2405 19.1406 33.8862 22.3002C35.9136 23.4349 38.0661 24.277 40.2675 24.7987C40.5992 24.8773 40.9367 24.9332 41.2713 24.979C40.6763 25.1022 40.0905 25.2497 39.5198 25.399C35.1494 26.5426 30.8941 29.0182 27.8102 32.9403C25.423 35.9761 23.7311 39.7811 22.7349 43.7143C22.7173 43.784 22.6995 43.8542 22.6816 43.9246C22.4466 44.8513 22.1955 45.8413 22.0002 46.8502C21.8055 45.8449 21.5552 44.8583 21.3204 43.9326C21.3019 43.8595 21.2834 43.7867 21.2651 43.7143C20.2792 39.8215 18.6089 36.0121 16.2425 33.0028C13.1378 29.0543 8.88571 26.5518 4.48016 25.399C3.90922 25.2496 3.32361 25.1022 2.72897 24.9789C3.06348 24.9332 3.40092 24.8772 3.73252 24.7987C5.93534 24.2767 8.08517 23.4354 10.1138 22.3003L9.91846 21.9512L10.1138 22.3003C15.7605 19.1405 19.497 13.0972 21.2806 6.22549Z" stroke="black" stroke-opacity="0.65" stroke-width="0.8" />
                        </Svg>
                    </View>
                    <View style={{ position: "absolute", top: "25%", right: "5%" }}>
                        <Svg width="71" height="85" viewBox="0 0 71 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M35.4149 0C35.4073 3.44887 34.5205 7.14053 33.7144 10.4125C30.8642 21.981 24.9145 32.0645 16.0048 37.317C12.7822 39.2168 9.36902 40.6235 5.8741 41.496C3.95063 41.9763 1.88473 41.94 0 42.5V42.6062C2.37135 42.6062 4.75666 43.1995 7.06595 43.8362C14.0543 45.7626 20.7886 49.9417 25.7022 56.525C29.4518 61.5487 32.114 67.9317 33.6884 74.4813C34.4869 77.8031 35.4071 81.5032 35.4149 85H35.5851C35.5929 81.5089 36.5144 77.7974 37.3116 74.4813C38.902 67.8656 41.5983 61.4893 45.3829 56.4187C50.2614 49.8824 57 45.7476 63.9341 43.8362C66.2414 43.2001 68.6308 42.6062 71 42.6062V42.5C69.1153 41.94 67.0494 41.9763 65.1259 41.496C61.6332 40.624 58.2157 39.2159 54.9952 37.317C46.0872 32.0648 40.1352 21.9787 37.2856 10.4125C36.4815 7.14839 35.5927 3.44048 35.5851 0H35.4149Z" fill="#F4E1FE" />
                            <Path d="M34.2969 10.556C34.7177 8.84821 35.1669 7.00292 35.5004 5.12502C35.8342 7.00484 36.2834 8.85244 36.7031 10.556C39.5753 22.2144 45.595 32.4711 54.6905 37.8339C57.959 39.7611 61.43 41.1917 64.9806 42.0782C65.6677 42.2497 66.3705 42.3578 67.0593 42.4471C65.9418 42.6737 64.8418 42.9636 63.7746 43.2578C56.7247 45.2012 49.8679 49.4065 44.902 56.0599C41.058 61.2101 38.3328 67.666 36.7282 74.341C36.7001 74.458 36.6718 74.5757 36.6433 74.6939C36.2456 76.3458 35.8205 78.1117 35.5003 79.9066C35.1811 78.1178 34.7574 76.358 34.36 74.7076C34.3304 74.5848 34.301 74.4626 34.2718 74.341C32.6836 67.7344 29.9932 61.271 26.183 56.1661C21.1835 49.4677 14.3318 45.2168 7.22541 43.2578C6.15752 42.9634 5.05815 42.6735 3.94132 42.447C4.62988 42.3577 5.33248 42.2497 6.01943 42.0782C9.57229 41.1912 13.039 39.7619 16.3095 37.8339C25.4067 32.4709 31.4241 22.2167 34.2969 10.556Z" stroke="black" stroke-opacity="0.64" stroke-width="1.2" />
                        </Svg>
                    </View>
                </>
                <View style={{ width: "100%", flexDirection: "column", paddingHorizontal: 25, position: "absolute", zIndex: 50, bottom: "3%" }}>

                    <View style={{ width: "100%", flexDirection: "row", }}>
                        {getotp === false ?
                            <>
                                <TextInput onChangeText={(event) => handlephonenumber("countrycode", event)} placeholder='+91' defaultValue='91' keyboardType='phone-pad' maxLength={3} style={{ fontFamily: "JetBrainsMono_500Medium", height: 50, width: 70, backgroundColor: "transparent", borderRadius: 10, borderWidth: 2, borderColor: "#12121250", paddingHorizontal: 15 }} />
                                <TextInput onChangeText={(event) => handlephonenumber("number", event)} placeholder='Enter your phone number' keyboardType='phone-pad' maxLength={10} style={{ fontFamily: "JetBrainsMono_500Medium", height: 50, marginLeft: 20, width: "100%", flex: 1, backgroundColor: "transparent", borderRadius: 10, borderWidth: 2, borderColor: "#12121250", paddingHorizontal: 15 }} />
                            </> :
                            <>
                                <TextInput onChangeText={(event) => handleotp(event)} placeholder='enter otp sent to your number' autoComplete='sms-otp' textContentType='oneTimeCode' keyboardType='phone-pad' maxLength={6} style={{ fontFamily: "JetBrainsMono_500Medium", height: 50, width: "100%", flex: 1, backgroundColor: "transparent", borderRadius: 10, borderWidth: 2, borderColor: "#12121250", paddingHorizontal: 15 }} />
                            </>}

                    </View>
                    {/* {show_resendotp === true && getotp === true ? <TouchableOpacity style={{ marginTop: 20, alignSelf: "flex-end" }} onPress={() => resendotp()} >
                        <Text style={{ fontFamily: "JetBrainsMono_500Medium", fontSize: 17, color: "blue" }}>Resend OTP </Text>
                    </TouchableOpacity>
                        : null} */}
                    <TouchableOpacity onPress={() => getotp === false ? submit() : verificationCode.length >= 6 ? verifyotp() : alert("please add a valid otp")} activeOpacity={0.7} style={{ marginTop: 30, height: 60, width: "100%", backgroundColor: "#121214", borderRadius: 10, justifyContent: "center" }}>
                        <Text style={{ color: "white", alignSelf: "center", fontFamily: "JetBrainsMono_500Medium", fontSize: 18, }}>{getotp === false ? "Get Otp" : "Login"}</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => signinwithgoogle()} activeOpacity={0.7} style={{ marginTop: 20, height: 60, width: "100%", backgroundColor: "#121214", borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <AntDesign name="google" size={24} color="white" />
                        <Text style={{ marginLeft: 10, color: "white", alignSelf: "center", fontFamily: "JetBrainsMono_500Medium", fontSize: 18, }}>Continue with Google</Text>
                    </TouchableOpacity> */}
                </View>
            </LinearGradient>
        </SafeAreaView >
    )
}



