import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Keyboard,
} from 'react-native';
import { IReset } from '../../@types/IClient';
import { AlertContext } from '../../contexts/AlertContext';
import { ClientContext } from '../../contexts/ClientContext';

import { AppModelNavProps } from '../../roots/AppModelNav';

type IForgottenPasswordProps = AppModelNavProps<'ForgottenPassword'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#99D3A6',
  },
  header: {
    marginLeft: 30,
    marginTop: 30,
  },
  login: {
    paddingTop: 8,
    marginLeft: 16 * 2,
  },
  loginText: {
    fontWeight: '700',
    fontSize: 15,
    color: 'grey',
  },
  title: {
    fontSize: 45,
    width: '85%',
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16 * 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  footer: {
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    width: '100%',
  },
  input: {
    textAlign: 'left',
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    marginVertical: 16,
    width: '100%',
  },
  centerText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLogin: {
    height: 64,
    width: 64,
    backgroundColor: '#FEC156',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,

    elevation: 21,
  },
  textButton: {
    fontSize: 20,
    color: 'white',
    fontWeight: '900',
  },
});

export const ForgottenPassword: React.FC<IForgottenPasswordProps> = ({
  navigation,
}) => {
  const { resetpassword, getTraduction } = useContext(ClientContext);
  const { Alerts } = useContext(AlertContext);

  const [form, setForm] = useState<IReset>({
    email: '',
  });
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  const onSubmit = async () => {
    Keyboard.dismiss();
    if (!emailRegex.test(String(form.email).toLowerCase())) {
      Alerts.warning({
        title: getTraduction('ALERT_EMAIL'),
        message: '',
      });
      return;
    } 
    await resetpassword({
      email: form.email.toLowerCase(),
    });
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={require('../../assets/Login.png')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
          <TouchableOpacity style={styles.login} onPress={() => {navigation.navigate('Login');}} activeOpacity={0.6}>
            <Text style={styles.loginText}>{getTraduction('LOGIN')}</Text>
          </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>{getTraduction('FORGOTTEN_PWD')}</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.content}>
            <TextInput
              style={styles.input}
              placeholder="contact@email.com"
              keyboardType="email-address"
              value={form.email}
              onChangeText={value => setForm({ email: value })}
            ></TextInput>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.buttonLogin} onPress={onSubmit}>
              <Text style={styles.textButton}>{'→'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.centerText}></View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};
