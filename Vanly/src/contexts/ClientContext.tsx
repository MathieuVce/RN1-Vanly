import React from 'react';
import { createContext, useContext, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import { IAuth, IClient, IPhoto, IProfil, IRegisterClient, IReset } from '../@types/IClient';
import { defaultClientValue, IClientContext, TDeleteImageFC, TDeleteItemFC, TGetAppLangFC, TGetImageFC, TGetItemsFC, TGetTraductionFC, TGetUserFC, TLoginFC, TLogoutFC, TRegisterFC, TResetPasswordFC, TSetAppLangFC, TSetImageFC, TSetItemsFC, TTakePictureFC, TUpdateItemFC, TUpdatePictureFC, TUpdateUserProfilFC, TUploadPictureFC } from '../@types/IClientContext';
import { AlertContext } from './AlertContext';
import fr from '../traduction/fr';
import en from '../traduction/en';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, updateEmail } from 'firebase/auth';
import { collection, addDoc, getDocs, setDoc, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore"; 
import { db } from '../database/firebase';
import { getStorage, ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";

export const ClientContext = createContext<IClientContext>(defaultClientValue);

export const ClientProvider: React.FC = ({ children }) => {

  const auth = getAuth()
  const storage = getStorage();
  const data = {
    fr,
    en,
  };
  const [user, setUser] = useState<null | IClient >(null);
  const { Alerts } = useContext(AlertContext);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');


  const getUser: TGetUserFC = async () => {
    const tmpuser =  getAuth().currentUser;

    return tmpuser
      ? tmpuser
      : null;
  };

  const getTraduction: TGetTraductionFC = (keyWord) => {
    return data[lang][keyWord];
  };

  const login: TLoginFC = async (payload: IAuth) => {
    signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then(async () => {

        const tmpUser = await getUser();

        if (tmpUser) {
          const users = await getDocs(collection(db, "usersCollection"));
          const finalUser = users?.docs.map((doc) => doc.data().uid == tmpUser.uid ? doc.data() : null).filter(function (el) {
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
      .catch((error: { message: any; }) => {
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
    createUserWithEmailAndPassword(auth, payload.email, payload.password)
      .then(async () => {
        const tmpUser = await getUser();

        if (tmpUser) {
          await addDoc(collection(db, "usersCollection"), {
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
    await getAuth()
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
  const updateUserProfil: TUpdateUserProfilFC = async (payload: IProfil) => {
    const tmpUser = await getUser();
    let values: IProfil = {};

    if (tmpUser) {
        try {
            await updateEmail(tmpUser, payload.email!);

            const sitesSnapshot = await getDocs(collection(db, 'Sites'));
            sitesSnapshot.forEach(async doc => {
                if (doc.data().creator === user?.firstname) {
                    await setDoc(doc.ref, {
                        ...doc.data(),
                        creator: payload.displayName,
                    });
                } else {
                    await setDoc(doc.ref, {
                        ...doc.data(),
                        likes: {
                            likes: doc.data().likes.likes,
                            names: doc.data().likes.names.filter((elem: string) => elem !== user?.firstname).concat([payload.displayName]),
                        },
                    });
                }
            });

            const usersSnapshot = await getDocs(collection(db, 'usersCollection'));
            usersSnapshot.forEach(doc => {
                if (doc.data().uid === tmpUser.uid) {
                    values = doc.data();
                }
            });
            await setDoc(doc(db, 'usersCollection', tmpUser.uid), {
                ...values,
                email: payload.email,
                displayName: payload.displayName,
                birthdate: payload.birthdate,
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
    try {
        const tmpUser = await getUser();

        await updateProfile(tmpUser, {
          photoURL: payload.path.split('/')[1]
        });

        const storageRef = ref(storage, payload.path);
        const blob = await (await fetch(payload.url!)).blob();
        uploadBytes(storageRef, blob)
    } catch (error) {
        return error;
    }
  };

  const setImage: TSetImageFC = async (payload: IPhoto) => {
    try {
        const storageRef = ref(storage, payload.path);
        const blob = await (await fetch(payload.url!)).blob();
        uploadBytes(storageRef, blob)
    } catch (error) {
        return error;
    }
  };

  const getImage: TGetImageFC = async (payload: IPhoto) => {
    try {
      const imgRef = ref(storage, `${payload.path}/${payload.url}`);
      const url = await getDownloadURL(imgRef);
  
      return url;
    } catch (error) {
      return 'https://static.thenounproject.com/png/1496955-200.png';
    }
  };

  const getItems: TGetItemsFC = async () => {
    try {
        const items = await getDocs(collection(db, 'Sites'));
        return items
    } catch (error) {
        console.error("Error fetching items:", error);
        return [];
    }
};

const setItems: TSetItemsFC = async (payload) => {
  return doc(db, 'Sites', payload.name);
};

const updateItem: TUpdateItemFC = async (payload) => {
    try {
      const itemRef = doc(db, 'Sites', payload.item);
      const item = await getDoc(itemRef);

      if (item.exists()) {
        let updatedLikes: { likes: number, names: string[] };
      
        if (payload.addLike) {
          if (!item.data()?.likes.names.includes(user?.firstname)) {
            updatedLikes = {
              likes: item.data()?.likes.likes + 1,
              names: [...item.data()?.likes.names, user?.firstname || ''],
            };
          } else {
            updatedLikes = {
              likes: item.data()?.likes.likes + 1,
              names: item.data()?.likes.names,
            };
          }
        } else {
          if (item.data()?.likes.names.includes(user?.firstname)) {
            updatedLikes = {
              likes: item.data()?.likes.likes - 1,
              names: item.data()?.likes.names.filter((elem: string) => elem !== user?.firstname),
            };
          } else {
            updatedLikes = {
              likes: item.data()?.likes.likes - 1,
              names: item.data()?.likes.names,
            };
          }
        }
      
        updateDoc(itemRef, {
          likes: updatedLikes,
        });
      }
      
    } catch (error) {
        console.error("Error updating item:", error);
    }
}

const deleteItem: TDeleteItemFC = async (payload) => {
    try {
        await deleteDoc(doc(db, 'Sites', payload.name));
        await deleteObject(ref(storage, 'images/' + payload.path));
    } catch (error) {
        console.error("Error deleting item:", error);
    }
};

const deleteImage: TDeleteImageFC = async (path) => {
    try {
        await deleteObject(ref(storage, 'images/' + path));
    } catch (error) {
        console.error("Error deleting image:", error);
    }
};

  const setAppLang: TSetAppLangFC = async (language) => {
    setLang(language);
  };

  const getAppLang: TGetAppLangFC = async () => {
    return (lang);
  };

  const resetpassword: TResetPasswordFC = async (payload: IReset) => {
    try {
        await sendPasswordResetEmail(auth, payload.email);
        Alerts.success({
            title: getTraduction('ALERT_PASSWORD_TITLE'),
            message: getTraduction('ALERT_PASSWORD_MESSAGE'),
        });
    } catch (error) {
        Alerts.warning({
            title: error.message,
            message: '',
        });
    }
};

  return (
    <ClientContext.Provider value={{
      client: user,
      getTraduction, setAppLang, getAppLang,
      autolog, login, register, logout, resetpassword, updateUserProfil,
      uploadpicture, takepicture, updatePicture, getImage, setImage,
      getUser, getItems, setItems, deleteItem, deleteImage, updateItem,
    }}
    >
      {children}
    </ClientContext.Provider>
  );
};
