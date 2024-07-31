import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Image } from 'react-native';
import { Text, Avatar, Card, Icon } from 'react-native-paper';
import axios from 'axios';
import { GOOGLE_PLACES_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationDetails from '../components/locations/LocationDetails';
import calcDistance from '../utils/calcDistance';
import * as Location from 'expo-location';

const CACHE_KEY = 'LOCATION_DETAILS_CACHE';

const fetchOSMDetails = async (longitude, latitude) => {
  try {
    const query = `
      [out:json];
      (
        node(around:100, ${latitude}, ${longitude})["amenity"];
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

const LocationPage = ({ route, navigation }) => {
  const { item, title } = route.params;
  const [combinedData, setCombinedData] = useState({
    ...item,
    osmData: null,
    distance: null, // Ensure distance is initialized
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: title });
  }, [navigation, title]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      const { lat, lng } = item.geometry.location;
      const osmData = await fetchOSMDetails(lng, lat);

      if (osmData.length > 0) {
        setCombinedData((prevData) => ({
          ...prevData,
          osmData: osmData[0].tags,
        }));
      } else {
        console.log('No OSM match found');
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      };

      const placeCoords = {
        latitude: lat,
        longitude: lng,
      };

      const distance = calcDistance(userCoords, placeCoords);

      setCombinedData((prevData) => ({
        ...prevData,
        distance: distance.toFixed(2),
      }));
    };

    fetchAdditionalData();
  }, [item]);

  const websiteName = combinedData.website
    ? combinedData.website.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]
    : '';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Card>
          <Card.Content>
            <View style={styles.row}>
              <View style={styles.brandImageContainer}>
                {combinedData.photos && combinedData.photos.length > 0 ? (
                  <Image
                    source={{
                      uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${combinedData.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`,
                    }}
                    style={styles.photo}
                  />
                ) : (
                  <Avatar.Icon
                    size={100}
                    icon={combinedData.amenity === 'cafe' ? 'coffee' : 'store'}
                    backgroundColor='green'
                  />
                )}
              </View>
              <View style={styles.textContainer}>
                <Text variant='titleLarge'>{combinedData.name}</Text>
                {combinedData.rating && (
                  <View style={styles.ratingContainer}>
                    <Icon name='star' source='star' size={16} />
                    <Text style={styles.ratingText}>
                      {combinedData.rating} ({combinedData.user_ratings_total})
                    </Text>
                  </View>
                )}
                {combinedData.price_level && (
                  <Text>
                    Price Level: {'$'.repeat(combinedData.price_level)}
                  </Text>
                )}
                {combinedData.distance && (
                  <Text>Distance: {combinedData.distance} km</Text>
                )}

                {combinedData.osmData && (
                  <View>
                    {combinedData.osmData.wifi && (
                      <Text>Wifi: {combinedData.osmData.wifi}</Text>
                    )}
                    {combinedData.osmData.outdoor_seating && (
                      <Text>
                        Outdoor Seating: {combinedData.osmData.outdoor_seating}
                      </Text>
                    )}
                    {combinedData.osmData.poweroutlets && (
                      <Text>
                        Power Outlets: {combinedData.osmData.poweroutlets}
                      </Text>
                    )}
                    {combinedData.opening_hours &&
                    combinedData.opening_hours.open_now !== undefined ? (
                      <Text>
                        {combinedData.opening_hours.open_now
                          ? 'Open'
                          : 'Closed'}
                      </Text>
                    ) : (
                      <Text>Opening hours not available</Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
      {combinedData.reviews && (
        <Card style={styles.sectionCard}>
          <Card.Title title='Reviews' />
          <Card.Content>
            {combinedData.reviews.slice(0, 3).map((review, index) => (
              <View key={index} style={styles.review}>
                <Text style={styles.reviewAuthor}>{review.author_name}</Text>
                <Text>Rating: {review.rating}/5</Text>
                <Text numberOfLines={3}>{review.text}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
      <LocationDetails item={combinedData} />
    </ScrollView>
  );
};

export default LocationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  brandImageContainer: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandImageWrapper: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  brandImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    width: '75%',
    paddingLeft: 20,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  sectionCard: {
    marginTop: 20,
  },
  review: {
    marginBottom: 10,
  },
  reviewAuthor: {
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
});
