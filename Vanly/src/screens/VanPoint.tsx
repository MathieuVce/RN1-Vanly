import React, { useContext, useState } from 'react';
import { Dimensions, ActionSheetIOS, StyleSheet, TextInput, TouchableOpacity, View, Text, Image } from 'react-native';
import { ClientContext } from '../contexts/ClientContext';
import * as ImagePicker from 'expo-image-picker';

interface IVanPointProps {
  setIndex: React.Dispatch<React.SetStateAction<number>>
  setValues: React.Dispatch<React.SetStateAction<any>>
  values: any
}

const newPointStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16 * 2,
    height: Dimensions.get('window').height,
  },
  headerText: {
    alignSelf: 'flex-start',
    fontSize: 30,
    color: '#0B5F1E',
    fontWeight: 'bold',
  },
  middleContainer: {
    width: '100%',
    height: '64%',
  },
  bottomContainer: {
    width: '100%',
    height: '20%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  text_button: {
    fontSize: 20,
    color: '#99D3A6',
    fontWeight: '900',
  },
  button_right: {
    height: 64,
    width: 64,
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
  
    elevation: 21,
  },
  input: {
    marginTop: 16 * 2,
    justifyContent: 'center',
  },
  inputDescription: {
    fontSize: 22,
    marginVertical: 16,
    paddingVertical: 16,
  },
  inputName: {
    fontSize: 22,
    marginVertical: 16,
    paddingVertical: 16,
  },
  imageContainer: {
    marginTop: 16 * 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    height: 16 * 20,
    borderRadius: 20,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPictureText: {
    fontSize: 22,
    color: 'grey',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});

export const VanPoint: React.FC<IVanPointProps> = ({ setIndex, setValues, values }) => {

  const { uploadpicture, takepicture } = useContext(ClientContext);

  const [uri, setUri] = useState('');

  const disable = () => {
    if (values.name && values.description && values.uri)
      return false;
    return true;
  };

  const getPermissionAsync = async (roll: boolean) => {

    const { status } = roll
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();

    return status;
  };
  const handleUpload = (isUploading: boolean) => {
    (async () => {
      const res = await Promise.all([getPermissionAsync(isUploading), isUploading ? uploadpicture() : takepicture()]);
      
      console.log(res[1].uri);

      const blob = await (await fetch(res[1].uri)).blob();
      setUri(res[1].uri);
      setValues({ ...values, uri: blob });
    })().catch((error) => {
      console.log(error);
    }); 
  };
  const addPicture = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Camera Roll', 'Camera'],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 0,
      },
      buttonIndex => { 
        if (buttonIndex === 0) {return; }
        handleUpload(buttonIndex === 1); 
      },
    );
  };


  return (
    <View style={newPointStyles.container}>
      <Text style={newPointStyles.headerText}>Create a VanPoint</Text>
      <View style={newPointStyles.middleContainer}>
        <View style={newPointStyles.input}>
            <TextInput style={newPointStyles.inputName} value={values.name} onChangeText={(value: string) => {setValues({ ...values, name: value }); }} placeholder='Name' placeholderTextColor='grey' />
            <TextInput style={newPointStyles.inputDescription} value={values.description} onChangeText={(value: string) => {setValues({ ...values, description: value }); }} placeholder='Description...' placeholderTextColor='grey' />
        </View>
        <TouchableOpacity style={newPointStyles.imageContainer} onPress={addPicture}>
          {!uri ? (
            <Text style={newPointStyles.addPictureText}>
            Add a picture...
            </Text>
          ) : (
            <Image style={newPointStyles.image} source={{ uri }}/>
          )
          }
         
        </TouchableOpacity>
      </View>
      <View style={newPointStyles.bottomContainer}>
        <TouchableOpacity
            style={newPointStyles.button_right}
            onPress={() => {setIndex(1); }}
            disabled={disable()}
            activeOpacity={0.6}
          >
            <Text style={newPointStyles.text_button}>{'→'}</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};