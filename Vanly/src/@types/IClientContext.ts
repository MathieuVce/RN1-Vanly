import { IAuth, IClient, IReset } from './IClient';

export interface IClientContext {
  client?: null | IClient;
  
  login: TLoginFC;
  logout: TLogoutFC;
  getUser: TGetUserFC;
  register: TRegisterFC;
  resetpassword: TResetPasswordFC;
}

export type TLoginFC = (payload: IAuth) => Promise<any>;
export type TRegisterFC = (payload: IAuth) => Promise<any>;
export type TLogoutFC = () => Promise<any>;
export type TResetPasswordFC = (payload: IReset) => Promise<any>;
export type TGetUserFC = () => Promise<any>;


export const defaultClientValue: IClientContext = {
  client: null,

  login: () => Promise.reject(null),
  register: () => Promise.reject(null),
  logout: () => Promise.reject(null),
  resetpassword: () => Promise.reject(null),
  getUser: () => Promise.reject(null),
};
