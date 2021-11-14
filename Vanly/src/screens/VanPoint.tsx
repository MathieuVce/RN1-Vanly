import React, { useContext, useState } from 'react';
import { Dimensions, ActionSheetIOS, StyleSheet, TextInput, TouchableOpacity, View, Text, Image, Platform, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

import { ClientContext } from '../contexts/ClientContext';
import { AlertContext } from '../contexts/AlertContext';

interface IVanPointProps {
  setIndex: React.Dispatch<React.SetStateAction<number>>
  setValues: React.Dispatch<React.SetStateAction<any>>
  setOpenNewPoint: React.Dispatch<React.SetStateAction<boolean>>
  setModifying: React.Dispatch<React.SetStateAction<boolean>>
  setTmpSites: React.Dispatch<React.SetStateAction<any>>
  values: any
  modify: boolean
  item: any
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

export const VanPoint: React.FC<IVanPointProps> = ({ setIndex, setValues, values, modify, setOpenNewPoint, item, setTmpSites, setModifying }) => {

  const { uploadpicture, takepicture, setItems, client, setImage, getItems, deleteImage, getTraduction } = useContext(ClientContext);
  const { Alerts } = useContext(AlertContext);

  const [loading, setLoading] = useState(true);

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

  const handleUpdate = async () => {

    setIndex(2);

    try {
      const items = await setItems();

      await items.doc(item.previousName).set({
        creator: client?.firstname,
        description: values.description,
        image: values.uri.includes(item.image) ? item.image : values.uri.split('/')[values.uri.split('/').length - 1],
        likes: item.likes,
        name: values.name,
        type: item.type,
        coords: item.coords,
        previousName: item.previousName,
      });

      if (values.uri.includes(item.image) == false) {
        await deleteImage(item.image);
        await setImage({ path: 'images/' + values.uri.split('/')[values.uri.split('/').length - 1], url: values.uri });
      }
    } catch (error) {
      Alerts.warning({
        title: getTraduction('ALERT_ERROR_IMG'),
        message: '',
      });
    }
    
    setIndex(3);

    setTmpSites((await getItems()).docs.map((doc: { data: () => any; }) => doc.data()));
    var start = new Date().getTime();
    var end = new Date().getTime();
    var time = end - start;
    
    while (time <= 1000) {
     
      end = new Date().getTime();
      time = end - start;
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setOpenNewPoint(false);
    setIndex(0);
    setValues({ name: undefined, description: undefined, uri: undefined });
    setModifying(false);
  };

  const handleUpload = (isUploading: boolean) => {
    (async () => {
      const res = await Promise.all([await getPermissionAsync(isUploading), isUploading ? uploadpicture() : takepicture()]);
      
      if (!res[1].cancelled) {
        setValues({ ...values, uri: res[1].uri });
      }

    })().catch((error) => {
      console.log(error);
    }); 
  };

  const addPicture = () => {
    if (Platform.OS == 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Camera Roll', 'Camera', getTraduction('CANCEL')],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 2,
        },
        buttonIndex => { 
          if (buttonIndex === 2) {return; }
          handleUpload(buttonIndex === 0); 
        },
      );
    } else if (Platform.OS == 'android') {
      Alert.alert(
        getTraduction('SELECT_PICTURE'),
        '',
        [
          { text: 'Camera Roll', onPress: async () => {
            handleUpload(true);
          },
          },
          { text: 'Camera', onPress: async () => {
            handleUpload(false);
          },
          },
          {
            text: getTraduction('CANCEL'),
            onPress: () => {
            },
            style: 'cancel',
          },
        ],
      );
    }
  };

  return (
    <View style={newPointStyles.container}>
      {modify ?
        <Text style={newPointStyles.headerText}>{getTraduction('MODIFY_HEADER')}</Text>
        :
        <Text style={newPointStyles.headerText}>{getTraduction('CREATE_HEADER')}</Text>
      }
      <View style={newPointStyles.middleContainer}>
        <View style={newPointStyles.input}>
            <TextInput style={newPointStyles.inputName} value={values.name} maxLength={30} onChangeText={(value: string) => {setValues({ ...values, name: value }); }} placeholder={getTraduction('INPUT_NAME')} placeholderTextColor='grey' />
            <TextInput style={newPointStyles.inputDescription} value={values.description} onChangeText={(value: string) => {setValues({ ...values, description: value }); }} placeholder={getTraduction('INPUT_DESCRIPTION')} placeholderTextColor='grey' />
        </View>
        <TouchableOpacity style={newPointStyles.imageContainer} onPress={addPicture}>
          {!values.uri ? (
            <Text style={newPointStyles.addPictureText}>
              {getTraduction('ADD_A_PICTURE')}
            </Text>
          ) : (
              <Image style={newPointStyles.image} source={{ uri: values.uri }} onLoadStart={() => {setLoading(true); }} onLoadEnd={() => {setLoading(false); }}/>
          )}
          {loading && values.uri && (
            <ActivityIndicator style={{ position: 'absolute' }} size='large' color='#0B5F1E'></ActivityIndicator>
          )}
        </TouchableOpacity>
      </View>
      <View style={newPointStyles.bottomContainer}>
        <TouchableOpacity
            style={newPointStyles.button_right}
            onPress={modify ? () => {handleUpdate(); } : () => {setIndex(1); }}
            disabled={disable()}
            activeOpacity={0.6}
          >
            <Text style={newPointStyles.text_button}>{'→'}</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};