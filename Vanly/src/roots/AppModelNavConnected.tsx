import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

import { Map } from '../screens/Map';

interface IAppModelNavConnectedProps {}

type AppModelNavParamList = {
  Map: undefined;
};

export type AppModelNavConnectedProps<T extends keyof AppModelNavParamList> = {
  navigation: StackNavigationProp<AppModelNavParamList, T>;
  route: RouteProp<AppModelNavParamList, T>;
};

const RootStack = createStackNavigator<AppModelNavParamList>();

export const AppModelNavConnected: React.FC<IAppModelNavConnectedProps> = () => (
  <RootStack.Navigator
    initialRouteName="Map"
    screenOptions={{
      header: () => null,
    }}
  >
    <RootStack.Screen name="Map" component={Map} />
  </RootStack.Navigator>
);
