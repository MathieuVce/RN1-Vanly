import React, { useContext, useState } from 'react';
import { StyleSheet, SafeAreaView, Button, ActivityIndicator } from 'react-native';

import { IAuth } from '../../@types/IClient';
import { ClientContext } from '../../contexts/ClientContext';

import { AppModelNavProps } from '../../roots/AppModelNav';

type ILoginProps = AppModelNavProps<'Login'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
});

export const Login: React.FC<ILoginProps> = ({ }) => {
  const { login } = useContext(ClientContext);


  const [loading] = useState(false);
  const [values] = useState<IAuth>({ 'email': 'mathieu.vacance@epitech.eu', 'password': 'Motdepasse1@' });

  const onCLick = async () => {
    // setLoading(true);
    await login(values);
    // setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {
        loading ?
        <ActivityIndicator size='large' color="black"/>
          :
        <Button title='Login' onPress={onCLick}/>
      }
    </SafeAreaView>
  );
};