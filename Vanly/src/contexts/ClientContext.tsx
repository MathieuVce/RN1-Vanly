import React, { createContext, useContext, useState } from 'react';

import firebase from '../database/firebase';
import { IClient } from '../@types/IClient';
import { defaultClientValue, IClientContext, TLoginFC } from '../@types/IClientContext';
import { AlertContext } from './AlertContext';

export const ClientContext = createContext<IClientContext>(defaultClientValue);

export const ClientProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<null | IClient >(null);
  const { Alerts } = useContext(AlertContext);


  const login: TLoginFC = async payload => {
    await firebase.auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(async () => {

        // const tmpuser = firebase.auth().currentUser;
        setUser({ 'email': '' });
        Alerts.success({
          title: 'Login successful',
          message: '',
        });

      })
      .catch(error => {
        console.log(error);
        Alerts.warning({
          title: `${error}`,
          message: '',
          duration: 8000,
        });
      });
  };

  return (
    <ClientContext.Provider value={{
      client: user,
      
      login,
    }}
    >
      {children}
    </ClientContext.Provider>
  );
};