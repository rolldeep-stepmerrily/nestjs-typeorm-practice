export enum ERole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IValidate {
  sub: 'access' | 'refresh';
  id: number;
  role: ERole;
}
