import React from 'react';
import { Button, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Aireio!</Text>
      <Button mode='contained' onPress={() => navigation.navigate('Locations')}>
        Locations
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
  },
});
