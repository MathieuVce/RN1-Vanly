import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Dimensions, ActivityIndicator } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';

import firebase from '../database/firebase';
import { ModalE } from '../components/Modal';
import { AppModelNavConnectedProps } from '../roots/AppModelNavConnected';
import { Item } from '../components/Filters';
import { VanPoint } from './VanPoint';
import { VanPointFilter } from './VanPointFilter';
import { ViewItem } from './ViewItem';
import { IRegion, mapStyle } from '../@types/IMap';
import { Profil } from './Profil';
import { ClientContext } from '../contexts/ClientContext';
import { AlertContext } from '../contexts/AlertContext';

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
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    width: '100%',
    height: '100%',
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16 * 14,
  },
  check: {
    width: 16 * 10,
    height: 16 * 10,
  },
  checkText: {
    fontSize: 25,
    color: '#525566',
    position: 'absolute',
    top: -16,
  },
});

export const Map: React.FC<IMapProps> = () => {
  const { getImage, getItems, client, deleteItem, getTraduction } = useContext(ClientContext);
  const { Alerts } = useContext(AlertContext);

  const [openFilters, setOpenFilters] = useState(false);
  const [modify, setModify] = useState(false);
  const [isModifying, setModifying] = useState(false);
  const [openProfil, setOpenProfil] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [index, setIndex] = useState(0);
  const [sites, setSites] = useState<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>();
  const [tmpSites, setTmpSites] = useState<Array<any>>();
  const [fieldValue] = useState({ 'pointOfView': true, 'waterPoint': true, 'gazStation': true });
  const [item, setItem] = useState<any>();
  const [image, setImage] = useState<string>();
  const [createNewPoint, setCreateNewPoint] = useState({ 'latitude': 0, 'longitude': 0 });
  const [openNewPoint, setOpenNewPoint] = useState(false);
  const [mapRef, setMapRef] = useState<MapView | null>();
  const [region, setRegion] = useState<IRegion>({ latitude: 0, longitude: 0, latitudeDelta: 0, longitudeDelta: 0 });
  const [values, setValues] = useState({ name: undefined, description: undefined, uri: undefined });
  const [iconSize, setIconSize] = useState({ 'width': 42, 'height': 50 });

  const getSites = async () => {
    setSites(await getItems());
    setTmpSites((await getItems()).docs.map((doc: { data: () => any; }) => doc.data()));
    setItem(tmpSites ? tmpSites[0] : null);
  };

  const getPosition = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alerts.warning({
        title: getTraduction('ALERT_PERMISSIONS_TITLE'),
        message: '',
      });
      return;
    }

    const position = await Location.getLastKnownPositionAsync({});
    setRegion({ ...region, latitude: position?.coords.latitude!, longitude: position?.coords.longitude! });
  };

  const filterItems = async () => {
    setTmpSites(sites?.docs.map((doc) => {
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

  const onRegionChange = async (locate: React.SetStateAction<IRegion>) => {
    setRegion(locate);
    if (mapRef) {
      try {
        const camera = await mapRef.getCamera();
        setIconSize({ 'width': camera.zoom * 1.7, 'height': camera.zoom * 2 });

      } catch (err) {
        console.error(err);
      }
    }
    setSites(await getItems());
    await filterItems();
  };

  const canModify = (doc: string | undefined) => {
    if (doc == client?.firstname) {
      setModify(true);
    } else {
      setModify(false);
    }
  };

  const handleDelete = async (doc: any) => {
    deleteItem({ name: doc.name, path: doc.image });
    Alerts.success({
      title: getTraduction('ALERT_DELETED_TITLE'),
      message: '',
    });
    setIndex(0);
    setValues({ name: undefined, description: undefined, uri: undefined });
    setModifying(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  useEffect(() => {
    (async () => {
      await  getPosition();
      await getSites();
    })();
  }, []);

  return (
    <View style={mainStyles.container}>
      <MapView style={mainStyles.map}
        ref={(ref) => {setMapRef(ref);}}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation={true}
        customMapStyle={mapStyle}
        onLongPress={(e) => { setCreateNewPoint(e.nativeEvent.coordinate); setOpenNewPoint(true); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }}
        onRegionChangeComplete={onRegionChange}
        maxZoomLevel={15}
        >
          { tmpSites?.map((doc, k) => {
            return (
              <Marker key={k} coordinate={{ latitude : doc.coords.latitude, longitude : doc.coords.longitude }} onPress={async () => {
                setImage(await getImage({ path: 'images', url: doc.image }));
                setItem(doc);
                canModify(doc.creator);
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); 
                setOpenView(true);
              }}>
                {doc.type == 'pointOfView' ? 
                  <Image style={{ width: iconSize.width, height: iconSize.height }} source={require('../assets/view.png')}/>
                  : doc.type == 'waterPoint' ?
                  <Image style={{ width: iconSize.width, height: iconSize.height }} source={require('../assets/water.png')}/>
                    : doc.type == 'gazStation' ?
                    <Image style={{ width: iconSize.width, height: iconSize.height }} source={require('../assets/gaz.png')}/>
                      :
                      <Text></Text>
                }
              </Marker>
            );
          })
          }
      </MapView>
 
      <View style={mainStyles.header}>
        <TouchableOpacity style={mainStyles.filters}  onPress={() => {setOpenFilters(true); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); }} activeOpacity={0.45}>
          <MaterialCommunityIcons name="layers" size={24} color={ openFilters ? 'lightgrey' : '#99D3A6'} />
        </TouchableOpacity>
        <TouchableOpacity style={mainStyles.profil}  onPress={() => {setOpenProfil(true); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);}} activeOpacity={0.45}>
          <FontAwesome name="user" size={24} color="#99D3A6" />
        </TouchableOpacity>
      </View>
   
      {
        openFilters ?
          <View style={mainStyles.modal}>
          </View>
          : openNewPoint ?
            <View style={mainStyles.modal}>
            </View>
            : openView  ?
              <View style={mainStyles.modal}>
              </View>
              : <View></View>
      }
   
      <ModalE  isOpen={openFilters}  setIsOpen={setOpenFilters} height={16 * 27} close={() => {}}>
        <View style={mainStyles.filtersView}>
          <Item name={getTraduction('POINT_OF_VIEW')} icon={ { name: 'map-marker', type: 'MaterialCommunityIcons' }} onPress={() => { fieldValue.pointOfView = !fieldValue.pointOfView; filterItems();Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); }} isSelected={fieldValue.pointOfView} color={{ icon: '#FEC156', bg: '#FFEECF' }}/>
          <Item name={getTraduction('WATER_POINT')}  icon={ { name: 'water-off', type: 'MaterialCommunityIcons' }} onPress={() => { fieldValue.waterPoint = !fieldValue.waterPoint; filterItems();Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); }} isSelected={fieldValue.waterPoint} color={{ icon: '#768AF8', bg: '#DAE0FF' }}/>
          <Item name={getTraduction('GAZ_STATION')}  icon={ { name: 'car', type: 'FontAwesome5' }} onPress={() => { fieldValue.gazStation = !fieldValue.gazStation; filterItems();Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); }} isSelected={fieldValue.gazStation} color={{ icon: '#B98888', bg: '#DEC3C3' }}/>
        </View>
      </ModalE>

      <ModalE  isOpen={openProfil}  setIsOpen={setOpenProfil} height={16 * -5} close={() => {}}>
        <Profil setOpenProfil={setOpenProfil}/>
      </ModalE>
   
      <ModalE button={modify ? getTraduction('MODIFY') : undefined} onApply={async () => {
        setModifying(true);
        setValues(
          {
            name: item.name,
            description:  item.description,
            uri: await getImage({ path: 'images', url: item.image }),
          },
        ); 
        setOpenNewPoint(true);
      }} buttonColor={item ? (item.type == 'pointOfView' ? '#FFEECF' : item.type == 'waterPoint' ? '#DAE0FF' : item.type == 'gazStation' ? '#DEC3C3' : undefined) : undefined} isOpen={openView}  setIsOpen={setOpenView} height={16 * 15} close={() => {}}>
        <ViewItem item={item} image={image} setTmpSites={setTmpSites} setItem={setItem} />
      </ModalE>

      <ModalE button={isModifying ? getTraduction('DELETE') : undefined} buttonColor={'#0B5F1E'} onApply={() => {handleDelete(item); setValues({ name: undefined, description: undefined, uri: undefined }); setModifying(false); }} isOpen={openNewPoint} setIsOpen={setOpenNewPoint} height={16 * 3} close={() => { setIndex(0); setValues({ name: undefined, description: undefined, uri: undefined }); setModifying(false); }}>
          { index == 0 ?
            <VanPoint setIndex={setIndex} setValues={setValues} values={values} modify={isModifying}  setModifying={setModifying} setOpenNewPoint={setOpenNewPoint} item={item} setTmpSites={setTmpSites}/>  
            : index == 1 ?
              <VanPointFilter setIndex={setIndex} createNewPoint={createNewPoint} values={values} setOpenNewPoint={setOpenNewPoint} setTmpSites={setTmpSites} setValues={setValues}/>
              : index == 2 ?
                <View style={mainStyles.center}>
                  <ActivityIndicator size={'large'} color='#99D3A6'></ActivityIndicator>
                </View>
                : index == 3 ?
                  <View style={mainStyles.center}>
                    <Image style={mainStyles.check} source={require('../assets/check.gif')}></Image>
                    {isModifying ?
                      <Text style={mainStyles.checkText}>{getTraduction('VANPOINT_MODIFIED')}</Text>
                      :
                      <Text style={mainStyles.checkText}>{getTraduction('VANPOINT_ADDED')}</Text>
                    }
                  </View> 
                  : <View></View>
          }
      </ModalE>
    </View>
  );
};


/*
<fr-FR>
Votre application au grand public !
Modifiez votre profil comme bon vous semble,
Choisissez votre langue préférée entre l'anglais et le français,
Modifiez à votre guise vos Vanpoints.
Laissez-vous guider grâce à google maps !
Voyagez dès maintenant avec Vanly et partagez vos Vanpoints favoris à notre communauté.
</fr-FR>
*/