import React from 'react';
import { Provider } from './Provider';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LocationList from './screens/LocationList';
import LocationPage from './screens/LocationPage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='HomeScreen' component={HomeScreen} />
          <Stack.Screen name='Locations' component={LocationList} />
          <Stack.Screen name='LocationPage' component={LocationPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
