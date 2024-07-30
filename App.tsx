import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNav from './components/navigation/BottomNav';
import LocationPage from './screens/LocationPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='MainTabs'
            component={BottomNav}
            options={{ headerShown: false }}
          />
          <Stack.Screen name='LocationPage' component={LocationPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
