import Constants from 'expo-constants';
import {
  OAUTH_CLIENT_ID_IOS,
  OAUTH_CLIENT_ID_ANDROID,
  OAUTH_CLIENT_ID_EXPO,
} from '@env';

const googleSignInConfig = {
  expoClientId: Constants.manifest?.extra?.expoClientId || OAUTH_CLIENT_ID_EXPO,
  iosClientId: OAUTH_CLIENT_ID_IOS,
  androidClientId: OAUTH_CLIENT_ID_ANDROID,
};

export default googleSignInConfig;
