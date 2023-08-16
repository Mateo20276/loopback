import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Usuario} from './usuario.model';

@model()
export class Login extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  codigo2FA: string;

  @property({
    type: 'boolean',
  })
  active?: boolean;

  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'boolean',
    required: true,
  })
  estadocodigo2fa: boolean;

  @belongsTo(() => Usuario)
  usuarioId: number;

  constructor(data?: Partial<Login>) {
    super(data);
  }
}

export interface LoginRelations {
  // describe navigational properties here
}

export type LoginWithRelations = Login & LoginRelations;
