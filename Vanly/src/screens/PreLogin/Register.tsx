import React, { useContext } from 'react';
import {
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
} from 'react-native';
import { AppModelNavProps } from '../../roots/AppModelNav';
import { RegisterSwiper } from '../../components/RegisterSwiper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ClientContext } from '../../contexts/ClientContext';

type IRegisterProps = AppModelNavProps<'Register'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#99D3A6',
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
});

export const Register: React.FC<IRegisterProps> = ({ navigation }) => {
  const { getTraduction } = useContext(ClientContext);

  return (
    <ImageBackground
      source={require('../../assets/Login.png')}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableOpacity style={styles.login} onPress={() => {navigation.navigate('Login');}} activeOpacity={0.6}>
            <Text style={styles.loginText}>{getTraduction('LOGIN')}</Text>
          </TouchableOpacity>
          <RegisterSwiper navigation={navigation}/>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};
