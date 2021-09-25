import { IAuth, IClient } from './IClient';

export interface IClientContext {
  client?: null | IClient;
  
  login: TLoginFC;
}

export type TLoginFC = (payload: IAuth) => Promise<any>;

export const defaultClientValue: IClientContext = {
  client: null,

  login: () => Promise.reject(null),
};
