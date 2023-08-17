import {Model, model, property} from '@loopback/repository';

@model()
export class Credencial extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  Password: string;


  constructor(data?: Partial<Credencial>) {
    super(data);
  }
}

export interface CredencialRelations {
  // describe navigational properties here
}

export type CredencialWithRelations = Credencial & CredencialRelations;
