import React, { useContext, useEffect, useState } from 'react';
import { ActionSheetIOS, StyleSheet, TouchableOpacity, View, Image, Text, ActivityIndicator, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

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
  closeView: {
    top: 16 * 3,
    left: 16 * 2,
    alignSelf: 'flex-start',
  },
  close: {
    fontSize: 16,
    color: '#525566',
  },
  loading: {
    marginTop: 16 * 9,
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
    paddingVertical: 8,
  },
  dateText: {
    color: '#525566',
    fontSize: 20,
    paddingVertical: 8,
    fontWeight: '400',
  },
  emailText: {
    color: '#525566',
    fontSize: 20,
    fontWeight: '400',
    paddingVertical: 8,
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

  const { uploadpicture, takepicture, client, logout, updatePicture, getImage, getUser } = useContext(ClientContext);

  const [uri, setUri] = useState('nonull');
  const [loading, setLoading] = useState(false);

  const getPermissionAsync = async (roll: boolean) => {

    const { status } = roll
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();

    return status;
  };

  const getPicture = async () => {
    const tmpUser = await getUser();
    if (tmpUser.photoURL !== 'nonull')
      setUri(await getImage({ path: 'profil', url: tmpUser.photoURL }));
  };

  const handleUpload = (isUploading: boolean) => {
    (async () => {
      const res = await Promise.all([getPermissionAsync(isUploading), isUploading ? uploadpicture() : takepicture()]);
      
      if (!res[1].cancelled) {
        setUri(res[1].uri);
        updatePicture({ path: 'profil/' + res[1].uri.split('/')[res[1].uri.split('/').length - 1], url: res[1].uri });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    })().catch((error) => {
      console.log(error);
    }); 
  };

  const addPicture = () => {
    if (Platform.OS == 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Camera Roll', 'Camera', 'Cancel'],
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
        'Que souhaitez-vous faire ?',
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
            text: 'RETOUR',
            onPress: () => {
            },
            style: 'cancel',
          },
        ],
      );
    }
  };

  useEffect(() => {
    getPicture();
  }, []);

  return (    
    <View style={profilStyles.profilContainer}>
      <View style={profilStyles.backGroundIllus}></View>
      <TouchableOpacity style={profilStyles.closeView} onPress={() => {setOpenProfil(false);}} activeOpacity={0.8}>
      <Text style={profilStyles.close}>Fermer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={profilStyles.profilPicture} onPress={addPicture} activeOpacity={0.6}>
        { loading &&
          <ActivityIndicator style={profilStyles.loading} size={'large'} color='#525566'></ActivityIndicator>
        }
        {uri == 'nonull' ? (
          <MaterialIcons name="add-a-photo" size={24} color="darkgrey" />
        ) : (
          <Image style={profilStyles.picture} source={{ uri }} onLoadStart={() => {setLoading(true); }} onLoadEnd={() => {setLoading(false); }}/>
        )}
      </TouchableOpacity>
      <View style={profilStyles.nameContainer}>
        <Text style={profilStyles.nameText}>{client?.firstname}</Text>
        <Text style={profilStyles.dateText}>{client?.birthdate?.day}/{client?.birthdate?.month}/{client?.birthdate?.year}</Text>
        <Text style={profilStyles.emailText}>{client?.email}</Text>
      </View>
      <TouchableOpacity  style={profilStyles.logout} onPress={() => {logout();}} activeOpacity={0.6}>
        <MaterialIcons name="logout" size={24} color="#525566"/>
      </TouchableOpacity>
    </View>
  );
};