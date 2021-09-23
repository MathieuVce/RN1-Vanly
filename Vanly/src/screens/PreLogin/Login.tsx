import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import { AppModelNavProps } from '../../roots/AppModelNav';

type ILoginProps = AppModelNavProps<'Login'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export const Login: React.FC<ILoginProps> = ({ }) => (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
);