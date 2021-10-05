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
} from 'react-native';

// import { IAuth } from '../../@types/IClient';
import { ClientContext } from '../../contexts/ClientContext';

import { AppModelNavProps } from '../../roots/AppModelNav';

type ILoginProps = AppModelNavProps<'Login'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
    // justifyContent: 'center',
    // alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
  },
  footer: {
    // backgroundColor: 'red',
    justifyContent: 'center',
    // alignItems: 'flex-end',
    marginBottom: 20,
    flexDirection: 'row',
    width: '100%',
  },
  input: {
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
    fontWeight: '700',
    marginBottom: 20,
  },
  picker_container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: 300,
  },
  picker_container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  picker_inputTitle: {
    color: '#76BC85',
    fontWeight: 'bold',
    fontSize: 18,
  },
  picker_input: {
    textAlign: 'center',
    height: 64,
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    width: 100,
  },
  centerText: {
    // backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeText: {
    fontSize: 16,
    // textAlign: 'center',
    // alignItems: 'center',
  },
  subscribeButton: {
    backgroundColor: 'pink',
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

  // const [loading] = useState(false);
  // const [values, setValues] = useState<IAuth>({
  //   email: 'mathieu.vacance@epitech.eu',
  //   password: 'Motdepasse1@',
  // });

  const [email, setEmail] = useState();
  const [day, setDay] = useState(undefined);
  const [month, setMonth] = useState(undefined);
  const [year, setYear] = useState(undefined);

  const onSubmit = async () => {
    Keyboard.dismiss();
    await login({
      email: email.toLowerCase(),
      password: day + month + year,
    });
    setDay(undefined);
    setMonth(undefined);
    setYear(undefined);
  };

  const renderDatePicker = () => {
    return (
      <View style={styles.picker_container}>
        <View style={styles.picker_container2}>
          <Text style={styles.picker_inputTitle}>Jour</Text>
          <TextInput
            style={styles.picker_input}
            placeholder={'31'}
            onChangeText={setDay}
            secureTextEntry={true}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
        <View style={styles.picker_container2}>
          <Text style={styles.picker_inputTitle}>Mois</Text>
          <TextInput
            style={styles.picker_input}
            placeholder={'12'}
            onChangeText={setMonth}
            keyboardType="number-pad"
            secureTextEntry={true}
            maxLength={2}
          />
        </View>
        <View style={styles.picker_container2}>
          <Text style={styles.picker_inputTitle}>Année</Text>
          <TextInput
            style={styles.picker_input}
            placeholder={'1998'}
            onChangeText={setYear}
            keyboardType="number-pad"
            secureTextEntry={true}
            maxLength={4}
          />
        </View>
      </View>
    );
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
              placeholder="mon@email.fr"
              onChangeText={setEmail}
              keyboardType="email-address"
            ></TextInput>
            {renderDatePicker()}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={onSubmit}
              // disabled={disableButton()}
            >
              <Text style={styles.textButton}>{'→'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.centerText}>
              <Text style={styles.subscribeText}>Pas encore de compte? </Text>
            </View>
            <Button
              title="incrivez vous!"
              onPress={() => navigation.navigate('Register')}
              style={styles.subscribeButton}
            />
          </View>
        </KeyboardAvoidingView>
        {/* {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <Button title="Login" onPress={onCLick} />
        )} */}
      </SafeAreaView>
    </ImageBackground>
  );
};
