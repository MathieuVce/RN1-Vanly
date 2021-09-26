import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppModelNavConnectedProps } from '../roots/AppModelNavConnected';

type IMapProps = AppModelNavConnectedProps<'Map'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
  },
});


export const Map: React.FC<IMapProps> = ({ }) => {

  return (
    <View style={styles.container}>
    </View>
  );
};