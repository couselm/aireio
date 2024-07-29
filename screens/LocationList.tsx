import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationCard from '../components/locations/LocationCard';

const CACHE_KEY = 'OSM_DATA_CACHE';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const fetchOSMData = async (longitude, latitude, radius = 500) => {
  try {
    console.log('Fetching OSM data...');
    const query = `
      [out:json];
      node["amenity"="cafe"](around:${radius},${latitude},${longitude});
      out body;
    `;
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'YourApp/1.0',
      },
    });
    console.log('OSM data fetched:', response.data);
    return response.data.elements;
  } catch (error) {
    console.error(
      'Error fetching OSM data:',
      error.response?.data || error.message,
    );
    return [];
  }
};

const getCachedData = async () => {
  try {
    console.log('Reading cache...');
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (parsedData.timestamp + CACHE_DURATION > Date.now()) {
        console.log('Cache hit:', parsedData.data);
        return parsedData.data;
      }
    }
    console.log('Cache miss or expired');
  } catch (error) {
    console.error('Error reading cache:', error);
  }
  return null;
};

const setCachedData = async (data) => {
  try {
    console.log('Setting cache...');
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
    console.log('Cache set successfully');
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocations = async () => {
      try {
        console.log('Fetching locations...');
        const cachedData = await getCachedData();
        if (cachedData && cachedData.length > 0) {
          setLocations(cachedData);
        } else {
          const longitude = -122.4194; // Example coordinates for San Francisco
          const latitude = 37.7749;
          const fetchedLocations = await fetchOSMData(longitude, latitude);
          setLocations(fetchedLocations);
          await setCachedData(fetchedLocations);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch locations');
      } finally {
        setLoading(false);
      }
    };

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default LocationList;
