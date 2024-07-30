import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFetchBrandImage = (wikidataId) => {
  const [brandImage, setBrandImage] = useState(null);

  const fetchBrandImage = async (wikidataId) => {
    try {
      const response = await axios.get(
        `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`,
      );
      const entity = response.data.entities[wikidataId];
      if (entity && entity.claims) {
        // Try to get logo (P154) first, then fallback to image (P18)
        const logoClaim =
          entity.claims.P154 || entity.claims.P8972 || entity.claims.P18;
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

  const getCachedBrandImage = async (wikidataId) => {
    try {
      const cachedImage = await AsyncStorage.getItem(wikidataId);
      return cachedImage;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  };

  const cacheBrandImage = async (wikidataId, imageUrl) => {
    try {
      await AsyncStorage.setItem(wikidataId, imageUrl);
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (wikidataId) {
        const cachedImage = await getCachedBrandImage(wikidataId);
        if (cachedImage) {
          setBrandImage(cachedImage);
        } else {
          const imageUrl = await fetchBrandImage(wikidataId);
          if (imageUrl) {
            setBrandImage(imageUrl);
            cacheBrandImage(wikidataId, imageUrl);
          }
        }
      }
    };

    fetchImage();
  }, [wikidataId]);

  return { brandImage };
};

export default useFetchBrandImage;
