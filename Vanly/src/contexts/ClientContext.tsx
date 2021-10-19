import React, { createContext, useContext, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import firebase from '../database/firebase';
import { IAuth, IClient, IPhoto, IRegisterClient, IReset } from '../@types/IClient';
import { defaultClientValue, IClientContext, TDeleteImageFC, TDeleteItemFC, TGetImageFC, TGetItemsFC, TGetUserFC, TLoginFC, TLogoutFC, TRegisterFC, TResetPasswordFC, TSetImageFC, TSetItemsFC, TSleepFC, TTakePictureFC, TUpdatePictureFC, TUploadPictureFC } from '../@types/IClientContext';
import { AlertContext } from './AlertContext';


export const ClientContext = createContext<IClientContext>(defaultClientValue);

export const ClientProvider: React.FC = ({ children }) => {

  const [user, setUser] = useState<null | IClient >(null);
  const { Alerts } = useContext(AlertContext);

  const getUser: TGetUserFC = async () => {
    const tmpuser = firebase.auth().currentUser;

    return tmpuser
      ? tmpuser
      : null;
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
            title: 'Successful authentication',
            message: `Welcome back ${finalUser[0]?.displayName} !`,
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
          firebase.firestore().collection('usersCollection')
            .add({
              email: tmpUser.email,
              birthdate: payload.birthdate,
              displayName: payload.name,
              uid: tmpUser.uid,
            });
        }
        Alerts.success({
          title: 'Successful Registration',
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
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alerts.success({
          title: 'See you soon !',
          message: '',
        });
      })
      .catch(error => {
        Alerts.warning({
          title: error.message,
          message: '',
        });
      });
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

    const ref = firebase
      .storage()
      .ref()
      .child(payload.path);

    const blob = await (await fetch(payload.url!)).blob();
    await ref.put(blob);
  };

  const setImage: TSetImageFC = async (payload: IPhoto) => {
    const ref = firebase
      .storage()
      .ref()
      .child(payload.path);

    const blob = await (await fetch(payload.url!)).blob();
    await ref.put(blob);
  };

  const getImage: TGetImageFC = async (payload: IPhoto) => {
    var url = '';

    const img = firebase.storage().ref().child(payload.path).child(payload.url!);
    await img.getDownloadURL().then((uri) => { url = uri; });

    return url;
  };

  const getItems: TGetItemsFC = async () => {
    const items = await firebase.firestore().collection('Sites').get();
    return items;
  };

  const setItems: TSetItemsFC = async () => {
    return firebase.firestore().collection('Sites');
  };

  const deleteItem: TDeleteItemFC = async (payload) => {
    console.log(payload.path);
    await firebase.firestore().collection('Sites').doc(payload.name).delete();
    await firebase.storage().ref().child('images/' + payload.path).delete();
  };

  const deleteImage: TDeleteImageFC = async (path) => {
    await firebase.storage().ref().child('images/' + path).delete();
  };

  const resetpassword: TResetPasswordFC = async (payload: IReset) => {
    await firebase
      .auth()
      .sendPasswordResetEmail(payload.email)
      .then(() => {
        Alerts.success({
          title: 'Email succesfully sent',
          message: 'Open your recent mail to reset your password',
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
      sleep,
      autolog, login, register, logout, resetpassword,
      uploadpicture, takepicture, updatePicture, getImage, setImage,
      getUser, getItems, setItems, deleteItem, deleteImage,
    }}
    >
      {children}
    </ClientContext.Provider>
  );
};
