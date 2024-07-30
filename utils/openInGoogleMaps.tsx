import { Linking } from 'react-native';

export const openInGoogleMaps = (item) => {
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

export default openInGoogleMaps;
