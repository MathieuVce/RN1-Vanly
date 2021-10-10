import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { ClientContext } from '../contexts/ClientContext';
import Swiper from 'react-native-swiper/src';

interface IRegisterSwiperProps {
  navigation: any;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#99D3A6',
    padding: 30,
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
    flex: 0.7,
    justifyContent : 'center',
    alignItems : 'center',
  },
  input: {
    textAlign: 'center',
    fontSize: 25,
    color : 'white',
    fontWeight: '700',
  },
  footer: {
    justifyContent: 'space-between',
    marginBottom: 20,
    flexDirection: 'row',
    width: '100%',
  },
  button_right: {
    height: 64,
    width: 64,
    backgroundColor: '#FEC156',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    marginRight: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
  
    elevation: 21,
  },
  button_left: {
    height: 64,
    width: 64,
    backgroundColor: '#FEC156',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    marginLeft: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
  
    elevation: 21,
  },
  text_button: {
    fontSize: 20,
    color: 'white',
    fontWeight: '900',
  },
  flex: {
    flex: 1,
    padding: 0,
  },
  // PICKER
  picker_container: {
    flex: 1,
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
  swiper: {},
});

export const RegisterSwiper: React.FC<IRegisterSwiperProps> = ({ navigation }) => {
  const { register } = useContext(ClientContext);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(0);
  const [swiper, setSwiper] = useState<any>();

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const onPressNext = () => {
    Keyboard.dismiss();
    setStep(step + 1);
    swiper.scrollBy(1);
  };

  const disableButton = () => {
    if (step === 0 && name) {
      return false;
    } else if (step === 1 && day && month && year) {
      return false;
    } else if (step === 2 && email && emailRegex.test(String(email).toLowerCase())) {
      return false;
    } else if (
      step === 3 && password ) {
      return false;
    }
    return true;
  };

  const onPressPrevious = () => {
    Keyboard.dismiss();

    setStep(step - 1);
    swiper.scrollBy(-1);
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    await register({
      email: email.toLowerCase(),
      password,
      name,
    });
    navigation.navigate('Login');
  };

  const renderSlide1 = () => {
    return (
      <View style={styles.flex}>
        <View style={styles.header}>
          <Text style={styles.title}>Hey c&apos;est</Text>
          <Text style={styles.title}>quoi ton </Text>
          <Text style={styles.title}>nom ? </Text>
        </View>
        <View style={styles.content}>
          <TextInput
            placeholder="Je m'appelle..."
            onChangeText={setName}
            style={styles.input}
            keyboardType="default"
          />
        </View>
      </View>
    );
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
            maxLength={4}
          />
        </View>
      </View>
    );
  };
  const renderSlide2 = () => {
    return (
      <View style={styles.flex}>
        <View style={styles.header}>
          <Text style={styles.title}>Enchanté {name}, tu es né quand ?</Text>
        </View>
        <View style={styles.content}>{renderDatePicker()}</View>
      </View>
    );
  };

  const renderSlide3 = () => {
    return (
      <View style={styles.flex}>
        <View style={styles.header}>
          <Text style={styles.title}>Comment peut-on te contacter?</Text>
        </View>
        <View style={styles.content}>
          <TextInput
            placeholder="contact@email.com"
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
        </View>
      </View>
    );
  };

  const renderSlide4 = () => {
    return (
      <View style={styles.flex}>
        <View style={styles.header}>
          <Text style={styles.title}>Choisis ton propre mot de passe !</Text>
        </View>
        <View style={styles.content}>
          <TextInput
            placeholder="*******"
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.flex}>
      <Swiper
        ref={(_swiper: any) => setSwiper(_swiper)}
        showsButtons={false}
        scrollEnabled={false}
        loop={false}
        autoplay={false}
        showsPagination={false}
        style={styles.swiper}
      >
        {renderSlide1()}
        {renderSlide2()}
        {renderSlide3()}
        {renderSlide4()}
      </Swiper>

      <View style={styles.footer}>
        {step > 0 ? (
          <TouchableOpacity
            style={styles.button_left}
            onPress={onPressPrevious}
          >
            <Text style={styles.text_button}>{'←'}</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity
          style={styles.button_right}
          onPress={step !== 3 ? onPressNext : onSubmit}
          disabled={disableButton()}
        >
          <Text style={styles.text_button}>{'→'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
