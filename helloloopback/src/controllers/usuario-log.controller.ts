import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Usuario,
  Log,
} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioLogController {
  constructor(
    @repository(UsuarioRepository) protected usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuarios/{id}/logs', {
    responses: {
      '200': {
        description: 'Array of Usuario has many Log',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Log)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Log>,
  ): Promise<Log[]> {
    return this.usuarioRepository.logs(id).find(filter);
  }

  @post('/usuarios/{id}/logs', {
    responses: {
      '200': {
        description: 'Usuario model instance',
        content: {'application/json': {schema: getModelSchemaRef(Log)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Usuario.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Log, {
            title: 'NewLogInUsuario',
            exclude: ['id'],
            optional: ['usuarioId']
          }),
        },
      },
    }) log: Omit<Log, 'id'>,
  ): Promise<Log> {
    return this.usuarioRepository.logs(id).create(log);
  }

  @patch('/usuarios/{id}/logs', {
    responses: {
      '200': {
        description: 'Usuario.Log PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Log, {partial: true}),
        },
      },
    })
    log: Partial<Log>,
    @param.query.object('where', getWhereSchemaFor(Log)) where?: Where<Log>,
  ): Promise<Count> {
    return this.usuarioRepository.logs(id).patch(log, where);
  }

  @del('/usuarios/{id}/logs', {
    responses: {
      '200': {
        description: 'Usuario.Log DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Log)) where?: Where<Log>,
  ): Promise<Count> {
    return this.usuarioRepository.logs(id).delete(where);
  }
}
