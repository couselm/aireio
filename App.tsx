import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LocationList from './screens/LocationList';
import LocationPage from './screens/LocationPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='HomeScreen' component={HomeScreen} />
          <Stack.Screen name='Locations' component={LocationList} />
          <Stack.Screen name='LocationPage' component={LocationPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
