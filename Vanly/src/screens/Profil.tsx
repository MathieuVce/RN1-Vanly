import React, { useContext, useState } from 'react';
import { ActionSheetIOS, StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import firebase from '../database/firebase';
import { ClientContext } from '../contexts/ClientContext';

interface IProfilProps {
  setOpenProfil: React.Dispatch<React.SetStateAction<boolean>> 
}

const profilStyles = StyleSheet.create({
  profilContainer: {
    height : 800,
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center',
  },
  backGroundIllus: {
    top : -615,
    height : '100%',
    width : '160%',
    backgroundColor : '#99D3A6',
    borderRadius : 280,
    position: 'absolute',
  },
  profilPicture : {
    height : 150,
    width : 150,
    backgroundColor : '#F2F2F2',
    position : 'absolute',
    top : 120,
    borderRadius : 55,
    borderWidth : 5,
    borderColor : '#99D3A6',
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 21,
  },
  picture: {
    width: '102%',
    height: '102%',
    borderRadius: 55,
  },
  nameContainer: {
    flex: 1,
    marginTop: 16 * 18,
    alignItems: 'center',
  },
  nameText: {
    color: '#525566',
    fontSize: 28,
    fontWeight: 'bold',
    paddingVertical: 16,
  },
  dateText: {

  },
  emailText: {
    color: '#525566',
    fontSize: 20,
    fontWeight: '400',
  },
  logout: {
    backgroundColor: '#99D3A6',
    height : 60,
    width : 60,
    borderRadius : 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
    justifyContent : 'center',
    alignItems : 'center',
    marginTop: -16 * 4,
  },
});

export const Profil: React.FC<IProfilProps> = ({ setOpenProfil }) => {

  const { uploadpicture, takepicture, client, logout } = useContext(ClientContext);

  const [uri, setUri] = useState(client?.picture);

  const getPermissionAsync = async (roll: boolean) => {

    const { status } = roll
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();

    return status;
  };

  const handleUpload = (isUploading: boolean) => {
    (async () => {
      const res = await Promise.all([getPermissionAsync(isUploading), isUploading ? uploadpicture() : takepicture()]);
      setUri(res[1].uri);
      var user = firebase.auth().currentUser;
      user?.updateProfile({  photoURL: res[1].uri });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
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
    <TouchableOpacity style={profilStyles.profilContainer} onPress={() => {setOpenProfil(false);}} activeOpacity={0.8}>
      <View style={profilStyles.backGroundIllus}></View>
      <TouchableOpacity style={profilStyles.profilPicture} onPress={addPicture}>
          {!uri ? (
            <MaterialIcons name="add-a-photo" size={24} color="darkgrey" />
          ) : (
            <Image  style={profilStyles.picture} source={{ uri }}/>
          )
        }
      </TouchableOpacity>
      <View style={profilStyles.nameContainer}>
        <Text style={profilStyles.nameText}>{client?.firstname}</Text>
        <Text style={profilStyles.emailText}>{client?.email}</Text>
      </View>
      <TouchableOpacity  style={profilStyles.logout} onPress={() => {Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); logout();}} activeOpacity={0.6}>
        <MaterialIcons name="logout" size={24} color="#525566"/>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};