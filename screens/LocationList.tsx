import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Drawer, IconButton, MD3Colors, Button } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import LocationCard from '../components/locations/LocationCard';
import ChipSelector from '../components/ui/ChipSelector';

const CACHE_KEY = 'OSM_DATA_CACHE';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const fetchOSMData = async (longitude, latitude, radius, types) => {
  try {
    const typesQuery = types
      .map(
        (type) =>
          `node["amenity"="${type}"](around:${radius},${latitude},${longitude});`,
      )
      .join('\n');
    const query = `
      [out:json];
      (
        ${typesQuery}
      );
      out body;
    `;
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'YourApp/1.0',
      },
    });
    return response.data.elements;
  } catch (error) {
    console.error(
      'Error fetching OSM data:',
      error.response?.data || error.message,
    );
    return [];
  }
};

const getCachedData = async (radius, types) => {
  try {
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (
        parsedData.radius === radius &&
        JSON.stringify(parsedData.types) === JSON.stringify(types) &&
        parsedData.timestamp + CACHE_DURATION > Date.now()
      ) {
        return parsedData.data;
      }
    }
  } catch (error) {
    console.error('Error reading cache:', error);
  }
  return null;
};

const setCachedData = async (data, radius, types) => {
  try {
    const cacheEntry = {
      data,
      radius,
      types,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [radius, setRadius] = useState(1000);
  const [selectedTypes, setSelectedTypes] = useState({
    cafe: true,
    library: false,
    coworking_space: false,
  });

  const types = ['cafe', 'library', 'coworking_space'];
  const selectedTypesArray = Object.keys(selectedTypes).filter(
    (type) => selectedTypes[type],
  );

  const getLocations = async () => {
    try {
      const cachedData = await getCachedData(radius, selectedTypesArray);
      if (cachedData && cachedData.length > 0) {
        setLocations(cachedData);
      } else {
        const longitude = -122.4194; // Example coordinates for San Francisco
        const latitude = 37.7749;
        const fetchedLocations = await fetchOSMData(
          longitude,
          latitude,
          radius,
          selectedTypesArray,
        );
        setLocations(fetchedLocations);
        await setCachedData(fetchedLocations, radius, selectedTypesArray);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <LocationCard item={item} />}
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
                getLocations();
              }}
            />
            <Button
              icon='magnify'
              mode='elevated'
              onPress={() => {
                setDrawerVisible(false);
                getLocations();
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
    // backgroundColor: '#f0f0f0',
    borderRadius: 25,
    // padding: 10,
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
