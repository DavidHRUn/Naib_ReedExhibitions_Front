import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: User;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get user(): User {
    if (this._user != null) {
      return this._user;
    } else if (this._user == null && sessionStorage.getItem('userH') != null) {
      this._user = JSON.parse(sessionStorage.getItem('userH')) as User;
      return this._user;
    }
    return new User();
  }
  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('tokenH') != null) {
      this._token = sessionStorage.getItem('tokenH');
      return this._token;
    }
    return null;
  }

  login(user: User): Observable<any> {
    const urlEndPoint = 'http://localhost:8080/oauth/token';
    const credencialesApp = btoa('NaibAPP' + ':' + 'Sin@psistH');
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + credencialesApp });
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', user.email);
    params.set('password', user.password);
    return this.http.post<any>(urlEndPoint, params.toString(), { headers: httpHeaders });
  }

  saveUser(accessToken: string) {
    let data = this.dataToken(accessToken);
    this._user = new User();
    this._user.id = data.id;
    this._user.nombre = data.name;
    this._user.aPaterno = data.surname;
    this._user.email = data.user_name;
    this._user.telefono = data.tel;
    this._user.rol = data.authorities;
    sessionStorage.setItem('userH', JSON.stringify(this._user));
  }

  saveToken(accessToken: string) {
    this._token = accessToken;
    sessionStorage.setItem('tokenH', accessToken);
  }

  dataToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated():boolean{
    let data = this.dataToken(this.token);
    if(data != null && data.user_name && data.user_name.length>0){
      return true;
    }
    return false;
  }

  logout(){
    this._token = null;
    this._user = null;
    sessionStorage.removeItem('tokenH');
    sessionStorage.removeItem('userH');
  }

  hasRole(rol: string):boolean{
    if(this.user.rol == rol){
      return true;
    }
    return false;
  }

}
