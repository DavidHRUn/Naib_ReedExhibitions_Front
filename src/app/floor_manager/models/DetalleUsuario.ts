import { User } from 'src/app/users/models/user';

export class DetalleUsuario{
    id:number;
    idUsuario:number;
    idEvento:number;
    estatus:number;
    usuario:User;
}