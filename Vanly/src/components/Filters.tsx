import React from 'react';
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
    width: 16 * 1.1,
    height: 16 * 1.1,
    borderRadius: 20,
    position: 'absolute',
    left: 16 * 2.4,
    top: -5,
  },
  undot: {
    backgroundColor: 'white',
    width: 16 * 1.3,
    height: 16 * 1.3,
    borderRadius: 20,
    position: 'absolute',
    left: 16 * 2.4,
    top: -5,
    borderWidth: 2,
  },
  filtersText: {
    fontSize: 22,
    color: '#525566',
    paddingHorizontal: 16 * 3,
    fontWeight: '500',
  },
  navigation: {
    backgroundColor: 'lightgrey',
    width: 16 * 3.3,
    height: 16 * 3.3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    position: 'absolute',
    left: -16,
  },
  descriptionContainer: {

  },
  description: {
    fontSize: 17,
    color: 'grey',
    paddingHorizontal: 16 * 3,
    fontWeight: '500',
  },
});

interface IItemProps {
  name: string;
  icon: { name: any, type: string };
  onPress: ((event: GestureResponderEvent) => void);
  isSelected: boolean;
  color: { icon: string, bg: string };
  description?: string;
}

export const Item: React.FC<IItemProps> = ({ name, icon, onPress, isSelected, color, description }) => {

  // const [selected, setSelected] = useState(isSelected);

  const activateFilter = (event: GestureResponderEvent) => {
    onPress(event);
    // setSelected(!selected);
  };
  return (
  <TouchableOpacity style={filtersStyles.filtersLine} activeOpacity={0.6} onPress={activateFilter}>
    <View style={{ ...filtersStyles.navigation, backgroundColor: color.bg }}>
      {icon.type == 'MaterialCommunityIcons' ? (
        <MaterialCommunityIcons name={icon.name} size={25} color={color.icon} />
      ) : icon.type == 'FontAwesome5' ? (
        <FontAwesome5 name={icon.name} size={25} color={color.icon}/>
      ) : undefined
      }
      {isSelected ? (
        <View style={filtersStyles.dot}></View>
      ) : (
        <View style={{ ...filtersStyles.undot, borderColor: color.bg }}></View>
      )}
    </View>
    <View>
      <Text style={filtersStyles.filtersText}>{name}</Text>
      {description && (
        <Text style={filtersStyles.description}>{description}</Text>
      )}
    </View>
  </TouchableOpacity>
  );
};