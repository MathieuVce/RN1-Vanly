import React, { createContext, useState } from 'react';
import { defaultClientValue, IClientContext } from '../@types/IClientContext';

export const ClientContext = createContext<IClientContext>(defaultClientValue);

interface UserProviderProps {children: any}

export const ClientProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user] = useState<null | {email: string, password: string} >(null);

  return (
    <ClientContext.Provider value={{
      client: user,
    }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;
