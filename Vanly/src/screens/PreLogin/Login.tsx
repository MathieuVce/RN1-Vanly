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
} from 'react-native';

import { IAuth } from '../../@types/IClient';
import { ClientContext } from '../../contexts/ClientContext';

import { AppModelNavProps } from '../../roots/AppModelNav';

type ILoginProps = AppModelNavProps<'Login'>;

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
  title: {
    fontSize: 45,
    width: 300,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16 * 4,
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
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
    fontWeight: '700',
    marginVertical: 16 * 1.5,
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
});

export const Login: React.FC<ILoginProps> = ({ navigation }) => {
  const { login } = useContext(ClientContext);

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
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Heureux, de</Text>
          <Text style={styles.title}>vous revoir! </Text>
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
              value={values.email}
              onChangeText={handleChange('email')}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="*******"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
            ></TextInput>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={onSubmit}
            >
              <Text style={styles.textButton}>{'→'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.centerText}>
              <Text style={styles.subscribeText}>Pas encore de compte? </Text>
            </View>
            <Button
              title="Incrivez vous!"
              onPress={() => navigation.navigate('Register')}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};
