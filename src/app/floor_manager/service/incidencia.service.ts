import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../users/service/auth.service';
import { IncidenciaGeneral } from '../models/incidenciaGeneral';
import { Incidencia } from '../models/incidencia';
import { User } from 'src/app/users/models/user';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {


  private urlEndPoint: string = 'http://localhost:8080/incidencia';
  public idS: number;
  public idU: number;

  constructor(private http: HttpClient, private authService: AuthService) { }

  create(incidencia: Incidencia): Observable<any> {   

    this.idS = incidencia.salon;
    this.idU = this.authService.user.id;
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token }); 
    return this.http.post<Incidencia>(`${this.urlEndPoint}/save?idS=${this.idS}&idU=${this.idU}`, incidencia, { headers: httpHeaders });  
  }


  uploadFoto(foto: File, idInci): Observable<HttpEvent<{}>> {
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    this.idU = this.authService.user.id;
    let formData = new FormData();
    formData.append("foto", foto);
    formData.append("idInci", idInci);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/saveFotoInci?idU=${this.idU}`, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }


}
