import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';

import firebase from '../database/firebase';
import { ModalE } from '../components/Modal';
import { AppModelNavConnectedProps } from '../roots/AppModelNavConnected';
import { Item } from '../components/Filters';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';

type IMapProps = AppModelNavConnectedProps<'Map'>;

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  header: {
    width: '95%',
    height: '10%',
    alignSelf: 'center',
    marginTop: 16 * 3,
  },
  filters: {
    position: 'absolute',
    top: -13,
    left: -16,
  },
  profil: {
    position: 'absolute',
    top: -16,
    right: -23,
  },
  filtersView: {
    paddingHorizontal: 16 * 2,
  },
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

const filtersStyles = StyleSheet.create({
  filtersView: {
    paddingHorizontal: 16 * 2,
  },
});

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
    paddingVertical: 16,
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
    marginHorizontal: 16,
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

export const Map: React.FC<IMapProps> = ({ }) => {

  const [openFilters, setOpenFilters] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [sites, setSites] = useState<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>();
  const [test, setTest] = useState<Array<any>>();
  const [fieldValue] = useState({ 'pointOfView': true, 'waterPoint': true, 'gazStation': true });
  const [like, setLike] = useState(false);
  const [item, setItem] = useState(0);

  const getSites = async () => {
    setSites(await firebase.firestore().collection('Sites').get());
    setTest((await firebase.firestore().collection('Sites').get()).docs.map(doc => doc.data()));
  };

  const addLike = async () => {
    const pipes = firebase.firestore().collection('Sites');

    await pipes.doc(sites?.docs[item].id).set({
      ...sites?.docs[item].data(),
      likes: sites?.docs[item].data().likes + 1,
    });

    getSites();
  };

  const removeLike = async () => {
    const pipes = firebase.firestore().collection('Sites');

    await pipes.doc(sites?.docs[item].id).set({
      ...sites?.docs[item].data(),
      likes: sites?.docs[item].data().likes - 1,
    });

    getSites();
  };

  const filterItems = async () => {
    setTest(sites?.docs.map((doc) => {
      if (fieldValue.pointOfView && doc.data().type == 'pointOfView')
        return doc.data();
      if (fieldValue.waterPoint && doc.data().type == 'waterPoint')
        return doc.data();
      if (fieldValue.gazStation && doc.data().type == 'gazStation')
        return doc.data();
      return null;
    }).filter(function (el) {
      return el != null;
    }));
  };

  useEffect(() => {
    getSites();
  }, []);

  return (
    <View style={mainStyles.container}>
        {/* <Image style={mainStyles.map} source={require('../assets/map.png')} /> */}
      <View style={mainStyles.header}>
        <TouchableOpacity onPress={() => {setOpenFilters(true); }} activeOpacity={0.45}>
          <Image style={mainStyles.filters} source={require('../assets/filters.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} activeOpacity={0.45}>
          <Image style={mainStyles.profil} source={require('../assets/profil.png')} />
        </TouchableOpacity>
      </View>
      { test?.map((doc, k) => {
        return (
          <TouchableOpacity key={k} onPress={() => {setOpenView(true); setItem(k); }}>
            <Text>{doc.name}</Text>
            <Text>{doc.type}</Text>
          </TouchableOpacity>
        );
      })
      }
      <ModalE  isOpen={openFilters}  setIsOpen={setOpenFilters} height={16 * 27} close={() => {}}>
        <View style={filtersStyles.filtersView}>
          <Item name='Point of View' icon={ { name: 'map-marker', type: 'MaterialCommunityIcons' }} onPress={() => { fieldValue.pointOfView = !fieldValue.pointOfView; filterItems(); }}/>
          <Item name='Water Point' icon={ { name: 'water-off', type: 'MaterialCommunityIcons' }} onPress={() => { fieldValue.waterPoint = !fieldValue.waterPoint; filterItems(); }}/>
          <Item name='Gaz Station' icon={ { name: 'car', type: 'FontAwesome5' }} onPress={() => { fieldValue.gazStation = !fieldValue.gazStation; filterItems(); }}/>
        </View>
      </ModalE>
      <ModalE  isOpen={openView}  setIsOpen={setOpenView} height={16 * 15} close={() => {}}>
        <View style={itemStyles.container}>
          <View style={itemStyles.head}>
            <View style={itemStyles.icon}>
              <FontAwesome5 name="map-marker-alt" size={20} color="white"/>
            </View>
            <Text style={itemStyles.name}>{sites?.docs[item].data().name}</Text>
          </View>
          <Image style={itemStyles.image} source={{ uri : sites?.docs[item].data().image }}/>
          <Text style={itemStyles.description}>{sites?.docs[item].data().description}</Text>
          <View style={itemStyles.creator}>
            <Text style={itemStyles.description}>by </Text>
            <Text style={itemStyles.create}>{sites?.docs[item].data().creator}</Text>
          </View>
          <View style={itemStyles.creator}>
            { like ? 
              <AntDesign name="like1" size={27} color="#FEC156" style={itemStyles.likeic} onPress={() => {setLike(!like); removeLike(); }}/>
              :
              <AntDesign name="like2" size={27} color="lightgrey" style={itemStyles.likeic} onPress={() => {setLike(!like); addLike(); }}/>
            }
            <Text style={itemStyles.like}>{sites?.docs[item].data().likes}</Text>
          </View>
        </View>
      </ModalE>
    </View>
  );
};