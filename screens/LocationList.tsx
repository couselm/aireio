import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton, Button, Drawer } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import LocationCard from '../components/locations/LocationCard';
import ChipSelector from '../components/ui/ChipSelector';
import { GOOGLE_PLACES_API_KEY } from '@env';

const CACHE_KEY = 'GOOGLE_PLACES_CACHE';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const fetchGooglePlaces = async (longitude, latitude, radius, types) => {
  try {
    const typeQueries = types.map(async (type) => {
      if (type === 'coworking_space') {
        const keywordUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=coworking%20space&key=${GOOGLE_PLACES_API_KEY}`;
        const keywordResponse = await axios.get(keywordUrl);
        return keywordResponse.data.results;
      } else {
        const typeUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;
        const typeResponse = await axios.get(typeUrl);
        return typeResponse.data.results;
      }
    });
    const results = await Promise.all(typeQueries);
    return results.flat(); // Flatten the array of arrays
  } catch (error) {
    console.error(
      'Error fetching Google Places data:',
      error.response?.data || error.message,
    );
    return [];
  }
};

const getCachedData = async () => {
  try {
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (parsedData.timestamp + CACHE_DURATION > Date.now()) {
        return parsedData.data;
      }
    }
  } catch (error) {
    console.error('Error reading cache:', error);
  }
  return null;
};

const setCachedData = async (data) => {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

const filterLocations = (data, types) => {
  return data.filter((location) =>
    location.types.some((type) => types.includes(type)),
  );
};

const LocationList = ({ navigation }) => {
  const [locations, setLocations] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [radius, setRadius] = useState(10000); // Initial radius set to 10KM
  const [selectedTypes, setSelectedTypes] = useState({
    cafe: true,
    library: true,
    coworking_space: true,
  });

  const types = ['cafe', 'library', 'coworking_space'];
  const selectedTypesArray = Object.keys(selectedTypes).filter(
    (type) => selectedTypes[type],
  );

  const getLocations = async () => {
    try {
      const cachedData = await getCachedData();
      if (cachedData && cachedData.length > 0) {
        setAllLocations(cachedData);
        setLocations(filterLocations(cachedData, selectedTypesArray));
      } else {
        const longitude = -122.4194; // Example coordinates for San Francisco
        const latitude = 37.7749;
        const fetchedLocations = await fetchGooglePlaces(
          longitude,
          latitude,
          radius,
          selectedTypesArray,
        );
        setAllLocations(fetchedLocations);
        setLocations(filterLocations(fetchedLocations, selectedTypesArray));
        await setCachedData(fetchedLocations);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    setLocations(filterLocations(allLocations, selectedTypesArray));
  };

  useEffect(() => {
    getLocations();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.place_id.toString()}
        renderItem={({ item }) => (
          <LocationCard
            item={item}
            onPress={() =>
              navigation.navigate('LocationPage', { item, title: item.name })
            }
          />
        )}
      />

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setDrawerVisible(true)}
      >
        <IconButton
          icon='filter-variant'
          size={40}
          backgroundColor='green'
          iconColor='white'
        />
      </TouchableOpacity>

      {drawerVisible && (
        <View style={styles.drawerContainer}>
          <Drawer.Section title='Filter Settings'>
            <Drawer.Item label='Radius' />
            <RNPickerSelect
              style={pickerSelectStyles}
              onValueChange={(value) => setRadius(parseInt(value, 10))}
              items={[
                { label: '0.1 km', value: '100' },
                { label: '0.5 km', value: '500' },
                { label: '1 km', value: '1000' },
                { label: '3 km', value: '3000' },
                { label: '5 km', value: '5000' },
                { label: '10 km', value: '10000' },
              ]}
              placeholder={{ label: 'Select Radius', value: null }}
              value={radius.toString()}
            />
            <Drawer.Item label='Type' />
            <ChipSelector
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              types={types}
            />
            <Button
              label='Apply Filters'
              onPress={() => {
                setDrawerVisible(false);
                applyFilters();
              }}
            />
            <Button
              icon='magnify'
              mode='elevated'
              onPress={() => {
                setDrawerVisible(false);
                applyFilters();
              }}
              buttonColor='green'
              textColor='white'
            >
              Apply Filters
            </Button>
          </Drawer.Section>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  filterButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    borderRadius: 25,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    padding: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginVertical: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginVertical: 10,
  },
});

export default LocationList;
