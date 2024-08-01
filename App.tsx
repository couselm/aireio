import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNav from './components/navigation/BottomNav';
import LocationPage from './screens/LocationPage';
import Auth from './screens/account/Auth';
import Account from './screens/account/Account';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name='MainTabs'
              component={BottomNav}
              options={{ headerShown: false }}
            />
            <Stack.Screen name='LocationPage' component={LocationPage} />
            <Stack.Screen name='Auth' component={Auth} />
            <Stack.Screen name='Account' component={Account} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}
