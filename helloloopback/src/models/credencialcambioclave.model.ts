import {Entity, model, property} from '@loopback/repository';

@model()
export class Credencialcambioclave extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  usuarioid: number;

  @property({
    type: 'string',
    required: true,
  })
  claveactual: string;

  @property({
    type: 'string',
    required: true,
  })
  nuevaclave1: string;

  @property({
    type: 'string',
    required: true,
  })
  nuevaclave2: string;


  constructor(data?: Partial<Credencialcambioclave>) {
    super(data);
  }
}

export interface CredencialcambioclaveRelations {
  // describe navigational properties here
}

export type CredencialcambioclaveWithRelations = Credencialcambioclave & CredencialcambioclaveRelations;
