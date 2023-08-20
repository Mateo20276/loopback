import {Model, model, property} from '@loopback/repository';

@model()
export class Notificacionsms extends Model {
  @property({
    type: 'string',
    required: true,
  })
  destinatario: string;

  @property({
    type: 'string',
    required: true,
  })
  hash: string;

  @property({
    type: 'string',
    required: true,
  })
  mensaje: string;


  constructor(data?: Partial<Notificacionsms>) {
    super(data);
  }
}

export interface NotificacionsmsRelations {
  // describe navigational properties here
}

export type NotificacionsmsWithRelations = Notificacionsms & NotificacionsmsRelations;
