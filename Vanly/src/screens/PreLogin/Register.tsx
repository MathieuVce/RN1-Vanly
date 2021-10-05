import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { AppModelNavProps } from '../../roots/AppModelNav';
import { RegisterSwiper } from '../../components/RegisterSwiper';

type IRegisterProps = AppModelNavProps<'Register'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#99D3A6',
  },
});

export const Register: React.FC<IRegisterProps> = ({ navigation }) => {
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
          <RegisterSwiper navigation={navigation} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};
