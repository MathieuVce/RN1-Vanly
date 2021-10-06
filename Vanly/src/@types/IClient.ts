export interface IClient {
  email: string,
  picture?: string,
  firstname?: string,
  lastname?: string,
  birthdate?: IDate,
}
export interface IRegisterClient {
  email?: string,
  fullname?: string,
  birthdate?: IDate,
}

export interface IDate {
  day?: string,
  month?: string,
  year?: string
}

export interface IAuth {
  email: string,
  password: string
}

export interface IReset {
  email: string;
}