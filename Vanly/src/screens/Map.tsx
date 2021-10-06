import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Dimensions } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import firebase from '../database/firebase';
import { ModalE } from '../components/Modal';
import { AppModelNavConnectedProps } from '../roots/AppModelNavConnected';
import { Item } from '../components/Filters';
import { VanPoint } from './VanPoint';
import { VanPointFilter } from './VanPointFilter';
import { ViewItem } from './ViewItem';
import { mapStyle } from '../@types/IMap';
import { Profil } from './Profil';

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
  filtersView: {
    paddingHorizontal: 16 * 2,
  },
  profil: {
    position: 'absolute',
    top: 8,
    right: 10,
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
});

export const Map: React.FC<IMapProps> = ({ }) => {

  const [openFilters, setOpenFilters] = useState(false);
  const [openProfil, setOpenProfil] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [index, setIndex] = useState(0);
  const [sites, setSites] = useState<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>();
  const [test, setTest] = useState<Array<any>>();
  const [fieldValue] = useState({ 'pointOfView': true, 'waterPoint': true, 'gazStation': true });
  const [item, setItem] = useState<any>();
  const [createNewPoint, setCreateNewPoint] = useState({ 'latitude': 0, 'longitude': 0 });
  const [openNewPoint, setOpenNewPoint] = useState(false);
  const map = useRef(null);
  const [values, setValues] = useState({ 'name': '', 'description': '', uri: '' });

  const getSites = async () => {
    setSites(await firebase.firestore().collection('Sites').get());
    setTest((await firebase.firestore().collection('Sites').get()).docs.map(doc => doc.data()));
    setItem(test ? test[0] : null);
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
    }).filter(function (data) {
      return data != null;
    }));
  };

  useEffect(() => {
    getSites();
  }, []);

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
          onLongPress={(e) => { setCreateNewPoint(e.nativeEvent.coordinate); setOpenNewPoint(true); }}
          >
            { test?.map((doc, k) => {
              return (
                <Marker key={k} coordinate={{ latitude : doc.coords.latitude, longitude : doc.coords.longitude }} onPress={() => {setOpenView(true); setItem(doc); }}>
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
          <MaterialCommunityIcons name="layers" size={24} color={ openFilters ? 'lightgrey' : '#99D3A6'} />
        </TouchableOpacity>
        <TouchableOpacity style={mainStyles.profil}  onPress={() => {setOpenProfil(true);}} activeOpacity={0.45}>
          <FontAwesome name="user" size={24} color="#99D3A6" />
        </TouchableOpacity>
      </View>
      
      <ModalE  isOpen={openFilters}  setIsOpen={setOpenFilters} height={16 * 27} close={() => {}}>
        <View style={mainStyles.filtersView}>
          <Item name='Point of View' icon={ { name: 'map-marker', type: 'MaterialCommunityIcons' }} onPress={() => { fieldValue.pointOfView = !fieldValue.pointOfView; filterItems(); }} isSelected={fieldValue.pointOfView} color={{ icon: '#FEC156', bg: '#FFEECF' }}/>
          <Item name='Water Point' icon={ { name: 'water-off', type: 'MaterialCommunityIcons' }} onPress={() => { fieldValue.waterPoint = !fieldValue.waterPoint; filterItems(); }} isSelected={fieldValue.waterPoint} color={{ icon: '#768AF8', bg: '#DAE0FF' }}/>
          <Item name='Gaz Station' icon={ { name: 'car', type: 'FontAwesome5' }} onPress={() => { fieldValue.gazStation = !fieldValue.gazStation; filterItems(); }} isSelected={fieldValue.gazStation} color={{ icon: '#B98888', bg: '#DEC3C3' }}/>
        </View>
      </ModalE>

      <ModalE  isOpen={openProfil}  setIsOpen={setOpenProfil} height={16 * -5} close={() => {}}>
        <Profil setOpenProfil={setOpenProfil}/>
      </ModalE>

      <ModalE  isOpen={openView}  setIsOpen={setOpenView} height={16 * 15} close={() => {}}>
        <ViewItem item={item} setSites={setSites}/>
      </ModalE>

      <ModalE isOpen={openNewPoint} setIsOpen={setOpenNewPoint} height={16 * 3} close={() => { setIndex(0); setValues({ 'name': '', 'description': '', uri: '' }); }}>
          { index == 0 ?
            <VanPoint setIndex={setIndex} setValues={setValues} values={values}/>  
            :
            <VanPointFilter setIndex={setIndex} createNewPoint={createNewPoint} values={values} setOpenNewPoint={setOpenNewPoint} setTest={setTest} setSites={setSites} setValues={setValues}/>
          }
      </ModalE>
    </View>
  );
};