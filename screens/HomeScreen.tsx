import React from 'react';
import { Button, YStack, Text } from 'tamagui';

export default function HomeScreen({ navigation }) {
  return (
    <YStack f={1} jc='center' ai='center' space>
      <Text fontSize={20}>Welcome to Aireio!</Text>
      <Button onPress={() => navigation.navigate('Locations')}>
        Locations
      </Button>
    </YStack>
  );
}
