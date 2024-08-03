import React, { useState } from 'react';
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
import { GOOGLE_PLACES_API_KEY } from '@env';
import MapView, { Marker } from 'react-native-maps';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=(cities)&key=${GOOGLE_PLACES_API_KEY}`,
    );
    setSuggestions(response.data.predictions);
    setLoading(false);
  };

  const searchUserLocation = () => {
    fetchSuggestions(searchQuery);
  };

  const handleSuggestionPress = async (description, placeId) => {
    setSearchQuery(description);
    setSuggestions([]);

    // Get the coordinates for the selected place
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
        placeholder='Search'
        onChangeText={(query) => {
          setSearchQuery(query);
          fetchSuggestions(query);
        }}
        value={searchQuery}
        icon='magnify'
        onIconPress={searchUserLocation}
        traileringIcon='near-me'
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
        icon='magnify'
        mode='elevated'
        onPress={() => navigation.navigate('Locations')}
        buttonColor='green'
        textColor='white'
      >
        Locations
      </Button>
      <MapView style={styles.map} region={region}>
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
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
    height: 300,
    marginTop: 20,
  },
});
