import { StyleSheet, Text, View, Linking } from 'react-native';
import React from 'react';
import openInGoogleMaps from '../../utils/openInGoogleMaps';
import { Icon } from 'react-native-paper';

const LocationDetails = ({ item }) => {
  const { tags } = item;
  const iconSize = 25;

  const handlePress = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error('An error occurred', err),
    );
  };

  const websiteName = tags.website
    ? tags.website.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]
    : '';

  const formattedOpeningHours = tags.opening_hours
    ? tags.opening_hours.replace(/; /g, '\n')
    : '';

  console.log(formattedOpeningHours);

  return (
    <View>
      <View style={styles.row}>
        <Icon
          source={
            tags.amenity && tags.amenity === 'cafe' ? 'coffee' : 'library'
          }
          size={iconSize}
        />
        <Text style={styles.ammenity}>{tags.amenity}</Text>
      </View>

      <View style={styles.row}>
        <Icon source='navigation' size={iconSize} />
        <View style={styles.col}>
          <Text style={styles.link} onPress={() => openInGoogleMaps(item)}>
            {tags.name && `${tags.name}`}
          </Text>
          <Text style={styles.link} onPress={() => openInGoogleMaps(item)}>
            {tags['addr:housenumber'] && `${tags['addr:housenumber']} `}
            {tags['addr:street'] && `${tags['addr:street']} `}
            {tags['addr:city'] && `${tags['addr:city']}, `}
            {tags['addr:state'] && `${tags['addr:state']} `}
            {tags['addr:postcode'] && tags['addr:postcode']}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Icon source='phone' size={iconSize} />
        <Text
          style={styles.link}
          onPress={() => handlePress(`tel:${tags.phone}`)}
        >
          {tags.phone}
        </Text>
      </View>
      <View style={styles.row}>
        <Icon source='web' size={iconSize} />
        <Text style={styles.link} onPress={() => handlePress(tags.website)}>
          {websiteName}
        </Text>
      </View>
      <View style={styles.row}>
        <Icon source='clock' size={iconSize} />
        <Text style={styles.description}>{formattedOpeningHours}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.description}>
          {`🪑 Seating: ${
            item.tags.outdoor_seating === 'yes'
              ? '✅ Outdoor'
              : item.tags.indoor_seating === 'yes'
              ? '✅ Indoor'
              : item.tags.outdoor_seating || item.tags.indoor_seating
              ? '🚫'
              : '🤔'
          }`}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.description}>
          {`🛜 Wi-Fi: ${
            item.tags.internet_access
              ? item.tags.internet_access === 'yes' ||
                item.tags.internet_access === 'wlan'
                ? '✅'
                : '🚫'
              : '🤔'
          }`}
        </Text>
      </View>
    </View>
  );
};

export default LocationDetails;

const styles = StyleSheet.create({
  description: {
    fontSize: 20,
  },
  ammenity: {
    fontSize: 20,
    textTransform: 'capitalize',
  },

  row: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 6,
  },
  link: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
    fontSize: 20,
  },
});
