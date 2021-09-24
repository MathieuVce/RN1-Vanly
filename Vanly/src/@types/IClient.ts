export interface IClient {
  email: string,
  picture?: string,
  firstname?: string,
  lastname?: string
}

export interface IAuth {
  email: string,
  password: string
}

export interface IReset {
  email: string;
}