import React, { useContext, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { ClientContext } from '../contexts/ClientContext';
import { Item } from '../components/Filters';

interface IVanPointFilterProps {
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  values: any;
  createNewPoint: { latitude: number; longitude: number };
  setOpenNewPoint: React.Dispatch<React.SetStateAction<boolean>>;
  setTmpSites: React.Dispatch<React.SetStateAction<any>>;
  setValues: React.Dispatch<React.SetStateAction<any>>;
}

const newPointFilterStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16 * 2,
    height: Dimensions.get('window').height,
  },
  headerTextFilter: {
    alignSelf: 'flex-start',
    fontSize: 30,
    color: '#525566',
    fontWeight: 'bold',
    marginBottom: 16 * 5,
  },
  middleContainer: {
    width: '100%',
    height: '49.35%',
  },
  bottomContainer: {
    width: '180%',
    height: '4%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_button: {
    fontSize: 20,
    color: '#99D3A6',
    fontWeight: '900',
  },
  button_left: {
    alignSelf: 'flex-start',
    bottom: -16 * 6.3,
    height: 64,
    width: 64,
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,

    elevation: 21,
  },
  button_right: {
    bottom: -16 * 2.3,
    height: 64,
    width: 64,
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,

    elevation: 21,
  },
});

export const VanPointFilter: React.FC<IVanPointFilterProps> = ({
  setIndex,
  values,
  createNewPoint,
  setOpenNewPoint,
  setTmpSites,
  setValues,
}) => {
  const { client, setImage, getItems, setItems, getTraduction } =
    useContext(ClientContext);

  const [type, setType] = useState<'pointOfView' | 'waterPoint' | 'gazStation' | undefined>(undefined);

  const disable = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    if (type === undefined) return true;
    return false;
  };

  return (
    <View style={newPointFilterStyles.container}>
      <Text style={newPointFilterStyles.headerTextFilter}>
        Choose a VanPoint type
      </Text>
      <View style={newPointFilterStyles.middleContainer}>
        <Item
          name={getTraduction('POINT_OF_VIEW')}
          icon={{ name: 'map-marker', type: 'MaterialCommunityIcons' }}
          onPress={() => {
            if (type === 'pointOfView') {
              setType(undefined);
            } else {
              setType('pointOfView');
            }
          }}
          isSelected={type === 'pointOfView' ? true : false}
          color={{ icon: '#FEC156', bg: '#FFEECF' }}
          description={getTraduction('POINT_OF_VIEW_DESCRIPTION')}
        />
        <Item
          name={getTraduction('WATER_POINT')}
          icon={{ name: 'water-off', type: 'MaterialCommunityIcons' }}
          onPress={() => {
            if (type === 'waterPoint') {
              setType(undefined);
            } else {
              setType('waterPoint');
            }
          }}
          isSelected={type === 'waterPoint' ? true : false}
          color={{ icon: '#768AF8', bg: '#DAE0FF' }}
          description={getTraduction('WATER_POINT_DESCRIPTION')}
        />
        <Item
          name={getTraduction('GAZ_STATION')}
          icon={{ name: 'car', type: 'FontAwesome5' }}
          onPress={() => {
            if (type === 'gazStation') {
              setType(undefined);
            } else {
              setType('gazStation');
            }
          }}
          isSelected={type === 'gazStation' ? true : false}
          color={{ icon: '#B98888', bg: '#DEC3C3' }}
          description={getTraduction('GAZ_STATION_DESCRIPTION')}
        />
      </View>
      <View style={newPointFilterStyles.bottomContainer}>
        <TouchableOpacity
          style={newPointFilterStyles.button_left}
          onPress={() => {
            setIndex(0);
          }}
          disabled={false}
          activeOpacity={0.6}
        >
          <Text style={newPointFilterStyles.text_button}>{'←'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={newPointFilterStyles.button_right}
          onPress={async () => {
            console.log(type);
            setIndex(2);
            const items = await setItems();

            await items.doc(values.name).set({
              creator: client?.firstname,
              description: values.description,
              image: values.uri.split('/')[values.uri.split('/').length - 1],
              likes: { likes: 0, names: [] },
              name: values.name,
              type: type,
              coords: createNewPoint,
              previousName: values.name,
            });

            setImage({
              path:
                'images/' +
                values.uri.split('/')[values.uri.split('/').length - 1],
              url: values.uri,
            });

            setIndex(3);

            setTmpSites(
              (await getItems()).docs.map((doc: { data: () => any }) =>
                doc.data(),
              ),
            );

            var start = new Date().getTime();
            var end = 0;
            var time = 0;

            while (time <= 1000) {
              end = new Date().getTime();
              time = end - start;
            }

            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success,
            );
            setOpenNewPoint(false);
            setIndex(0);
            setValues({ name: '', description: '', uri: '' });
          }}
          disabled={disable()}
          activeOpacity={0.6}
        >
          <Text style={newPointFilterStyles.text_button}>{'→'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
