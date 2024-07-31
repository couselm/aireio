import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card, Avatar, Text, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { GOOGLE_PLACES_API_KEY } from '@env';

const LocationCard = ({ item }) => {
  const navigation = useNavigation();

  const iconName = item.types?.includes('cafe')
    ? 'coffee'
    : item.types?.includes('library')
    ? 'library'
    : 'domain';
  const placeName = item.name || item.tags?.name || '';
  const amenityName = item.types?.[0]?.replace(/_/g, ' ') || '';

  return (
    <Card
      onPress={() =>
        navigation.navigate('LocationPage', { item, title: placeName })
      }
      style={styles.card}
    >
      <View style={styles.container}>
        {item.photos?.[0] ? (
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`,
            }}
            style={styles.image}
          />
        ) : (
          <Avatar.Icon size={75} icon={iconName} backgroundColor='green' />
        )}

        <View style={styles.content}>
          <Text variant='titleMedium'>{placeName}</Text>
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Icon name='star' source='star' size={16} />
              <Text style={styles.ratingText}>
                {item.rating} ({item.user_ratings_total})
              </Text>
            </View>
          )}
        </View>

        <View style={styles.rightContent}>
          <View style={styles.amenityContainer}>
            <Icon name={iconName} source={iconName} size={20} />
            <Text style={styles.amenityText}>{amenityName}</Text>
          </View>
          {item.opening_hours?.open_now !== undefined && (
            <Text style={styles.openStatusText}>
              {item.opening_hours.open_now ? 'Open' : 'Closed'}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    padding: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 5,
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
  },
  amenityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityText: {
    textTransform: 'capitalize',
    marginLeft: 5,
  },
  openStatusText: {
    marginTop: 5,
  },
});

export default LocationCard;
