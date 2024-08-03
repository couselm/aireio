import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card, Avatar, Text, Icon, IconButton } from 'react-native-paper';
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
      {item.photos?.[0] && (
        <Card.Cover
          source={{
            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`,
          }}
        />
      )}

      <Card.Title
        title={placeName}
        subtitle={
          item.opening_hours && item.opening_hours.open_now ? 'Open' : 'Closed'
        }
        left={(props) => <Avatar.Icon {...props} icon={iconName} />}
        right={(props) => (
          <View>
            {item.rating && (
              <View style={styles.row}>
                <Icon name='star' source='star' size={20} color='#FFD700' />
                <Text>
                  {item.rating} ({item.user_ratings_total})
                </Text>
              </View>
            )}
          </View>
        )}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
  },
});

export default LocationCard;
