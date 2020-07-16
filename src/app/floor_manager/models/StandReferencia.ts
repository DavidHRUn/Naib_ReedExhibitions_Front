import { Expositor } from './Expositor';
import { AsignacionFMEvento } from './AsignacionFMEvento';

export class StandReferencia{
    id:number;
    idExpositor:number;
    idSalon:number;
    numeroStand:string;
    porcentajeArmado:string;
    status:string;
    statusPago:string;
    logo:String;
    expositor:Expositor=new Expositor();
    asignacionEvento:AsignacionFMEvento[]=[];
}