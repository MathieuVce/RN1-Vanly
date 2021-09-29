import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { ClientContext } from '../contexts/ClientContext';

// interface IDatePickerEProps {
  
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',        
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  inputTitle: {
    color: '#76BC85',
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    textAlign: 'center',
    height: 64,
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    width:70,
  },
});

export const DatePicker: React.FC<IDatePickerProps> = ({  }) => {

  
  const client = useContext(ClientContext);
  const [day, setDay] = useState(undefined);
  const [month, setMonth] = useState(undefined);
  const [year, setYear] = useState(undefined);

  const onChangeText = () => {
    client.setRegisterUser({"day": day, "month": month, "year": year})
  }

  return (
      <View style={ styles.container }>
        <View style={styles.container2}>
          <Text style={styles.inputTitle}>Jour</Text>
          <TextInput style={styles.input} placeholder={"31"} onChangeText={setDay} />
        </View>
        <View style={styles.container2}>
          <Text style={styles.inputTitle}>Mois</Text>
          <TextInput style={styles.input} placeholder={"12"} onChangeText={setMonth} />
        </View>
        <View style={styles.container2}>
          <Text style={styles.inputTitle}>Année</Text>
          <TextInput style={styles.input} placeholder={"1998"} onChangeText={setYear} />
        </View>
      </View>
  );
};
