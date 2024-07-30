import React, { useState, useEffect } from 'react';
import { Image, Linking, StyleSheet, View } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Avatar,
  IconButton,
  Text,
  Icon,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import useFetchBrandImage from '../../hooks/useFetchBrandImage';

const LocationCard = ({ item }) => {
  const navigation = useNavigation();
  const { brandImage } = useFetchBrandImage(item.tags['brand:wikidata']);

  // openInGoogleMaps(item);

  return (
    <Card
      onPress={() => navigation.navigate('LocationPage', { item })}
      style={styles.card}
    >
      <View style={styles.main}>
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
            size={75}
            icon={item.tags.amenity === 'cafe' ? 'coffee' : 'library'}
            backgroundColor='green'
          />
        )}

        <Card.Content style={styles.content}>
          <View style={styles.col}>
            <Text variant='titleMedium'>{item.tags.name || ''}</Text>

            <View style={styles.row}>
              <View style={styles.row}>
                <Icon
                  source={item.tags.amenity === 'cafe' ? 'coffee' : 'library'}
                  size={20}
                />
                <Paragraph style={styles.description}>
                  {item.tags.amenity}
                </Paragraph>
              </View>
            </View>
          </View>
          <View style={styles.lowerRight}>
            <Card.Actions>
              {(item.tags?.indoor_seating === 'yes' ||
                item.tags?.outdoor_seating === 'yes') && (
                <Paragraph>🪑</Paragraph>
              )}
              <Paragraph>{`${item.tags.internet_access ? '🛜' : ''}`}</Paragraph>
            </Card.Actions>
          </View>
        </Card.Content>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    padding: 15,
    height: 105,
  },
  description: {
    textTransform: 'capitalize',
    fontSize: 18,
  },
  brandImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandImage: {
    width: 65,
    height: 65,
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 25,
    margin: 0,
  },
  brandImageWrapper: {
    width: 75,
    height: 75,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
    justifyContent: 'space-between',
  },
  main: {
    flexDirection: 'row',
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  lowerRight: {
    position: 'absolute',
    bottom: -10,
    right: 0,
  },
});

export default LocationCard;
