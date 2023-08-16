import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Log,
  Usuario,
} from '../models';
import {LogRepository} from '../repositories';

export class LogUsuarioController {
  constructor(
    @repository(LogRepository)
    public logRepository: LogRepository,
  ) { }

  @get('/logs/{id}/usuario', {
    responses: {
      '200': {
        description: 'Usuario belonging to Log',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Usuario),
          },
        },
      },
    },
  })
  async getUsuario(
    @param.path.number('id') id: typeof Log.prototype.id,
  ): Promise<Usuario> {
    return this.logRepository.usuario(id);
  }
}
