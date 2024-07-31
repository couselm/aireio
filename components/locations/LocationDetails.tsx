import { StyleSheet, Text, View, Linking } from 'react-native';
import React from 'react';
import { openInGoogleMaps } from '../../utils/openInGoogleMaps';
import { Icon, Card } from 'react-native-paper';

const LocationDetails = ({ item }) => {
  const tags = item.osmData || {};
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
    : '?';

  return (
    <View>
      <Card>
        <Card.Content>
          <View style={styles.row}>
            <Icon
              source={
                item.types && item.types.includes('cafe') ? 'coffee' : 'library'
              }
              size={iconSize}
            />
            <Text style={styles.ammenity}>
              {item.types ? item.types[0] : 'Amenity'}
            </Text>
          </View>

          <View style={styles.row}>
            <Icon source='navigation' size={iconSize} />
            <View style={styles.col}>
              <Text style={styles.link} onPress={() => openInGoogleMaps(item)}>
                {item.name && `${item.name}`}
              </Text>
              <Text style={styles.link} onPress={() => openInGoogleMaps(item)}>
                {item.vicinity}
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
            <Icon source='clock' size={iconSize} />
            <Text style={styles.description}>
              {item.opening_hours && item.opening_hours.open_now !== undefined
                ? item.opening_hours.open_now
                  ? 'Open'
                  : 'Closed'
                : 'Opening hours not available'}
            </Text>
          </View>

          <View style={styles.icons}>
            <Text style={styles.description}>
              {`🛜: ${
                tags.internet_access
                  ? tags.internet_access === 'yes' ||
                    tags.internet_access === 'wlan'
                    ? '✅'
                    : '🚫'
                  : '🤔'
              }`}
            </Text>

            <Text style={styles.description}>
              {`🪑: ${
                tags.outdoor_seating === 'yes'
                  ? '✅ Outdoor'
                  : tags.indoor_seating === 'yes'
                  ? '✅ Indoor'
                  : tags.outdoor_seating || tags.indoor_seating
                  ? '🚫'
                  : '🤔'
              }`}
            </Text>

            <Text style={styles.description}>
              {`♿️: ${
                tags.wheelchair
                  ? tags.wheelchair === 'yes' || tags.wheelchair === 'limited'
                    ? '✅'
                    : '🚫'
                  : '🤔'
              }`}
            </Text>
          </View>
        </Card.Content>
      </Card>
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
  icons: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 6,
    justifyContent: 'space-between',
  },
});
