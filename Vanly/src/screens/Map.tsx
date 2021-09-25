import React from 'react';
import { StyleSheet, View, Text , Dimensions} from 'react-native';

import { AppModelNavConnectedProps } from '../roots/AppModelNavConnected';
import  MapView, { Marker } from 'react-native-maps';



type IMapProps = AppModelNavConnectedProps<'Map'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16 * 2,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  text : {
    position : "absolute",
    fontWeight : "900",
    color : 'red',
    fontSize : 50
  }
});

export const Map: React.FC<IMapProps> = ({ }) => {
  return (
    <View style={styles.container}> 
        <MapView style={styles.map}     
          initialRegion={{
            latitude: 43.1030272,
            longitude: 3.0867456,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
            <Marker coordinate={{latitude : 43.1030272, longitude : 3.0867456}} title={"Chez moi"} description={"C'est ma maison quoi"}></Marker>
        </MapView>
      {/* <Text style={styles.text} >Vanly </Text> */}
    </View>
  );
};