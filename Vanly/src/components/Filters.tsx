import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, GestureResponderEvent } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const filtersStyles = StyleSheet.create({
  filtersLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16 * 2,
    marginLeft: 16 * 3,
  },
  dot: {
    backgroundColor: 'red',
    width: 16,
    height: 16,
    borderRadius: 20,
    position: 'absolute',
    left: 16 * 2.4,
    top: -5,
  },
  filtersText: {
    fontSize: 22,
    color: '#1E2E86',
    paddingHorizontal: 16 * 3,
    fontWeight: '500',
  },
  navigation: {
    backgroundColor: 'lightgrey',
    width: 16 * 3.3,
    height: 16 * 3.3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    position: 'absolute',
    left: -16,
  },
});

interface IItemProps {
  name: string;
  icon: { name: any, type: string };
  onPress: ((event: GestureResponderEvent) => void);
}

export const Item: React.FC<IItemProps> = ({ name, icon, onPress }) => {

  const [selected, setSelected] = useState(true);

  const activateFilter = (event: GestureResponderEvent) => {
    onPress(event);
    setSelected(!selected);
  };
  return (
  <TouchableOpacity style={filtersStyles.filtersLine} activeOpacity={0.6} onPress={activateFilter}>
    <View style={filtersStyles.navigation}>
      {icon.type == 'MaterialCommunityIcons' ? (
        <MaterialCommunityIcons name={icon.name} size={25} color="#1E2E86" />
      ) : icon.type == 'FontAwesome5' ? (
        <FontAwesome5 name={icon.name} size={25} color="#1E2E86"/>
      ) : undefined
      }
      {selected && (
        <View style={filtersStyles.dot}></View>
      )}
    </View>
    <Text style={filtersStyles.filtersText}>{name}</Text>
  </TouchableOpacity>
  );
};