import {Model, model, property} from '@loopback/repository';

@model()
export class Codigo2Fa extends Model {
  @property({
    type: 'number',
    required: true,
  })
  usuarioid: number;

  @property({
    type: 'string',
    required: true,
  })
  codigo2fa: string;


  constructor(data?: Partial<Codigo2Fa>) {
    super(data);
  }
}

export interface Codigo2FaRelations {
  // describe navigational properties here
}

export type Codigo2FaWithRelations = Codigo2Fa & Codigo2FaRelations;
