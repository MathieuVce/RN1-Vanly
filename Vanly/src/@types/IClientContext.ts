export interface IClientContext {
  client?: null | { email: string, password: string };
}

export const defaultClientValue: IClientContext = {
  client: null,
};
