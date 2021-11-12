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

import { IAuth } from '../../@types/IClient';
import { ClientContext } from '../../contexts/ClientContext';

import { AppModelNavProps } from '../../roots/AppModelNav';

type ILoginProps = AppModelNavProps<'Login'>;

const porfilstyles = StyleSheet.create({
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
  flagFr: {
    position: 'absolute',
    width: 22,
    height: 16,
    right: 16 * 3,
    top: -16 * 8,
  },
  flagUk: {
    position: 'absolute',
    width: 22,
    height: 16,
    right: 16,
    top: -16 * 8,
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
  subscribeText: {
    fontSize: 16,
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
});

export const Login: React.FC<ILoginProps> = ({ navigation }) => {
  const { login, getTraduction, setAppLang } = useContext(ClientContext);

  const [values, setValues] = useState<IAuth>({
    email: 'mathieu.vacance@epitech.eu',
    password: 'Motdepasse1@',
  });

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
      style={porfilstyles.background}
    >
      <SafeAreaView style={porfilstyles.container}>
        <View style={porfilstyles.header}>
          <Text style={porfilstyles.title}>{getTraduction('TITLE')}</Text>
          <Text style={porfilstyles.title}>{getTraduction('TITLE2')}</Text>
          <TouchableOpacity
            onPress={() => {
              setAppLang('fr');
            }}
            activeOpacity={0.6}
          >
            <Image
              source={require('../../assets/fr.png')}
              style={porfilstyles.flagFr}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAppLang('en');
            }}
            activeOpacity={0.6}
          >
            <Image
              source={require('../../assets/uk.png')}
              style={porfilstyles.flagUk}
            />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={porfilstyles.content}>
            <TextInput
              style={porfilstyles.input}
              placeholder="contact@email.com"
              keyboardType="email-address"
              value={values.email}
              onChangeText={handleChange('email')}
            ></TextInput>
            <TextInput
              style={porfilstyles.input}
              placeholder="*******"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
            ></TextInput>
            <View style={porfilstyles.resetPwd}>
            <Button
              title="Mot de passe oublié?"
              onPress={() => navigation.navigate('ForgottenPassword')}
            />
            </View>
          </View>

          <View style={porfilstyles.footer}>
            <TouchableOpacity
              style={porfilstyles.buttonLogin}
              onPress={onSubmit}
            >
              <Text style={porfilstyles.textButton}>{'→'}</Text>
            </TouchableOpacity>
          </View>

          <View style={porfilstyles.footer}>
            <View style={porfilstyles.centerText}>
              <Text style={porfilstyles.subscribeText}>
                {getTraduction('NO_ACCOUNT')}
              </Text>
            </View>
            <Button
              title={getTraduction('SUBSCRIBE')}
              onPress={() => navigation.navigate('Register')}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};
