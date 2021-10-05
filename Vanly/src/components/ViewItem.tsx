import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import firebase from '../database/firebase';

interface IViewItemProps {
  item: any
  setSites: React.Dispatch<React.SetStateAction<any>>
}

const itemStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16 * 7,
  },
  head: {
    flexDirection: 'row',
    paddingVertical: 8,
    width: '90%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 16 * 2.5,
    height: 16 * 2.5,
    position: 'absolute',
    bottom: 16,
    left: 0,
    backgroundColor: '#FEC156',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  name: {
    fontSize: 30,
    color: '#1E2E86',
    paddingBottom: 16,
  },
  image: {
    width: '90%',
    height: '100%',
    borderRadius: 10,
  },
  description: {
    fontSize: 20,
    color: '#1E2E86',
    marginVertical: 8,
  },
  creator: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginHorizontal: 24,
  },
  create: {
    fontSize: 20,
    color: '#1E2E86',
    marginVertical: 8,
    fontWeight: 'bold',
  },
  likeic: {
    bottom: -13,
  },
  like: {
    fontSize: 20,
    color: '#FEC156',
    marginVertical: 16,
    marginLeft: 16,
    fontWeight: 'bold',
  },
});

export const ViewItem: React.FC<IViewItemProps> = ({ item, setSites }) => {

  const [like, setLike] = useState(false);

  const addLike = async () => {
    const pipes = firebase.firestore().collection('Sites');

    await pipes.doc(item.name).set({
      ...item,
      likes: item.likes + 1,
    });

    setSites(await firebase.firestore().collection('Sites').get());
  };

  const removeLike = async () => {
    const pipes = firebase.firestore().collection('Sites');

    await pipes.doc(item.name).set({
      ...item,
      likes: item.likes - 1,
    });

    setSites(await firebase.firestore().collection('Sites').get());
  };
  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.head}>
      {
        item.type == 'pointOfView' ?
          <View style={itemStyles.icon}>
              <FontAwesome5 name='map-marker-alt' size={20} color='white'/>
          </View>
          : item.type == 'waterPoint' ?
            <View style={{ ...itemStyles.icon, backgroundColor: '#768AF8' }}>
              <MaterialCommunityIcons name='water-off' size={20} color='white'/>
            </View>
            : item.type == 'gazStation' ?
              <View style={{ ...itemStyles.icon, backgroundColor: '#B98888' }}>
                <FontAwesome5 name='car' size={20} color='white'/>
              </View>
              :
              <View>
              </View>
      }
      <Text style={itemStyles.name}>{item?.name}</Text>
      </View>
      <Image style={itemStyles.image} source={{ uri : item?.image }}/>
      <Text style={{ ...itemStyles.description, paddingHorizontal: 16 }}>{item?.description}</Text>
      <View style={itemStyles.creator}>
      <Text style={itemStyles.description}>by </Text>
      <Text style={itemStyles.create}>{item?.creator}</Text>
      </View>
      <View style={itemStyles.creator}>
      { like ? 
        <AntDesign name='like1' size={27} color='#FEC156' style={itemStyles.likeic} onPress={() => {setLike(!like); addLike(); }}/>
        :
        <AntDesign name='like2' size={27} color='lightgrey' style={itemStyles.likeic} onPress={() => {setLike(!like); removeLike(); }}/>
      }
      <Text style={itemStyles.like}>{item?.likes}</Text>
      </View>
    </View>
  );
};