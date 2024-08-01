import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { supabase } from '../../clients/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import {
  OAUTH_CLIENT_ID_IOS,
  OAUTH_CLIENT_ID_ANDROID,
  OAUTH_CLIENT_ID_EXPO,
} from '@env';

export default function Auth({ navigation }) {
  const { setSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Setup Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: OAUTH_CLIENT_ID_EXPO,
    iosClientId: OAUTH_CLIENT_ID_IOS,
    androidClientId: OAUTH_CLIENT_ID_ANDROID,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;

      const signInWithGoogle = async (token) => {
        setLoading(true);
        const { error, session } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            accessToken: token.accessToken,
          },
        });

        if (error) {
          Alert.alert(error.message);
        } else {
          setSession(session);
          navigation.navigate('Account');
          Alert.alert('Signed in successfully!');
        }
        setLoading(false);
      };

      signInWithGoogle(authentication);
    }
  }, [response]);

  async function signInWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      setSession(session);
      navigation.navigate('Account');
      Alert.alert('Signed in successfully!');
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('Please check your inbox for email verification!');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          label='Email'
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder='email@address.com'
          autoCapitalize='none'
          mode='outlined'
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          label='Password'
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
          placeholder='Password'
          autoCapitalize='none'
          mode='outlined'
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          mode='contained'
          loading={loading}
          disabled={loading}
          onPress={() => signInWithEmail()}
        >
          Sign In
        </Button>
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          mode='contained'
          loading={loading}
          disabled={loading}
          onPress={() => signUpWithEmail()}
        >
          Sign Up
        </Button>
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          mode='contained'
          loading={loading}
          disabled={loading}
          onPress={() => promptAsync()}
        >
          Sign In with Google
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
