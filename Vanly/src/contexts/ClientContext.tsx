import React, { createContext, useContext, useState } from 'react';

import firebase from '../database/firebase';
import { IAuth, IClient, IReset } from '../@types/IClient';
import { defaultClientValue, IClientContext, TGetUserFC, TLoginFC, TLogoutFC, TRegisterFC, TResetPasswordFC, TTakePictureFC, TUploadPictureFC } from '../@types/IClientContext';
import { AlertContext } from './AlertContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

  const login: TLoginFC = async payload => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(async () => {
        const tmpuser = await getUser();
        if (tmpuser) {
          setUser({ 'firstname': tmpuser.displayName, email: tmpuser.email, picture: tmpuser.photoURL });
          await AsyncStorage.setItem('user', JSON.stringify({ email: payload.email, password: payload.password, firstname: tmpuser.displayName, picture: tmpuser.photoURL }));
          Alerts.success({
            title: 'Successful authentication',
            message: `Welcome back ${tmpuser?.displayName} !`,
          });
        } else {
          Alerts.success({
            title: 'Successful authentication',
            message: 'Welcome back !',
          });
        }
      })
      .catch(error => {
        Alerts.warning({
          title: error.message,
          message: '',
          duration: 8000,
        });
      });
  };

  const autolog = async () => {
    
    const tmpUser = await AsyncStorage.getItem('user');

    if (tmpUser !== null) {
      await login({ email: JSON.parse(tmpUser!).email, password: JSON.parse(tmpUser!).password });
    }
  };

  const register: TRegisterFC = async (payload: IAuth) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(async () => {
        const tmpuser = await getUser();
        if (tmpuser) {
          setUser({ firstname: tmpuser.displayName, email: tmpuser.email });
          Alerts.success({
            title: 'Successful Registration',
            message: 'Welcome back !',
          });
        }
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

    if (result.cancelled) {
      
    }
    return result;

  };
  const uploadpicture: TUploadPictureFC = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [5, 5],
      quality: 1,
    });

    if (result.cancelled) {

    }
    return result;

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

  return (
    <ClientContext.Provider value={{
      client: user,
      
      autolog, login, register, logout, resetpassword,
      uploadpicture, takepicture,
      getUser,
    }}
    >
      {children}
    </ClientContext.Provider>
  );
};
