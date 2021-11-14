import React, { createContext, useContext, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import firebase from '../database/firebase';
import { IAuth, IClient, IPhoto, IProfil, IRegisterClient, IReset } from '../@types/IClient';
import { defaultClientValue, IClientContext, TDeleteImageFC, TDeleteItemFC, TGetAppLangFC, TGetImageFC, TGetItemsFC, TGetTraductionFC, TGetUserFC, TLoginFC, TLogoutFC, TRegisterFC, TResetPasswordFC, TSetAppLangFC, TSetImageFC, TSetItemsFC, TSleepFC, TTakePictureFC, TUpdatePictureFC, TUpdateProfilFC, TUploadPictureFC } from '../@types/IClientContext';
import { AlertContext } from './AlertContext';
import fr from '../traduction/fr.json';
import en from '../traduction/en.json';

export const ClientContext = createContext<IClientContext>(defaultClientValue);

export const ClientProvider: React.FC = ({ children }) => {

  const data = {
    fr,
    en,
  };
  const [user, setUser] = useState<null | IClient >(null);
  const { Alerts } = useContext(AlertContext);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');


  const getUser: TGetUserFC = async () => {
    const tmpuser = firebase.auth().currentUser;

    return tmpuser
      ? tmpuser
      : null;
  };

  const getTraduction: TGetTraductionFC = (keyWord) => {
    return data[lang][keyWord];
  };

  const login: TLoginFC = async (payload: IAuth) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(async () => {

        const tmpUser = await getUser();

        if (tmpUser) {
          const users = await firebase.firestore().collection('usersCollection').get();
          const finalUser = users?.docs.map(doc => doc.data().uid == tmpUser.uid ? doc.data() : null).filter(function (el) {
            return el != null;
          });

          setUser({ 'firstname': finalUser[0]?.displayName, email: finalUser[0]?.email, picture: finalUser[0]?.photoURL ? finalUser[0]?.photoURL : 'nonull', birthdate: finalUser[0]?.birthdate });
          await AsyncStorage.setItem('user', JSON.stringify({ email: payload.email, password: payload.password, firstname: finalUser[0]?.displayName, picture: finalUser[0]?.photoURL ? finalUser[0]?.photoURL : 'nonull', birthdate: finalUser[0]?.birthdate }));
          
          Alerts.success({
            title: getTraduction('ALERT_LOGIN_TITLE'),
            message: getTraduction('ALERT_LOGIN_MESSAGE') + ` ${finalUser[0]?.displayName} !`,
          });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      })
      .catch(error => {
        Alerts.warning({
          title: error.message,
          message: '',
        });
      });
  };

  const autolog = async () => {
    
    const tmpUser = await AsyncStorage.getItem('user');

    if (tmpUser !== null) {
      await login({ email: JSON.parse(tmpUser!).email, password: JSON.parse(tmpUser!).password });
    }
  };

  const register: TRegisterFC = async (payload: IRegisterClient) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(async () => {
        const tmpUser = await getUser();

        if (tmpUser) {
          firebase.firestore().collection('usersCollection').doc(tmpUser.uid)
            .set({
              email: tmpUser.email,
              birthdate: payload.birthdate,
              displayName: payload.name,
              uid: tmpUser.uid,
            });
        }
        Alerts.success({
          title: getTraduction('ALERT_REGISTER_TITLE'),
          message: '',
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      })
      .catch(error => {
        console.log(error);
        Alerts.warning({
          title: error.message,
          message: '',
        });
      });
  };

  const logout: TLogoutFC = async () => {
    await firebase
      .auth()
      .signOut()
      .then(async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
        Alerts.success({
          title: getTraduction('ALERT_LOGOUT_TITLE'),
          message: '',
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      })
      .catch(error => {
        Alerts.warning({
          title: error.message,
          message: '',
        });
      });
  };
  const updateProfil: TUpdateProfilFC = async (payload: IProfil) => {
    const tmpUser = await getUser();
    let values: IProfil = {};

    if (tmpUser) {
      try {

        await tmpUser.updateEmail(payload.email);
        (await firebase.firestore().collection('Sites').get()).docs.map(async doc => {
          if (doc.data().creator == user?.firstname) {
            await firebase.firestore().collection('Sites').doc(doc.data().previousName).set({
              ...doc.data(), creator: payload.displayName,
            });
          }
        });
        (await firebase.firestore().collection('usersCollection').get()).docs.map(doc => {
          if (doc.data().uid == tmpUser.uid) {
            values = doc.data();
          }
        });
        await firebase.firestore().collection('usersCollection').doc(tmpUser.uid).set({
          ...values, email: payload.email, displayName: payload.displayName, birthdate: payload.birthdate,
        });
        setUser({ ...user, email: payload.email!, 'firstname': payload.displayName, birthdate: payload.birthdate });
        const userStorage = await AsyncStorage.getItem('user');
        await AsyncStorage.setItem('user', JSON.stringify({ ...JSON.parse(userStorage!), email: payload.email!, firstname: payload.displayName, birthdate: payload.birthdate }));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return null;
      } catch (error) {
        return error;
      }
    }
  };

  const takepicture: TTakePictureFC = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [5, 5],
      quality: 1,
    });
  
    return result;

  };
  const uploadpicture: TUploadPictureFC = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [5, 5],
      quality: 1,
    });

    return result;
  };

  const updatePicture: TUpdatePictureFC = async (payload: IPhoto) => {
    var tmpUser = firebase.auth().currentUser;
    tmpUser?.updateProfile({  photoURL: payload.path.split('/')[1] });

    const blob = await (await fetch(payload.url!)).blob();
    const ref = firebase
      .storage()
      .ref()
      .child(payload.path);
    await ref.put(blob);
  };

  const setImage: TSetImageFC = async (payload: IPhoto) => {
  
    const blob = await (await fetch(payload.url!)).blob();
    const ref = firebase
      .storage()
      .ref()
      .child(payload.path);

    await ref.put(blob);
  };

  const getImage: TGetImageFC = async (payload: IPhoto) => {
    try {
      var url = '';
  
      const img = firebase.storage().ref().child(payload.path).child(payload.url!);
      await img.getDownloadURL().then((uri) => { url = uri; });
  
      return url;
    } catch (error) {
      return 'https://static.thenounproject.com/png/1496955-200.png';
    }
  };

  const getItems: TGetItemsFC = async () => {
    const items = await firebase.firestore().collection('Sites').get();
    return items;
  };

  const setItems: TSetItemsFC = async () => {
    return firebase.firestore().collection('Sites');
  };

  const deleteItem: TDeleteItemFC = async (payload) => {
    await firebase.firestore().collection('Sites').doc(payload.name).delete();
    await firebase.storage().ref().child('images/' + payload.path).delete();
  };

  const deleteImage: TDeleteImageFC = async (path) => {
    await firebase.storage().ref().child('images/' + path).delete();
  };

  const setAppLang: TSetAppLangFC = async (language) => {
    setLang(language);
  };

  const getAppLang: TGetAppLangFC = async () => {
    return (lang);
  };

  const resetpassword: TResetPasswordFC = async (payload: IReset) => {
    await firebase
      .auth()
      .sendPasswordResetEmail(payload.email)
      .then(() => {
        Alerts.success({
          title: getTraduction('ALERT_PASSWORD_TITLE'),
          message: getTraduction('ALERT_PASSWORD_MESSAGE'),
        });
      })
      .catch(error => {
        Alerts.warning({
          title: error.message,
          message: '',
        });
      });
  };

  const sleep: TSleepFC = async (ms: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  return (
    <ClientContext.Provider value={{
      client: user,
      sleep, getTraduction, setAppLang, getAppLang,
      autolog, login, register, logout, resetpassword, updateProfil,
      uploadpicture, takepicture, updatePicture, getImage, setImage,
      getUser, getItems, setItems, deleteItem, deleteImage,
    }}
    >
      {children}
    </ClientContext.Provider>
  );
};
