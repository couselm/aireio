import React from 'react';
import { Button, Text, SegmentedButtons } from 'react-native-paper';
import { View, StyleSheet, SafeAreaView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Find Today's Workspace</Text>
      <Button
        icon='magnify'
        mode='elevated'
        onPress={() => navigation.navigate('Locations')}
        buttonColor='green'
        textColor='white'
      >
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
