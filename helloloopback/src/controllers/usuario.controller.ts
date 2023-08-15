import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Login, Usuario} from '../models';
import {Credenciales} from '../models';
import {LoginRepository, UsuarioRepository} from '../repositories';
import { Encryptado } from '../services/encriptado';
import { ServiceKeys as Keys } from '../Keys/Service-keys';
import { service } from '@loopback/core';
import { authentication } from '../services/autenticacion';
import { Http2ServerRequest } from 'http2';
export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository : UsuarioRepository,
    @service(authentication)
    public servicioseguridad: authentication,
    @repository(LoginRepository)
    public loginrepository: LoginRepository
  ) {}

  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<Usuario> {
    //cifrar password
    let password1 = new Encryptado(Keys.MD5).Encrypt(usuario.password);
    usuario.password = password1;

    return this.usuarioRepository.create(usuario);
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }


/*
  2FA
*/

@post('/identificar-usuario')
@response(200,{
  description:"identificar usuario",
  content:{'application/json':{schema:getModelSchemaRef(Credenciales)}}
   
})
  async identificarusuario(
    @requestBody(
      {
      content:{
        'aplication/json':{
            schema:getModelSchemaRef(Credenciales)
          }
        }
      }
    )
    credenciales: Credenciales
  ):Promise<object>{
    let usuario = await this.servicioseguridad.identificarusuario(credenciales);
  if(usuario){
    let c2fa = this.servicioseguridad.generar2fa(6);
    let login: Login = new Login();
    login.usuarioId = usuario.id!;
    login.codigo2FA = c2fa;
    login.token = "";
    login.active = false;
    this.loginrepository.create(login);
    return Usuario;
    
      }
      return new  HttpErrors[401]("Credenciales incorrectas")
  }


}

