/*import {
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
  Login,
} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioLoginController {
  constructor(
    @repository(UsuarioRepository) protected usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuarios/{id}/logins', {
    responses: {
      '200': {
        description: 'Array of Usuario has many Login',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Login)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Login>,
  ): Promise<Login[]> {
    return this.usuarioRepository.logins(id).find(filter);
  }

  @post('/usuarios/{id}/logins', {
    responses: {
      '200': {
        description: 'Usuario model instance',
        content: {'application/json': {schema: getModelSchemaRef(Login)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Usuario.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Login, {
            title: 'NewLoginInUsuario',
            exclude: ['id'],
            optional: ['usuarioId']
          }),
        },
      },
    }) login: Omit<Login, 'id'>,
  ): Promise<Login> {
    return this.usuarioRepository.logins(id).create(login);
  }

  @patch('/usuarios/{id}/logins', {
    responses: {
      '200': {
        description: 'Usuario.Login PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Login, {partial: true}),
        },
      },
    })
    login: Partial<Login>,
    @param.query.object('where', getWhereSchemaFor(Login)) where?: Where<Login>,
  ): Promise<Count> {
    return this.usuarioRepository.logins(id).patch(login, where);
  }

  @del('/usuarios/{id}/logins', {
    responses: {
      '200': {
        description: 'Usuario.Login DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Login)) where?: Where<Login>,
  ): Promise<Count> {
    return this.usuarioRepository.logins(id).delete(where);
  }
}
*/