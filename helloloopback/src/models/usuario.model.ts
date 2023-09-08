import {Entity, model, property, hasMany} from '@loopback/repository';
import {Log} from './log.model';

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
  
/*  @property({
    type: 'string',
    required: true,
  })
  c2fa: string;*/

  @property({
    type: 'boolean',
    required: true,
  })
  activo: boolean;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;


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


  @hasMany(() => Log)
  logs: Log[];

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
