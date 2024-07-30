import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { Drawer, Text, Avatar, Card } from 'react-native-paper';
import useFetchBrandImage from '../hooks/useFetchBrandImage';
import LocationDetails from '../components/locations/LocationDetails';

const LocationPage = ({ route, navigation }) => {
  const { item, title } = route.params;
  const { tags } = item;

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: title });
  }, [navigation, title]);

  const websiteName = tags.website
    ? tags.website.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]
    : '';

  const { brandImage } = useFetchBrandImage(item.tags['brand:wikidata']);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Card>
          <Card.Content>
            <View style={styles.row}>
              <View style={styles.brandImageContainer}>
                {brandImage ? (
                  <View style={styles.brandImageWrapper}>
                    <Image
                      resizeMode='contain'
                      source={{ uri: brandImage }}
                      style={styles.brandImage}
                    />
                  </View>
                ) : (
                  <Avatar.Icon
                    size={100}
                    icon={item.tags.amenity === 'cafe' ? 'coffee' : 'library'}
                    backgroundColor='green'
                  />
                )}
              </View>
              <View style={styles.textContainer}>
                <Text variant='titleLarge'>{tags.name}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      <LocationDetails item={item} />
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
  row: {
    flexDirection: 'row',
    marginBottom: 30,
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
});
