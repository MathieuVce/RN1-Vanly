import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, View, Text, Button, Image } from 'react-native';

import firebase from '../database/firebase';
import { AppModelNavConnectedProps } from '../roots/AppModelNavConnected';

type IMapProps = AppModelNavConnectedProps<'Map'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16 * 2,
  },
  head: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  icon: {
    width: 16 * 2,
    height: 16 * 2,
    position: 'absolute',
    bottom: 0,
    left: -16 * 3,
  },
  name: {
    fontSize: 30,
    color: '#1E2E86',
  },
  image: {
    width: '80%',
    height: '20%',
    borderRadius: 20,
  },
  description: {
    fontSize: 20,
    color: '#1E2E86',
    marginVertical: 16,
  },
  creator: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginHorizontal: 16 * 2,
  },
  create: {
    fontSize: 20,
    color: '#1E2E86',
    marginVertical: 16,
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
  },
});

export const Map: React.FC<IMapProps> = ({ }) => {

  const [sites, setSites] = useState<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>();
  const [like, setLike] = useState(false);

  const getSites = async () => {
    setSites(await firebase.firestore().collection('Sites').get());
  };

  useEffect(() => {
    getSites();
  }, []);

  const addLike = async () => {
    const pipes = firebase.firestore().collection('Sites');

    await pipes.doc(sites?.docs[0].id).set({
      ...sites?.docs[0].data(),
      likes: sites?.docs[0].data().likes + 1,
    });

    getSites();
  };

  const removeLike = async () => {
    const pipes = firebase.firestore().collection('Sites');

    await pipes.doc(sites?.docs[0].id).set({
      ...sites?.docs[0].data(),
      likes: sites?.docs[0].data().likes - 1,
    });

    getSites();
  };

  return (
    <View style={styles.container}>
      <Button title='Get' onPress={getSites}/>
      <View style={styles.head}>
        <FontAwesome5 name="map-marker-alt" size={26} color="#FEC156" style={styles.icon}/>
        <Text style={styles.name}>{sites?.docs[0].data().name}</Text>
      </View>
      <Image style={styles.image} source={{ uri : sites?.docs[0].data().image }}/>
      <Text style={styles.description}>{sites?.docs[0].data().description}</Text>
      <View style={styles.creator}>
        <Text style={styles.description}>by </Text>
        <Text style={styles.create}>{sites?.docs[0].data().creator}</Text>
      </View>
      <View style={styles.creator}>
        { like ? 
          <AntDesign name="like1" size={27} color="#FEC156" style={styles.likeic} onPress={() => {setLike(!like); removeLike(); }}/>
          :
          <AntDesign name="like2" size={27} color="lightgrey" style={styles.likeic} onPress={() => {setLike(!like); addLike(); }}/>
        }
        <Text style={styles.like}>{sites?.docs[0].data().likes}</Text>
      </View>
    </View>
  );
};