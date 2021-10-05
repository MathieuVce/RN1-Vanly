import firebase from '../database/firebase';
import React, { useContext, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { ClientContext } from '../contexts/ClientContext';
import { Item } from './Filters';

interface IVanPointFilterProps {
  setIndex: React.Dispatch<React.SetStateAction<number>>
  values: any
  createNewPoint: { 'latitude': number, 'longitude': number }
  setOpenNewPoint: React.Dispatch<React.SetStateAction<boolean>>
  setTest: React.Dispatch<React.SetStateAction<any>>
  setSites: React.Dispatch<React.SetStateAction<any>>
  setValues:  React.Dispatch<React.SetStateAction<any>>
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
    marginBottom: 16 * 2,
  },
  middleContainer: {
    width: '100%',
    height: '55%',
  },
  bottomContainer: {
    width: '180%',
    height: '14%',
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
    bottom: -16 * 4.4,
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
  button_right: {
    bottom: -4,
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

export const VanPointFilter: React.FC<IVanPointFilterProps> = ({ setIndex, values, createNewPoint, setOpenNewPoint, setTest, setSites, setValues }) => {

  const { client } = useContext(ClientContext);
  const [fieldValue] = useState({ 'pointOfView': false, 'waterPoint': false, 'gazStation': false });

  const disable = () => {
    if (!fieldValue.pointOfView && !fieldValue.waterPoint && !fieldValue.gazStation)
      return true;
    return false;
  };

  return (
    <View style={newPointFilterStyles.container}>
      <Text style={newPointFilterStyles.headerTextFilter}>Choose a VanPoint type</Text>
      <View style={newPointFilterStyles.middleContainer}>
          <Item name='Point of View' icon={ { name: 'map-marker', type: 'MaterialCommunityIcons' }} onPress={() => { 
            fieldValue.pointOfView = !fieldValue.pointOfView;
            fieldValue.waterPoint = false;
            fieldValue.gazStation = false;
          }} isSelected={fieldValue.pointOfView} color={{ icon: '#FEC156', bg: '#FFEECF' }}
          description='Such a nice quiet place where to live your life !'
          />
          <Item name='Water Point' icon={ { name: 'water-off', type: 'MaterialCommunityIcons' }} onPress={() => {
            fieldValue.waterPoint = !fieldValue.waterPoint;
            fieldValue.pointOfView = false;
            fieldValue.gazStation = false;
          }} isSelected={fieldValue.waterPoint} color={{ icon: '#768AF8', bg: '#DAE0FF' }}
          description='Glouglouglou, tap water free everywhere'
          />
          <Item name='Gaz Station' icon={ { name: 'car', type: 'FontAwesome5' }} onPress={() => {
            fieldValue.gazStation = !fieldValue.gazStation;
            fieldValue.pointOfView = false;
            fieldValue.waterPoint = false;
          }} isSelected={fieldValue.gazStation} color={{ icon: '#B98888', bg: '#DEC3C3' }}
          description='If you need some fuel... look around !'
          />
      </View>
      <View style={newPointFilterStyles.bottomContainer}>
        <TouchableOpacity
            style={newPointFilterStyles.button_left}
            onPress={() => {setIndex(0); }}
            disabled={false}
            activeOpacity={0.6}
          >
            <Text style={newPointFilterStyles.text_button}>{'←'}</Text>
          </TouchableOpacity>
        <TouchableOpacity
            style={newPointFilterStyles.button_right}
            onPress={async () => { 
              setOpenNewPoint(false);
              const pipes = firebase.firestore().collection('Sites');

              await pipes.doc(values.name).set({
                creator: client?.firstname,
                description: values.description,
                image: values.uri,
                likes: 0,
                name: values.name,
                type: fieldValue.pointOfView ? 'pointOfView' : fieldValue.waterPoint ? 'waterPoint' : 'gazStation',
                coords: createNewPoint,
              });

              setSites(await firebase.firestore().collection('Sites').get());
              setTest((await firebase.firestore().collection('Sites').get()).docs.map(doc => doc.data()));
              setIndex(0);
              setValues({ 'name': '', 'description': '', uri: '' });
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