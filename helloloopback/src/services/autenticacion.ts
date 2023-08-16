import { repository } from "@loopback/repository";
import { LoginRepository, UsuarioRepository } from "../repositories";
import { Encryptado } from "../services/encriptado";
import { ServiceKeys as keys} from "../Keys/Service-keys";
import { Codigo2Fa, Credenciales, Login, Usuario } from "../models";
import { __generator } from "tslib";
import { configuracionseguridad } from "../config/seguridad.config";
const jwt = require("jsonwebtoken");
const generador = require('generate-password');

export class authentication{
    constructor(
        @repository(UsuarioRepository)
        public userrepository: UsuarioRepository,
        @repository(LoginRepository)
        public loginrepository: LoginRepository

    ){

    }
    //genera codigo 2fa aleatoreo
    generar2fa(n:number):string{
        let clave = generador.generate({
            length:n,
            numbres:true
        });
        return clave
    }

    //valida credenciales de usuario
    async identificarusuario(credencial: Credenciales):Promise<Usuario | null>{
        let usuario = await this.userrepository.findOne({where: {
            email: credencial.email, 
            password: credencial.password
        }});
        if(usuario){console.log(usuario.email)}
        else{console.log("no encontrado")};
            
        
        return usuario as Usuario;
    }

    //valida codigo 2fa
    async validarcodigo2fa(credencial2fa: Codigo2Fa):Promise<Usuario|null>{
        let login = await this.loginrepository.findOne({
            where:{
                usuarioId: credencial2fa.usuarioid,
                codigo2FA: credencial2fa.codigo2fa,
                estadocodigo2fa: false,

            }
        });
        if (login){
            let usuario = await this.userrepository.findById(credencial2fa.usuarioid);
            return usuario;
        }
        return null
    }

    //creacion del
    creartoken(usuario: Usuario):string {
        let datos= {
            username: usuario.username,
            email:usuario.email

        }
        let token = jwt.sign(datos,configuracionseguridad.clavejwt);
        return token;
    }
        
}

