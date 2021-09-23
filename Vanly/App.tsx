
import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from "react-native-flash-message";

import  { AppModelNav } from './src/roots/AppModelNav'
import { AlertProvier } from './src/contexts/AlertContext';
import  {ClientContext, ClientProvider} from './src/contexts/ClientContext'
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  
    return (
        <SafeAreaProvider>
            <AlertProvier>
              <ClientProvider>
                  <Appli/>
                  <FlashMessage position="top" />
              </ClientProvider>
            </AlertProvier>
        </SafeAreaProvider>
    )
}


const Appli: React.FC = () => {
  const { client } = useContext(ClientContext);

  return (
    <NavigationContainer>
      {client
        ? <AppModelNav />
        :  <AppModelNav />
      }
    </NavigationContainer>
  )
};