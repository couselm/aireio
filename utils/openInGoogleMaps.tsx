import { Linking } from 'react-native';

export const openInGoogleMaps = (item) => {
  const placeId = item.place_id;
  const name = encodeURIComponent(item.name);
  const url = `https://www.google.com/maps/search/?api=1&query=${name}&query_place_id=${placeId}`;
  Linking.openURL(url).catch((err) =>
    console.error('Error opening Google Maps', err),
  );
};
