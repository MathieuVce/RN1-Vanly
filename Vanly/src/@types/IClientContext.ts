import { IAuth, IClient, IDelete, IPhoto, IProfil, IRegisterClient, IReset } from './IClient';

export interface IClientContext {
  client?: null | IClient;
  
  login: TLoginFC;
  sleep: TSleepFC;
  logout: TLogoutFC;
  autolog: TAutoLogFC;
  getUser: TGetUserFC;
  getImage: TGetImageFC;
  setImage: TSetImageFC;
  register: TRegisterFC;
  getItems: TGetItemsFC;
  setItems: TSetItemsFC;
  setAppLang: TSetAppLangFC;
  getAppLang: TGetAppLangFC;
  deleteItem: TDeleteItemFC;
  deleteImage: TDeleteImageFC;
  takepicture: TTakePictureFC;
  updateProfil: TUpdateProfilFC;
  getTraduction: TGetTraductionFC;
  uploadpicture: TUploadPictureFC;
  resetpassword: TResetPasswordFC;
  updatePicture: TUpdatePictureFC;
}

export type TLogoutFC = () => Promise<any>;
export type TAutoLogFC = () => Promise<any>;
export type TGetUserFC = () => Promise<any>;
export type TGetItemsFC = () => Promise<any>;
export type TSetItemsFC = () => Promise<any>;
export type TGetAppLangFC = () => Promise<any>;
export type TTakePictureFC = () => Promise<any>; 
export type TUploadPictureFC = () => Promise<any>;
export type TSleepFC = (ms: number) => Promise<any>;
export type TLoginFC = (payload: IAuth) => Promise<any>;
export type TGetTraductionFC = (keyWord: string) => string;
export type TSetImageFC = (payload: IPhoto) => Promise<any>;
export type TGetImageFC = (payload: IPhoto) => Promise<any>;
export type TDeleteImageFC = (path: string) => Promise<any>;
export type TDeleteItemFC = (payload: IDelete) => Promise<any>;
export type TSetAppLangFC = (lang: 'fr' | 'en') => Promise<any>;
export type TResetPasswordFC = (payload: IReset) => Promise<any>;
export type TUpdatePictureFC = (payload: IPhoto) => Promise<any>;
export type TUpdateProfilFC = (payload: IProfil) => Promise<any>;
export type TRegisterFC = (payload: IRegisterClient) => Promise<any>;


export const defaultClientValue: IClientContext = {
  client: null,

  getTraduction: () => '',
  login: () => Promise.reject(null),
  sleep: () => Promise.reject(null),
  logout: () => Promise.reject(null),
  autolog: () => Promise.reject(null),
  getUser: () => Promise.reject(null),
  getItems: () => Promise.reject(null),
  setItems: () => Promise.reject(null),
  register: () => Promise.reject(null),
  getImage: () => Promise.reject(null),
  setImage: () => Promise.reject(null),
  setAppLang: () => Promise.reject(null),
  getAppLang: () => Promise.reject(null),
  deleteItem: () => Promise.reject(null),
  deleteImage: () => Promise.reject(null),
  takepicture: () => Promise.reject(null),
  updateProfil: () => Promise.reject(null),
  updatePicture: () => Promise.reject(null),
  uploadpicture: () => Promise.reject(null),
  resetpassword: () => Promise.reject(null),
};
