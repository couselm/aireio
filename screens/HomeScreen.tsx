import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Button, Text, Searchbar, List } from 'react-native-paper';
import * as Location from 'expo-location';
import axios from 'axios';
import MapView, { Marker, Circle } from 'react-native-maps';
import { GOOGLE_PLACES_API_KEY } from '@env';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setLocation({ latitude, longitude });
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}`,
    );

    const city = response.data.results.find((result) =>
      result.types.includes('locality'),
    )?.address_components?.[0]?.long_name;

    if (city) {
      setSearchQuery(city);
    } else {
      alert('City not found');
    }
  };

  const fetchSuggestions = async (query) => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=(cities)&key=${GOOGLE_PLACES_API_KEY}`,
    );
    setSuggestions(response.data.predictions);
  };

  const searchUserLocation = () => {
    fetchSuggestions(searchQuery);
  };

  const handleSuggestionPress = async (description, placeId) => {
    setSearchQuery(description);
    setSuggestions([]);

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_PLACES_API_KEY}`,
    );

    const { lat, lng } = response.data.result.geometry.location;
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Find Today's Workspace</Text>
      <Searchbar
        style={styles.searchBar}
        placeholder="Search"
        onChangeText={(query) => {
          setSearchQuery(query);
          fetchSuggestions(query);
        }}
        value={searchQuery}
        icon="magnify"
        onIconPress={searchUserLocation}
        traileringIcon="near-me"
        onTraileringIconPress={getUserLocation}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                handleSuggestionPress(item.description, item.place_id)
              }
            >
              <List.Item title={item.description} />
            </TouchableOpacity>
          )}
        />
      )}
      <Button
        icon="magnify"
        mode="elevated"
        onPress={() => navigation.navigate('Locations')}
        buttonColor="green"
        textColor="white"
      >
        Locations
      </Button>
      <MapView style={styles.map} region={region} />
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
  searchBar: {
    width: '90%',
    marginBottom: 20,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
    marginTop: 20,
  },
});
