import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

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
});

export const Map: React.FC<IMapProps> = ({ }) => {

  const [sites, setSites] = useState<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>();
  const [test, setTest] = useState<Array<any>>();
  const field = ['pointOfView', 'waterPoint', 'gazStation'];
  const [index, setIndex] = useState(-1);

  const getSites = async () => {
    setSites(await firebase.firestore().collection('Sites').get());
    setTest((sites?.docs.map(doc => doc.data().type == field[index] ? doc.data() : null).filter(function (el) {
      return el != null;
    }) ));
  };

  useEffect(() => {
    getSites();
  }, [test, setTest, index, setIndex]);

  return (
    <View style={styles.container}>
      <Button title='Point Of View' onPress={() => {setIndex(0); }}/>
      <Button title='Water Point' onPress={() => {setIndex(1); }}/>
      <Button title='Gaz Station' onPress={() => {setIndex(2); }}/>
      { test?.map((doc, k) => {
        return (
          <View key={k}>
            <Text>{doc.name}</Text>
            <Text>{doc.type}</Text>
          </View>
        );
      })
      }
    </View>
  );
};