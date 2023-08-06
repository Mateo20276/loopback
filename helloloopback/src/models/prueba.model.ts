import {Entity, model, property} from '@loopback/repository';

@model()
export class Prueba extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    default: 'negro',
  })
  color?: string;

  @property({
    type: 'string',
    required: true,
  })
  tamano: string;


  constructor(data?: Partial<Prueba>) {
    super(data);
  }
}

export interface PruebaRelations {
  // describe navigational properties here
}

export type PruebaWithRelations = Prueba & PruebaRelations;
