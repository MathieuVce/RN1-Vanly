import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';

import Swiper from 'react-native-swiper/src';

interface IRegisterSwiperProps {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#99D3A6',
    padding: 30,
  },
  header: {
    marginLeft: 30,
  },
  title: {
    fontSize: 48,
    width: 300,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    textAlign: 'center',
    height: 64,
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    justifyContent: 'space-between',
    // alignItems: 'flex-end',
    marginBottom: 20,
    flexDirection: 'row',
    width: '100%',
  },
  button_right: {
    height: 64,
    width: 64,
    backgroundColor: '#FEC156',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    marginRight: 30,
  },
  button_left: {
    height: 64,
    width: 64,
    backgroundColor: '#FEC156',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
    marginLeft: 30,
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

export const RegisterSwiper: React.FC<IRegisterSwiperProps> = ({}) => {
  // const client = useContext(ClientContext);
  const [day, setDay] = useState(undefined);
  const [month, setMonth] = useState(undefined);
  const [year, setYear] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [email, setEmail] = useState();
  const [step, setStep] = useState(0);
  const [swiper, setSwiper] = useState();

  const onPressNext = () => {
    Keyboard.dismiss();

    if (step === 0 && name) {
      setStep(1);
      swiper.scrollBy(1);
    } else if (step === 1 && day && month && year) {
      setStep(2);
      swiper.scrollBy(1);
    } else if (step === 2 && email) {
    }
  };

  const onPressPrevious = () => {
    Keyboard.dismiss();

    setStep(step - 1);
    swiper.scrollBy(-1);
  };

  const onSubmit = () => {
    Keyboard.dismiss();
    if (
      email ===
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
      alert('wrong email format');
    if (email && name && day && month && year) alert('submit form');
  };

  const renderSlide1 = () => {
    return (
      <View style={styles.flex}>
        <View style={styles.header}>
          <Text style={styles.title}>Hey c&apos;est quoi ton nom?</Text>
        </View>
        <View style={styles.content}>
          <TextInput
            placeholder="Je m'appelle..."
            onChangeText={setName}
            style={styles.input}
            // autoFocus={focus1()}
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
            // autoFocus={focus2()}
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
            // autoFocus={focus3()}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.flex}>
      <Swiper
        ref={_swiper => setSwiper(_swiper)}
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
      </Swiper>

      <View style={styles.footer}>
        {step > 0 ? (
          <TouchableOpacity
            style={styles.button_left}
            onPress={onPressPrevious}
          >
            <Text style={styles.text_button}>{'<'}</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity
          style={styles.button_right}
          onPress={step !== 2 ? onPressNext : onSubmit}
        >
          <Text style={styles.text_button}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
