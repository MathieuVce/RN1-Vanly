import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

import { Login } from '../screens/PreLogin/Login';
import { Register } from '../screens/PreLogin/Register';
import { ForgottenPassword } from '../screens/PreLogin/ForgottenPassword';

interface IAppModelNavProps {}

type AppModelNavParamList = {
  Login: undefined;
  Register: undefined;
  ForgottenPassword: undefined;
};

export type AppModelNavProps<T extends keyof AppModelNavParamList> = {
  navigation: StackNavigationProp<AppModelNavParamList, T>;
  route: RouteProp<AppModelNavParamList, T>;
};

const RootStack = createStackNavigator<AppModelNavParamList>();

export const AppModelNav: React.FC<IAppModelNavProps> = () => (
  <RootStack.Navigator
    initialRouteName="Login"
    screenOptions={{
      header: () => null,
    }}
  >
    <RootStack.Screen name="Login" component={Login} />
    <RootStack.Screen name="Register" component={Register} />
    <RootStack.Screen name="ForgottenPassword" component={ForgottenPassword} />
  </RootStack.Navigator>
);
