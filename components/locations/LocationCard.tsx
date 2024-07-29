import React, { useState, useEffect } from 'react';
import { Image, Linking } from 'react-native';
import { Card, XStack, YStack, Text, styled } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const LocationCard = ({ item }) => {
  const navigation = useNavigation();
  const [brandImage, setBrandImage] = useState(null);

  const fetchBrandImage = async (wikidataId) => {
    try {
      const response = await axios.get(
        `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`,
      );
      const entity = response.data.entities[wikidataId];
      if (entity && entity.claims) {
        // Try to get logo (P154) first, then fallback to image (P18)
        const logoClaim = entity.claims.P154 || entity.claims.P18;
        if (logoClaim) {
          const imageFileName = logoClaim[0].mainsnak.datavalue.value;
          const encodedImageFileName = encodeURIComponent(
            imageFileName.replace(/ /g, '_'),
          );
          return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodedImageFileName}`;
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching brand image:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      const wikidataId = item.tags['brand:wikidata'];
      if (wikidataId) {
        const imageUrl = await fetchBrandImage(wikidataId);
        setBrandImage(imageUrl);
      }
    };

    fetchImage();
  }, [item.tags]);

  const openInGoogleMaps = () => {
    const locationName = item.tags.name || '';
    const address = `${item.tags['addr:housenumber'] || ''} ${
      item.tags['addr:street'] || ''
    }, ${item.tags['addr:city'] || ''}, ${item.tags['addr:state'] || ''} ${
      item.tags['addr:postcode'] || ''
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
    <Card
      marginBottom='$2'
      padding='$2'
      elevate
      size='$4'
      bordered
      // width={250}
      height={100}
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      animation='bouncy'
      onPress={() => navigation.navigate('LocationPage', { item })}
    >
      <Card.Header>
        <XStack space='$4'>
          <YStack style={$brandImage}>
            {brandImage && (
              <Image source={{ uri: brandImage }} style={$brandImage} />
            )}
          </YStack>
          <YStack flex={1}>
            <StyledText fontWeight='bold'>{item.tags.name || ''}</StyledText>
          </YStack>
        </XStack>
      </Card.Header>
      <Card.Footer>
        <XStack space='$2' justifyContent='space-between' flex={1}>
          <StyledText>{item.tags.amenity}</StyledText>
          {(item.tags?.indoor_seating === 'yes' ||
            item.tags?.outdoor_seating === 'yes') && (
            <StyledText>🪑</StyledText>
          )}
          <StyledText>
            {`Wi-Fi: ${item.tags.internet_access ? '✓' : 'X'}`}
          </StyledText>
        </XStack>
      </Card.Footer>
    </Card>
  );
};

// Styled components
// const StyledCard = styled(Card, {
//   marginBottom: '$4',
//   elevate,
//   size: '$4',
//   bordered,
// });

const StyledText = styled(Text, {
  fontSize: '$4',
  color: '$gray11',
  textTransform: 'capitalize',
});

// Styles object for non-Tamagui components
const $brandImage = {
  width: 50,
  height: 50,
};

export default LocationCard;
