import React from 'react';
import { View, StyleSheet } from 'react-native';

import { AppModelNavProps } from '../../roots/AppModelNav';

type IForgottenPasswordProps = AppModelNavProps<'ForgottenPassword'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export const ForgottenPassword: React.FC<IForgottenPasswordProps> = ({ }) => {
  return (
    <View style={styles.container} />
  );
};

