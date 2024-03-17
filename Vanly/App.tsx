import React, { useContext, useEffect, useState } from 'react';
import FlashMessage from 'react-native-flash-message';
import { ActivityIndicator, Dimensions, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { AlertProvier } from './src/contexts/AlertContext';
import { AppModelNav } from './src/roots/AppModelNav';
import { AppModelNavConnected } from './src/roots/AppModelNavConnected';
import { ClientContext, ClientProvider } from './src/contexts/ClientContext';

const Appli: React.FC = () => {
  const { client, autolog } = useContext(ClientContext);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      await autolog();
      setLoggedIn(true);
    })();
  }, []);

  if (loggedIn) {
    return (
      <NavigationContainer>
        {client
          ? <AppModelNavConnected />
          : <AppModelNav />}
      </NavigationContainer>
    );
  } else {
    return (
      <ImageBackground
      source={require('./src/assets/Login.png')}
      style={{ flex: 1, backgroundColor: '#99D3A6' }}
    >
        <ActivityIndicator style={{ marginTop: Dimensions.get('window').height / 2.5, alignSelf: 'center' }} size='large' color='white'></ActivityIndicator>
      </ImageBackground>
    );
  }
};

export default function App() {
  const [ready, setReady] = useState(false);

  const cacheResourcesAsync = async () => {
    const images = [require('./src/assets/Login.png'), require('./src/assets/gaz.png'), require('./src/assets/view.png'), require('./src/assets/water.png')];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    }); 
    await Promise.all(cacheImages);
  };

  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(error => {
      console.warn('Error preventing auto hide:', error);
    });

    cacheResourcesAsync().then(() => {
      SplashScreen.hideAsync().catch(error => {
        console.warn('Error hiding splash screen:', error);
      });
    });
  }, []);

  return (
    <SafeAreaProvider>
      <AlertProvier>
        <ClientProvider>
          <Appli />
          <FlashMessage position="top" />
        </ClientProvider>
      </AlertProvier>
    </SafeAreaProvider>
  );
}
