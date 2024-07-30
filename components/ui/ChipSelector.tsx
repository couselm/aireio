import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Chip } from 'react-native-paper';

const ChipSelector = ({ selectedTypes, setSelectedTypes, types }) => {
  const toggleType = (type) => {
    setSelectedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <View style={styles.chipContainer}>
      {types.map((type) => (
        <Chip
          key={type}
          selected={selectedTypes[type]}
          onPress={() => toggleType(type)}
          style={[
            styles.chip,
            selectedTypes[type] ? styles.selectedChip : styles.unselectedChip,
          ]}
        >
          {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
        </Chip>
      ))}
    </View>
  );
};

export default ChipSelector;

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  chip: {
    margin: 5,
  },
  selectedChip: {
    backgroundColor: 'violet', // Replace with your desired fill color for selected state
    borderColor: 'violet',
  },
  unselectedChip: {
    backgroundColor: 'white',
    borderColor: 'violet', // Replace with your desired outline color
    borderWidth: 1,
  },
});
