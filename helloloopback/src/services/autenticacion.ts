import { repository } from "@loopback/repository";
import { UsuarioRepository } from "../repositories";
import { Encryptado } from "../services/encriptado";
import { ServiceKeys as keys} from "../Keys/Service-keys";
import { Credenciales, Usuario } from "../models";
import { __generator } from "tslib";
const jwt = require("jsonwebtoken");
const generador = require('generate-password');

export class authentication{
    constructor(
        @repository(UsuarioRepository)
        public userrepository: UsuarioRepository
    ){

    }

    async Identify(username:string,password:string):Promise<Usuario | false>{
        let user= await this.userrepository.findOne({where:{
            username: username}
        });
         
        if (user){
           // console.log(`username: ${user?.username} `);
            let crypt = new Encryptado(keys.MD5).Encrypt(password);

            if (user.password ==  crypt){
                return user;
            }            
        }
        return false 
    }

    async generartoken(user: Usuario){
        user.password = '';
        console.log(`user: ${user.username} - pass: ${user.password}`);
        let token = jwt.sign({
            
            exp: Math.floor(Date.now() / 1000)*3600,
            data:{
                id: user.id,
                username: user.username
                
            }
        }, keys.JWT_SECRET_KEY);
        return token;
    }

    generar2fa(n:number):string{
        let clave = generador.generate({
            length:n,
            numbres:true
        });
        return clave
    }

    async identificarusuario(credencial: Credenciales):Promise<Usuario | null>{
        let usuario = await this.userrepository.findOne({where: {
            email: credencial.email, 
            password: credencial.password
        }});
        return usuario as Usuario;
    }

}