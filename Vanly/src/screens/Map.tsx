import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Dimensions } from 'react-native';

import firebase from '../database/firebase';
import { ModalE } from '../components/Modal';
import { AppModelNavConnectedProps } from '../roots/AppModelNavConnected';
import { Item } from '../components/Filters';
import { AntDesign, FontAwesome5, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

type IMapProps = AppModelNavConnectedProps<'Map'>;

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
    top: 10,
    left: 10,
    height : 60,
    width : 60,
    borderRadius : 25,
    backgroundColor : 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
    justifyContent : 'center',
    alignItems : 'center',

  },
  profil: {
    position: 'absolute',
    top: 10,
    right: 10,
    height : 60,
    width : 60,
    borderRadius : 25,
    backgroundColor : '#99D3A6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
    justifyContent : 'center',
    alignItems : 'center',
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

const profilStyles = StyleSheet.create({
  profilContainer: {
    height : 800,
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center',
  },
  backGroundIllus: {
    top : -620,
    height : '100%',
    width : '160%',
    backgroundColor : '#99D3A6',
    borderRadius : 280,
  },
  profilPicture : {
    height : 150,
    width : 150,
    backgroundColor : '#F2F2F2',
    position : 'absolute',
    top : 120,
    borderRadius : 55,
    borderWidth : 5,
    borderColor : '#99D3A6',
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center',
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

export const Map: React.FC<IMapProps> = ({ }) => {

  const [openFilters, setOpenFilters] = useState(false);
  const [openProfil, setOpenProfil] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [sites, setSites] = useState<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>();
  const [test, setTest] = useState<Array<any>>();
  const [fieldValue] = useState({ 'pointOfView': true, 'waterPoint': true, 'gazStation': true });
  const [like, setLike] = useState(false);
  const [item, setItem] = useState(0);
  const map = useRef(null);

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

    setSites(await firebase.firestore().collection('Sites').get());
  };

  const removeLike = async () => {
    const pipes = firebase.firestore().collection('Sites');

    await pipes.doc(sites?.docs[item].id).set({
      ...sites?.docs[item].data(),
      likes: sites?.docs[item].data().likes - 1,
    });

    setSites(await firebase.firestore().collection('Sites').get());
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

  const mapStyle = [
    {
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#242f3e',
        },
      ],
    },
    {
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#746855',
        },
      ],
    },
    {
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'color': '#242f3e',
        },
      ],
    },
    {
      'featureType': 'administrative.land_parcel',
      'elementType': 'labels',
      'stylers': [
        {
          'visibility': 'off',
        },
      ],
    },
    {
      'featureType': 'administrative.locality',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#d59563',
        },
      ],
    },
    {
      'featureType': 'poi',
      'elementType': 'labels.text',
      'stylers': [
        {
          'visibility': 'off',
        },
      ],
    },
    {
      'featureType': 'poi',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#d59563',
        },
      ],
    },
    {
      'featureType': 'poi.business',
      'stylers': [
        {
          'visibility': 'off',
        },
      ],
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#263c3f',
        },
      ],
    },
    {
      'featureType': 'poi.park',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#6b9a76',
        },
      ],
    },
    {
      'featureType': 'road',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#38414e',
        },
      ],
    },
    {
      'featureType': 'road',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#212a37',
        },
      ],
    },
    {
      'featureType': 'road',
      'elementType': 'labels.icon',
      'stylers': [
        {
          'visibility': 'off',
        },
      ],
    },
    {
      'featureType': 'road',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#9ca5b3',
        },
      ],
    },
    {
      'featureType': 'road.arterial',
      'elementType': 'labels',
      'stylers': [
        {
          'visibility': 'off',
        },
      ],
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#746855',
        },
      ],
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#1f2835',
        },
      ],
    },
    {
      'featureType': 'road.highway',
      'elementType': 'labels',
      'stylers': [
        {
          'visibility': 'off',
        },
      ],
    },
    {
      'featureType': 'road.highway',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#f3d19c',
        },
      ],
    },
    {
      'featureType': 'road.local',
      'stylers': [
        {
          'visibility': 'off',
        },
      ],
    },
    {
      'featureType': 'road.local',
      'elementType': 'labels',
      'stylers': [
        {
          'visibility': 'off',
        },
      ],
    },
    {
      'featureType': 'transit',
      'stylers': [
        {
          'visibility': 'off',
        },
      ],
    },
    {
      'featureType': 'transit',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#2f3948',
        },
      ],
    },
    {
      'featureType': 'transit.station',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#d59563',
        },
      ],
    },
    {
      'featureType': 'water',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#17263c',
        },
      ],
    },
    {
      'featureType': 'water',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#515c6d',
        },
      ],
    },
    {
      'featureType': 'water',
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'color': '#17263c',
        },
      ],
    },
  ];
  return (
    <View style={mainStyles.container}>
      <MapView style={mainStyles.map}
          ref={map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 43.1030272,
            longitude: 3.0867456,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          customMapStyle={mapStyle}
          >
            { test?.map((doc, k) => {
              return (
                <Marker key={k} coordinate={{ latitude : doc.coords.latitude, longitude : doc.coords.longitude }} onPress={() => {setOpenView(true); setItem(k); }}>
                  {doc.type == 'pointOfView' ? 
                    <Image source={require('../assets/view.png')}/>
                    : doc.type == 'waterPoint' ?
                    <Image source={require('../assets/water.png')}/>
                      : doc.type == 'gazStation' ?
                      <Image source={require('../assets/gaz.png')}/>
                        :
                        <Text></Text>
                  }
                </Marker>
              );
            })
            }
      </MapView>
      <View style={mainStyles.header}>
        <TouchableOpacity style={mainStyles.filters}  onPress={() => {setOpenFilters(true); }} activeOpacity={0.45}>
          <MaterialCommunityIcons name="layers" size={24} color='#99D3A6' />
        </TouchableOpacity>
        <TouchableOpacity style={mainStyles.profil}  onPress={() => {setOpenProfil(true);}} activeOpacity={0.45}>
         <FontAwesome name="user" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ModalE  isOpen={openFilters}  setIsOpen={setOpenFilters} height={16 * 27} close={() => {}}>
        <View style={filtersStyles.filtersView}>
          <Item name='Point of View' icon={ { name: 'map-marker', type: 'MaterialCommunityIcons' }} onPress={() => { fieldValue.pointOfView = !fieldValue.pointOfView; filterItems(); }} isSelected={fieldValue.pointOfView}/>
          <Item name='Water Point' icon={ { name: 'water-off', type: 'MaterialCommunityIcons' }} onPress={() => { fieldValue.waterPoint = !fieldValue.waterPoint; filterItems(); }} isSelected={fieldValue.waterPoint}/>
          <Item name='Gaz Station' icon={ { name: 'car', type: 'FontAwesome5' }} onPress={() => { fieldValue.gazStation = !fieldValue.gazStation; filterItems(); }} isSelected={fieldValue.gazStation}/>
        </View>
      </ModalE>
      <ModalE  isOpen={openProfil}  setIsOpen={setOpenProfil} height={16 * -5} close={() => {}}>
        <TouchableOpacity style={profilStyles.profilContainer} onPress={() => {setOpenProfil(false);}}>
            <View style={profilStyles.backGroundIllus}></View>
            {/* IMPLEMENTER PICK UP PHOTO SUR LA TOUCHABLEOPACITY CI-DESSOUS */}
            <TouchableOpacity style={profilStyles.profilPicture}>
              <MaterialIcons name="add-a-photo" size={24} color="darkgrey" />
            </TouchableOpacity>
        </TouchableOpacity>
      </ModalE>
      <ModalE  isOpen={openView}  setIsOpen={setOpenView} height={16 * 15} close={() => {}}>
        <View style={itemStyles.container}>
          <View style={itemStyles.head}>
            <View style={itemStyles.icon}>
              <FontAwesome5 name='map-marker-alt' size={20} color='white'/>
            </View>
            <Text style={itemStyles.name}>{sites?.docs[item].data().name}</Text>
          </View>
          <Image style={itemStyles.image} source={{ uri : sites?.docs[item].data().image }}/>
          <Text style={{ ...itemStyles.description, paddingHorizontal: 16 }}>{sites?.docs[item].data().description}</Text>
          <View style={itemStyles.creator}>
            <Text style={itemStyles.description}>by </Text>
            <Text style={itemStyles.create}>{sites?.docs[item].data().creator}</Text>
          </View>
          <View style={itemStyles.creator}>
            { like ? 
              <AntDesign name='like1' size={27} color='#FEC156' style={itemStyles.likeic} onPress={() => {setLike(!like); removeLike(); }}/>
              :
              <AntDesign name='like2' size={27} color='lightgrey' style={itemStyles.likeic} onPress={() => {setLike(!like); addLike(); }}/>
            }
            <Text style={itemStyles.like}>{sites?.docs[item].data().likes}</Text>
          </View>
        </View>
      </ModalE>
    </View>
  );
};