import {Entity, model, property, hasMany} from '@loopback/repository';
import {Login} from './login.model';

@model()
export class Usuario extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    default: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'boolean',
    required: true,
  })
  active: boolean;

  @property({
    type: 'string',
    required: true,
  })
  activate_token: string;

  @property({
    type: 'string',
    required: true,
  })
  activate_token_expire: string;

  @property({
    type: 'date',
    required: true,
  })
  reset_password_token: string;

  @property({
    type: 'date',
    required: true,
  })
  reset_password_token_expire: string;

  //@hasMany(() => Login)
  //logins: Login[];

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;