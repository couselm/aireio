import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { XStack } from 'tamagui';

const LocationPage = ({ route }) => {
  const { item } = route.params;
  const { tags } = item;

  const openInGoogleMaps = () => {
    const locationName = tags.name || '';
    const address = `${tags['addr:housenumber'] || ''} ${
      tags['addr:street'] || ''
    }, ${tags['addr:city'] || ''}, ${tags['addr:state'] || ''} ${
      tags['addr:postcode'] || ''
    }`;
    const query = `${locationName}, ${address}`.trim();
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query,
    )}`;
    Linking.openURL(url).catch((err) =>
      console.error('Error opening Google Maps', err),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Name</Text>
      <Text>{tags.name}</Text>

      <Text style={styles.title}>Location Type</Text>
      <Text style={styles.description}>{tags.amenity}</Text>

      <Text style={styles.title}>Location Address</Text>
      <XStack space={2}>
        <Text>{tags['addr:housenumber']}</Text>
        <Text>{tags['addr:street']}</Text>
      </XStack>

      <XStack space={2}>
        <Text>{tags['addr:city'] + ','}</Text>
        <Text>{tags['addr:state']}</Text>
        <Text>{tags['addr:postcode']}</Text>
      </XStack>

      <Text style={styles.title}>Phone Number</Text>
      <Text>{tags.phone}</Text>

      <Text style={styles.title}>Website</Text>
      <Text>{tags.website}</Text>

      <Text style={styles.title}>Opening Hours</Text>
      <Text>{tags.opening_hours}</Text>

      <TouchableOpacity style={styles.button} onPress={openInGoogleMaps}>
        <Text style={styles.buttonText}>Open in Google Maps</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textTransform: 'capitalize',
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
