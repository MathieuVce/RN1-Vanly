import React, { createContext, useState } from 'react';

import { IClient } from '../@types/IClient';
import { defaultClientValue, IClientContext, TLoginFC } from '../@types/IClientContext';

export const ClientContext = createContext<IClientContext>(defaultClientValue);

interface UserProviderProps {children: any}

export const ClientProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<null | IClient >(null);

  const login: TLoginFC = async payload => {
    setUser({ ...payload });
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

export default ClientProvider;
