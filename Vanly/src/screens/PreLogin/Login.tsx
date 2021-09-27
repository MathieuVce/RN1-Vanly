import React, { useContext, useState } from 'react';
import { StyleSheet, SafeAreaView, Button, ActivityIndicator, View } from 'react-native';

import { IAuth } from '../../@types/IClient';
import { ClientContext } from '../../contexts/ClientContext';

import { AppModelNavProps } from '../../roots/AppModelNav';

type ILoginProps = AppModelNavProps<'Login'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export const Login: React.FC<ILoginProps> = ({ }) => {
  const { login } = useContext(ClientContext);


  const [loading, setLoading] = useState(false);
  const [values] = useState<IAuth>({ 'email': 'mathieu.vacance@epitech.eu', 'password': 'Motdepasse' });

  const onCLick = async () => {
    setLoading(true);
    login(values);
    setLoading(false);

  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title='Login' onPress={onCLick}></Button>
      {
        loading ?
          <ActivityIndicator size="large" color="#00ff00"/>
          :
          <View></View>
      }
    </SafeAreaView>
  );
};