import React, { createContext, useContext, useState } from 'react';

import firebase from '../database/firebase';
import { IAuth, IClient, IReset } from '../@types/IClient';
import { defaultClientValue, IClientContext, TGetUserFC, TLoginFC, TLogoutFC, TRegisterFC, TResetPasswordFC } from '../@types/IClientContext';
import { AlertContext } from './AlertContext';

export const ClientContext = createContext<IClientContext>(defaultClientValue);

export const ClientProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<null | IClient >(null);
  const { Alerts } = useContext(AlertContext);

  const getUser: TGetUserFC = async () => {
    const tmpuser = firebase.auth().currentUser;

    return tmpuser ? { displayName: tmpuser.displayName, email: tmpuser.email } : null;
  };

  const login: TLoginFC = async payload => {
    await firebase.auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(async () => {

        const tmpuser = await getUser();
        if (tmpuser) {

          setUser({ 'firstname': tmpuser.displayName, email: tmpuser.email });
          Alerts.success({
            title: 'Successful authentication',
            message: 'Welcome back !',
            // message: `Welcome back ${tmpuser?.displayName} !`,
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

  const register: TRegisterFC = async (payload: IAuth) => {
    await firebase.auth()
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .catch(error => {
        console.log(error);
        Alerts.warning({
          title: error.message,
          message: '',
        });
      });
  };

  const logout: TLogoutFC = async () => {
    await firebase.auth()
      .signOut()
      .then(() => {
        setUser(null);
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

  const resetpassword: TResetPasswordFC = async (payload: IReset) => {
    await firebase.auth()
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
      
      login, register, logout, resetpassword,
      getUser,
    }}
    >
      {children}
    </ClientContext.Provider>
  );
};