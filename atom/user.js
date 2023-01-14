import { atom, selector } from 'recoil'
import ReactNativeRecoilPersist from "react-native-recoil-persist";

const user = atom({
    key: 'user',
    default: null,
    effects_UNSTABLE: [ReactNativeRecoilPersist.persistAtom],

})

export { user };