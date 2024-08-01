import { useState, useEffect } from 'react';
import { supabase } from '../../clients/supabaseClient';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Session } from '@supabase/supabase-js';
import Avatar from '../../components/account/Avatar';
import { useAuth } from '../../contexts/AuthContext';

export default function Account() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (session) {
      setEmail(session.user.email);
      getProfile();
    }
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      } else {
        setEditMode(false); // Exit edit mode after successful update
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({ username, website, avatar_url: url });
          }}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput label='Email' value={email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        {editMode ? (
          <TextInput
            label='Username'
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
        ) : (
          <Text style={styles.text}>{username}</Text>
        )}
      </View>
      <View style={styles.verticallySpaced}>
        {editMode ? (
          <TextInput
            label='Website'
            value={website}
            onChangeText={(text) => setWebsite(text)}
          />
        ) : (
          <Text style={styles.text}>{website}</Text>
        )}
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          icon={editMode ? 'check' : 'pencil'}
          mode='contained'
          onPress={() =>
            editMode
              ? updateProfile({ username, website, avatar_url: avatarUrl })
              : setEditMode(true)
          }
          disabled={loading}
        >
          {loading ? 'Loading ...' : editMode ? 'Update' : 'Edit'}
        </Button>
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          icon='logout'
          mode='contained'
          onPress={() => supabase.auth.signOut()}
        >
          Sign Out
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
  text: {
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});
