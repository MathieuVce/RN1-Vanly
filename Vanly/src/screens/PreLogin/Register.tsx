import React from 'react';
import { View, StyleSheet } from 'react-native';

import { AppModelNavProps } from '../../roots/AppModelNav';

type IRegisterProps = AppModelNavProps<'Register'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export const Register: React.FC<IRegisterProps> = ({ }) => (
  <View style={styles.container} />
);

