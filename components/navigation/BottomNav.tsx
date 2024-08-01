import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../../screens/HomeScreen';
import LocationList from '../../screens/LocationList';
import SearchScreen from '../../screens/SearchScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import Auth from '../../screens/account/Auth';
import Account from '../../screens/account/Account';
import { useAuth } from '../../contexts/AuthContext';

const Tab = createMaterialBottomTabNavigator();

const BottomNav = () => {
  const theme = useTheme();
  const { session } = useAuth();

  return (
    <Tab.Navigator
      initialRouteName='Home'
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.disabled}
      barStyle={{ backgroundColor: theme.colors.surface }}
    >
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name='home' color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name='Locations'
        component={LocationList}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name='map' color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name='Search'
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name='magnify' color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name='cog' color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name='Account'
        component={session ? Account : Auth}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name='account' color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;
