import React, { useContext, useEffect, useState } from 'react';
import { ActionSheetIOS, StyleSheet, TouchableOpacity, View, Image, Text, ActivityIndicator, Platform, Alert, Dimensions, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';

import { ClientContext } from '../contexts/ClientContext';
import { IProfil, IDate } from '../@types/IClient';

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
  viewFlag: {
    position: 'absolute',
    alignSelf: 'flex-end',
    backgroundColor: '#99D3A6',
    borderColor: '#FEC156',
    borderWidth: 1,
    borderRadius: 10,
    width: 16 * 4,
    height: 16 * 4,
    left: 16 * 7,
    top: 16 * 1.2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
  },
  flagFr: {
    position: 'absolute',
    width: 22,
    height: 16,
    right: -16 * 9.7,
    top: 16 * 1.8,
  },
  flagUk: {
    position: 'absolute',
    width: 22,
    height: 16,
    right: -16 * 9.7,
    top: 16 * 3.5,
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
    alignItems: 'flex-start',
    borderWidth: 2,
    borderBottomWidth: 0,
    paddingVertical: 16 * 2,
    paddingHorizontal: 16 * 2,
    borderColor : '#99D3A6',
    borderRadius: 20,
    width: '80%',
  },
  update: {
    flex: 1,
    justifyContent: 'center',
    left: Dimensions.get('window').width / 4,
  },
  iconView: {
    position: 'absolute',
    right: 16,
    top: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 21,
  },
  buttonView: {
    width: '100%',
    flexDirection: 'row',
    marginTop: - 16,
  },
  saveView: {
    right: -16 * 4.5,
    backgroundColor: '#99D3A6',
    width: 16 * 6,
    height: 16 * 1.8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.58,
    shadowRadius: 10.00,

    elevation: 21,
  },
  cancelView: {
    left: -16,
    backgroundColor: '#99D3A6',
    width: 16 * 6,
    height: 16 * 1.8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.58,
    shadowRadius: 10.00,

    elevation: 21,
  },
  icon: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.20,
    shadowRadius: 4.00,

    elevation: 21,
    color: '#525566',
  },
  nameText: {
    color: '#525566',
    fontSize: 28,
    fontWeight: 'bold',
    paddingVertical: Dimensions.get('window').height / 20,
    width: '100%',
  },
  birthdate: {
    flexDirection: 'row',
    paddingVertical: Dimensions.get('window').height / 20,
  },
  birthdateInput: {
    fontSize: 20,
    color: '#525566',
  },
  dateText: {
    color: '#525566',
    fontSize: 20,
    paddingVertical: Dimensions.get('window').height / 25,
    fontWeight: '400',
  },
  emailText: {
    color: '#525566',
    fontSize: 20,
    fontWeight: '400',
    paddingVertical: Dimensions.get('window').height / 25,
    width: '100%',
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

  const { uploadpicture, takepicture, client, logout, updatePicture, getImage, getUser, getTraduction, setAppLang, getAppLang, updateProfil } = useContext(ClientContext);

  const [uri, setUri] = useState('nonull');
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [showFlags, setFlags] = useState(false);
  const [isFrench, setLang] = useState(true);
  const [modify, setModify] = useState(false);
  const [values, setValues] = useState<IProfil>({
    displayName: client?.firstname,
    birthdate: client?.birthdate,
    email: client?.email,
  });
  const [birthdate, setBirthdate] = useState<IDate>({
    day: client?.birthdate?.day,
    month: client?.birthdate?.month,
    year: client?.birthdate?.year,
  });
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const birthdateRegex = 
    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

  const getPermissionAsync = async (roll: boolean) => {

    const { status } = roll
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();

    return status;
  };
  const getFlag = async () => {
    setLang(await getAppLang() == 'fr');
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

  const handleCancel = async () => {
    setValues({
      displayName: client?.firstname,
      birthdate: client?.birthdate,
      email: client?.email,
    });
    setModify(false);
  };
  const disableButton = () => {
    return (values.displayName == '');
  };

  const handleUpdate = async () => {
    const finlaDate = birthdate.day + '/' + birthdate.month + '/' + birthdate.year;
    const finlaBirthDate = birthdate.year + '-' + birthdate.month + '-' + birthdate.day;

    if (!emailRegex.test(String(values.email).toLowerCase())) {
      Alert.alert(
        getTraduction('ALERT_BIRTHDATE_FORMAT'),
        '',
        [
          {
            text: 'OK',
            onPress: () => {
            },
            style: 'default',
          },
        ],
      );
      return;
    } 
    if (new Date(finlaBirthDate).getTime() > new Date().getTime()) {
      Alert.alert(
        getTraduction('ALERT_BIRTHDATE_VALUES'),
        '',
        [
          {
            text: 'OK',
            onPress: () => {
            },
            style: 'default',
          },
        ],
      );
      return;
    }
    if (!birthdateRegex.test(String(finlaDate))) {
      Alert.alert(
        getTraduction('ALERT_EMAIL'),
        '',
        [
          {
            text: 'OK',
            onPress: () => {
            },
            style: 'default',
          },
        ],
      );
      return;
    }
    setUpdate(true);
    await updateProfil({ ...values, birthdate });
    setModify(false);
    setUpdate(false);
  };

  const handleChange = (prop: keyof typeof values) => (value: any) => {
    setValues({
      ...values,
      [prop]: value,
    });
  };

  const handleChangeDate = (prop: keyof typeof birthdate) => (value: any) => {
    setBirthdate({
      ...birthdate,
      [prop]: value,
    });
  };

  useEffect(() => {
    getPicture();
    getFlag();
  }, []);

  return (    
    <View style={profilStyles.profilContainer}>
      <View style={profilStyles.backGroundIllus}></View>
      <TouchableOpacity style={profilStyles.closeView} onPress={() => {setOpenProfil(false); }} activeOpacity={0.8}>
        <Text style={profilStyles.close}>{getTraduction('PROFIL_CLOSE')}</Text>
      </TouchableOpacity>
      {!showFlags && (
        <TouchableOpacity onPress={() => {setFlags(true); }} activeOpacity={0.6}>
          <Image
            source={isFrench ? require('../assets/fr.png') : require('../assets/uk.png')}
            style={profilStyles.flagFr}
          />
        </TouchableOpacity>
      )}
      {showFlags && (
        <View>
          <View style={profilStyles.viewFlag}>
          </View>
          <TouchableOpacity onPress={() => {setAppLang(isFrench ? 'fr' : 'en'); setFlags(false); setLang(isFrench);}} activeOpacity={0.6}>
            <Image
              source={isFrench ? require('../assets/fr.png') : require('../assets/uk.png')}
              style={profilStyles.flagFr}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setAppLang(isFrench ? 'en' : 'fr'); setFlags(false); setLang(!isFrench);}} activeOpacity={0.6}>
            <Image
              source={isFrench ? require('../assets/uk.png') : require('../assets/fr.png')}
              style={profilStyles.flagUk}
            />
          </TouchableOpacity>
        </View>
      )}
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
          {!modify ?
            <TouchableOpacity style={profilStyles.iconView} onPress={() => {setModify(true);}} activeOpacity={0.6}>
              <Feather style={profilStyles.icon} name="edit" size={26} color="#525566"/>
            </TouchableOpacity>
            :
            <View style={profilStyles.buttonView}>
              <TouchableOpacity style={profilStyles.cancelView} onPress={handleCancel} activeOpacity={0.6}>
                <Text>{getTraduction('CANCEL')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={profilStyles.saveView} onPress={handleUpdate} activeOpacity={0.6} disabled={disableButton()}>
                <Text>{getTraduction('SAVE')}</Text>
              </TouchableOpacity>
            </View>
          }
          {update ?
            <View style={profilStyles.update}>
              <ActivityIndicator size={'large'} color='#99D3A6'></ActivityIndicator>
            </View>
            :
            <View>
              <TextInput
                style={profilStyles.nameText}
                placeholder="Nom"
                value={values.displayName}
                onChangeText={handleChange('displayName')}
                editable={modify}
              ></TextInput>
              <View style={profilStyles.birthdate}>
                <TextInput
                style={profilStyles.birthdateInput}
                placeholder={values.birthdate?.day}
                value={birthdate.day}
                onChangeText={handleChangeDate('day')}
                editable={modify}
                maxLength={2}
                keyboardType='number-pad'
                >
                </TextInput>
                <Text style={profilStyles.birthdateInput}>/</Text>
                <TextInput
                style={profilStyles.birthdateInput}
                placeholder={values.birthdate?.month}
                value={birthdate.month}
                onChangeText={handleChangeDate('month')}
                editable={modify}
                maxLength={2}
                keyboardType='number-pad'
                >
                </TextInput>
                <Text style={profilStyles.birthdateInput}>/</Text>
                <TextInput
                style={profilStyles.birthdateInput}
                placeholder={values.birthdate?.year}
                value={birthdate.year}
                onChangeText={handleChangeDate('year')}
                editable={modify}
                maxLength={4}
                keyboardType='number-pad'
                >
                </TextInput>
              </View>
              <TextInput
                style={{ ...profilStyles.emailText, paddingTop: 16 * 2 }}
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                multiline
                editable={modify}
                keyboardType='email-address'
              ></TextInput>
            </View>
          }
          </View>
      <TouchableOpacity  style={profilStyles.logout} onPress={() => {logout();}} activeOpacity={0.6}>
        <MaterialIcons name="logout" size={24} color="#525566"/>
      </TouchableOpacity>
    </View>
  );
};