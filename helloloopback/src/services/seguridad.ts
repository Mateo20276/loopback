import { repository } from "@loopback/repository";
import { Codigo2Fa, Credencial, Log } from "../models";
import { LogRepository, UsuarioRepository } from "../repositories";
import { Usuario} from "../models";
var jwt = require('jsonwebtoken');


var generator = require('generate-password');


//crear clave aleatoria
export class  Seguridad{
    constructor(
        @repository (UsuarioRepository)
        public usuariorepositorio: UsuarioRepository,
        @repository (LogRepository)
        public logrepositorio: LogRepository

    ){}


    Crearcodigo2fa(n:number):string{
        let clave = generator.generate({
            length: n,
            numbers: true
        });
        return clave
    }

//buscar usuario segun credenciales
   async identificarusuario(credenciales: Credencial):Promise<Usuario|null>{
        let usuario = await this.usuariorepositorio.findOne({where:{
            email: credenciales.email,
            password: credenciales.Password,
            c2fastate: true
        }});
        return usuario as Usuario;
    }
//credencial de usuario con codigo 2fa
    async valiradcodig2fa(credenciales:Codigo2Fa):Promise<Usuario|null>{
        let log = await this.logrepositorio.findOne({
            where:{
                usuarioId: credenciales.usuarioId,
                codigo2fa: credenciales.codigo2fa,
                estadocodigo2fa: false
            }
        });
        if(log){
           let usuario= this.usuariorepositorio.findById(credenciales.usuarioId);
           return usuario
        }
        else {return null;
        }
    }
//generar el token
    creartoken(usuario:Usuario):string{
        let datos= {
            username:usuario.username,
            email:usuario.email
        }
        let token = jwt.sign(datos, "asdfsad",{ expiresIn: '1h' })
        return token

    }

    verificartoken(token: string){
        let decoded = jwt.verify(token,"asdfsad");
        return decoded;
    }
}