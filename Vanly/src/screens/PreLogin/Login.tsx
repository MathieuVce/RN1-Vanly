import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Button,
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { IAuth } from '../../@types/IClient';
import { ClientContext } from '../../contexts/ClientContext';

import { AppModelNavProps } from '../../roots/AppModelNav';

type ILoginProps = AppModelNavProps<'Login'>;

const loginStyles = StyleSheet.create({
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
  viewFlag: {
    position: 'absolute',
    alignSelf: 'flex-end',
    backgroundColor: '#99D3A6',
    borderColor: '#FEC156',
    borderWidth: 1,
    borderRadius: 10,
    width: 16 * 4,
    height: 16 * 4.8,
    right: 8,
    top: -16 * 6.4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
  },
  flagFr: {
    position: 'absolute',
    width: 28,
    height: 22,
    right: 16 * 1.6,
    top: -16 * 5.6,
  },
  flagUk: {
    position: 'absolute',
    width: 28,
    height: 22,
    right: 16 * 1.6,
    top: -16 * 3.6,
  },
  title: {
    fontSize: 45,
    width: 300,
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
  subscribe: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#FEC156',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,

    elevation: 21,
  },
  input: {
    textAlign: 'left',
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    marginVertical: 16,
    width: '88%',
  },
  eye: {
    height: 16 * 2,
    width: 16 * 2,
    color: 'grey',
    left: 16 * 18.5,
    bottom: 16 * 2.3,
  },
  centerText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeText: {
    fontSize: 16,
    color: 'white',
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
  resetPwd: {
    width: '100%',
    alignItems: 'flex-end',
    fontSize: 8,
  },
  register: {
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});

export const Login: React.FC<ILoginProps> = ({ navigation }) => {
  const { login, getTraduction, setAppLang } = useContext(ClientContext); 
  const [eye, setEye] = useState(true);

  const [values, setValues] = useState<IAuth>({
    email: '',
    password: '',
  });
  const [showFlags, setFlags] = useState(false);
  const [isFrench, setLang] = useState(true);

  const onSubmit = async () => {
    Keyboard.dismiss();
    await login({
      email: values.email.toLowerCase(),
      password: values.password,
    });
  };

  const handleChange = (prop: keyof typeof values) => (value: any) => {
    setValues({
      ...values,
      [prop]: value,
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/Login.png')}
      style={loginStyles.background}
    >
      <SafeAreaView style={loginStyles.container}>
        <View style={loginStyles.header}>
          <Text style={loginStyles.title}>{getTraduction('TITLE')}</Text>
          <Text style={loginStyles.title}>{getTraduction('TITLE2')}</Text>
          {!showFlags && (
          <TouchableOpacity onPress={() => {setFlags(true); }} activeOpacity={0.6}>
            <Image
              source={isFrench ? require('../../assets/fr.png') : require('../../assets/uk.png')}
              style={loginStyles.flagFr}
            />
          </TouchableOpacity>
          )}
          {showFlags && (
            <View>
              <View style={loginStyles.viewFlag}>
              </View>
              <TouchableOpacity onPress={() => {setAppLang(isFrench ? 'fr' : 'en'); setFlags(false); setLang(isFrench);}} activeOpacity={0.6}>
                <Image
                  source={isFrench ? require('../../assets/fr.png') : require('../../assets/uk.png')}
                  style={loginStyles.flagFr}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {setAppLang(isFrench ? 'en' : 'fr'); setFlags(false); setLang(!isFrench);}} activeOpacity={0.6}>
                <Image
                  source={isFrench ? require('../../assets/uk.png') : require('../../assets/fr.png')}
                  style={loginStyles.flagUk}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={loginStyles.content}>
            <TextInput
              style={loginStyles.input}
              placeholder="contact@email.com"
              keyboardType="email-address"
              value={values.email}
              onChangeText={handleChange('email')}
            ></TextInput>
            <TextInput
              style={loginStyles.input}
              placeholder="*******"
              secureTextEntry={eye}
              value={values.password}
              onChangeText={handleChange('password')}
            ></TextInput>
            {
                eye ? (
                    <Feather name="eye" size={22} color="#222" onPress={() => {setEye(!eye);}} style={ loginStyles.eye }/>
                ) : (
                    <Feather name="eye-off" size={22} color="#222" onPress={() => {setEye(!eye);}} style={ loginStyles.eye }/>
                )
            }
            <View style={loginStyles.resetPwd}>
              <Button
                title={getTraduction('FORGOTTEN_PWD')}
                onPress={() => navigation.navigate('ForgottenPassword')}
            />
            </View>
          </View>

          <View style={loginStyles.footer}>
            <TouchableOpacity
              style={loginStyles.buttonLogin}
              onPress={onSubmit}
            >
              <Text style={loginStyles.textButton}>{'→'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ ...loginStyles.subscribe }}>
            <View style={loginStyles.centerText}>
              <Text style={loginStyles.subscribeText}>{getTraduction('NO_ACCOUNT')}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={loginStyles.register}>{getTraduction('SUBSCRIBE')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};
