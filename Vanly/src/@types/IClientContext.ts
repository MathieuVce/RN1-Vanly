import { IAuth, IClient, IReset } from './IClient';

export interface IClientContext {
  client?: null | IClient;
  
  login: TLoginFC;
  logout: TLogoutFC;
  autolog: TAutoLogFC;
  getUser: TGetUserFC;
  getImage: TGetImageFC;
  setImage: TSetImageFC;
  register: TRegisterFC;
  takepicture: TTakePictureFC;
  uploadpicture: TUploadPictureFC;
  resetpassword: TResetPasswordFC;
  updatePicture: TUpdatePictureFC;
}

export type TLogoutFC = () => Promise<any>;
export type TAutoLogFC = () => Promise<any>;
export type TGetUserFC = () => Promise<any>;
export type TTakePictureFC = () => Promise<any>;
export type TUploadPictureFC = () => Promise<any>;
export type TLoginFC = (payload: IAuth) => Promise<any>;
export type TGetImageFC = (payload: { path: string, url?: string; }) => Promise<any>;
export type TSetImageFC = (payload: { path: string, url: string; }) => Promise<any>;
export type TRegisterFC = (payload: IAuth) => Promise<any>;
export type TUpdatePictureFC = (payload: { path: string, url: string; }) => Promise<any>;
export type TResetPasswordFC = (payload: IReset) => Promise<any>;


export const defaultClientValue: IClientContext = {
  client: null,

  login: () => Promise.reject(null),
  logout: () => Promise.reject(null),
  autolog: () => Promise.reject(null),
  getUser: () => Promise.reject(null),
  register: () => Promise.reject(null),
  getImage: () => Promise.reject(null),
  setImage: () => Promise.reject(null),
  takepicture: () => Promise.reject(null),
  updatePicture: () => Promise.reject(null),
  uploadpicture: () => Promise.reject(null),
  resetpassword: () => Promise.reject(null),
};
