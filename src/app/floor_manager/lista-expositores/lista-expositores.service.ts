import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/users/service/auth.service';
import { StandReferencia } from '../models/StandReferencia';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class listaExpositoresService {

  constructor(private http: HttpClient, private ruta: Router, private authService: AuthService) {
  }

  private addAuthorizationheader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer' + token);
    }
    return this.httpHeaders;
  }


  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  private urlEndPoint = "http://localhost:8080/api/listaExpositores";


  getListaExpositores(idDetalleUsuario): Observable<HttpEvent<{}>> {
    catchError(e=>{
      this.ruta.navigate(['/login']);
      Swal.fire('Error al ingresar', e.error.mensaje, 'error')
      return throwError(e);
    })
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("UsEv", idDetalleUsuario);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/getListaExpositores`, formData, {
      reportProgress: true, headers: httpHeaders
    });
    return this.http.request(req);
  }

  updateStatusStand(listaStand, listaStatusStand):Observable<any>{
    let token = this.authService.token;
    const httpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    let formData = new FormData();
    formData.append("listaStand", listaStand);
    formData.append("listaStatus", listaStatusStand);
    const req = new HttpRequest('PUT', `${this.urlEndPoint}/updateStatusStand`, formData, {
      headers: httpHeaders
    });
    return this.http.request(req).pipe(
      catchError(e=>{
        console.log("Hubo un errror crack");
        return throwError (e);
      })
    );
  }




}


