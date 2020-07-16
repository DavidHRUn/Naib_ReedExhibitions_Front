import { Component, OnInit } from '@angular/core';
import { listaExpositoresService } from './lista-expositores.service';
import { AuthService } from 'src/app/users/service/auth.service';
import { HttpEventType } from '@angular/common/http';
import { StandReferencia } from '../models/StandReferencia';
import { timer, Observable } from 'rxjs';
import { EventEmitter } from 'protractor';
import { parse } from 'path';
import { DetalleUsuario } from '../models/DetalleUsuario';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-lista-expositores',
  templateUrl: './lista-expositores.component.html',
  styleUrls: ['./lista-expositores.component.css']
})
export class ListaExpositoresComponent implements OnInit {

  public listaStand: StandReferencia[];
  public activeUser;
  public totalExpositores: number;
  public listaFm: DetalleUsuario[];
  public totalFm;
  public timerBuscador: number = 0;

  private listaEstatusStand: Array<string> = [];
  private listaIdStand: Array<string> = [];
  private TimeEstatusStand: number = 0;
  private lastIdStandSelected;
  private listaMisExpositores: StandReferencia[] = [];
  private listaExpositoresUser: StandReferencia[] = [];
  private listaTotalExpositores: StandReferencia[] = [];

  constructor(private listaExpositorService: listaExpositoresService, private authService: AuthService, private ruta: Router) { }


  ngOnInit(): void {
    this.buttonDetailsAnimation();
    this.getListaExpositores(this.authService.user.id);
    this.activeUser = this.authService.user.id;
  }

  private getListaExpositores(idUsuario: number): void {
    this.listaExpositorService.getListaExpositores(idUsuario).subscribe(
      Respuesta => {
        if (Respuesta.type === HttpEventType.Response) {
          let response: any = Respuesta.body;
          this.listaTotalExpositores = response.listaExpositores;
          this.listaFm = response.usersByEvento;
          this.totalFm = this.listaFm.length;
          response.listaExpositores.forEach(element => {
            if (element.asignacionEvento.length != 0) {
              if (this.activeUser == element.asignacionEvento[0].dUsuario.usuario.id) {
                this.listaMisExpositores.push(element);
              }
            }
          });
          this.totalExpositores = this.listaMisExpositores.length;
          this.listaStand = this.listaMisExpositores;
        }
      }
    )
  }

  public FiltroExpositores(): void {
    var seleccionado = $('select[id=filtroListaExpositor]').val();

    if (parseInt(seleccionado) == 0) {
      this.totalExpositores = this.listaTotalExpositores.length;
      this.listaStand = this.listaTotalExpositores;

    } else if (parseInt(seleccionado) == 1) {
      this.totalExpositores = this.listaMisExpositores.length;
      this.listaStand = this.listaMisExpositores;

    } else if (parseInt(seleccionado) == 2) {
      this.listaExpositoresUser = [];
      this.listaTotalExpositores.forEach(element => {
        if (element.asignacionEvento.length != 0) {
          if (parseInt(seleccionado.split("-")[1]) == element.asignacionEvento[0].dUsuario.usuario.id) {
            this.listaExpositoresUser.push(element);
          }
        }
      });
      this.totalExpositores = this.listaExpositoresUser.length;
      this.listaStand = this.listaExpositoresUser;
    }
  }



  actualizarEstadoStand(id: string) {
    var seleccionado = $('#Boton-' + id).val();
    var status: string;
    this.TimeEstatusStand = this.TimeEstatusStand + 1;
    var time = timer(4000);

    if (seleccionado == "Trazado") {
      $("#Boton-" + id).html("<i class='fas fa-tags'></i> Etiquetado");
      $("#Boton-" + id).removeClass("btn-outline-dark");
      $("#Boton-" + id).addClass("btn-outline-warning");
      $("#Boton-" + id).val("Etiquetado");
      status = "1";

    } else if (seleccionado == "Etiquetado") {
      $("#Boton-" + id).html("<i class='fas fa-eye'></i> Detalle");
      $("#Boton-" + id).removeClass("btn-outline-warning");
      $("#Boton-" + id).addClass("btn-outline-primary");
      $("#Boton-" + id).val("Detalle");
      status = "2";

    } else if (seleccionado == "Detalle") {
      this.listaExpositorService.updateStatusStand(this.listaIdStand, this.listaEstatusStand).subscribe(
        Respuesta => {
          this.ruta.navigate(['/detalleExpositor/', id])
        }
      );
    }

    let hasResult = 0;
    if (id == this.lastIdStandSelected) {
      this.listaEstatusStand.pop();
      this.listaIdStand.pop();
      this.lastIdStandSelected = parseInt(id);
      this.listaEstatusStand.push(status);
      this.listaIdStand.push(id);
      hasResult = 1;
    } else {
      let contador = 0;
      this.listaEstatusStand.forEach(element => {
        if (parseInt(id) == parseInt(this.listaIdStand[contador])) {
          element = status;
          hasResult = 1;
        }
        contador = contador + 1;
      });
    }
    if (hasResult == 0) {
      this.listaEstatusStand.push(status);
      this.listaIdStand.push(id);
    }

    time.subscribe((n) => {
      if (n == 0) {
        this.TimeEstatusStand = this.TimeEstatusStand - 1;
        if (this.TimeEstatusStand == 0) {
          this.TimeEstatusStand = 1;
          this.listaExpositorService.updateStatusStand(this.listaIdStand, this.listaEstatusStand).subscribe(
            Respuesta => {
              this.TimeEstatusStand = 0;
              if (Respuesta.type === HttpEventType.Response) {
                this.TimeEstatusStand = 0;
                this.listaIdStand = [];
                this.listaEstatusStand = [];
              }
            }
          );
        }
      }
    })

    this.lastIdStandSelected = parseInt(id);
  }


  public inputBuscador;

  buscador(event): void {

    this.timerBuscador = this.timerBuscador + 1;
    this.listaStand = [];
    let termino = event.target.value;

    var time = timer(500);
    time.subscribe((n) => {
      if (n == 0) {
        this.timerBuscador = this.timerBuscador - 1;
        if (this.timerBuscador == 0) {

        }
      }
    });

    if (termino == "") {
      this.FiltroExpositores();
    } else {
      this.listaTotalExpositores.forEach(element => {
        if (element.numeroStand.toLowerCase().startsWith(termino.toLowerCase()) || element.expositor.nombre_comercial.toLowerCase().startsWith(termino.toLowerCase())) {
          this.listaStand.push(element);
        }
      })
    }
  }



  selected = 'option2';

  private buttonDetailsAnimation(): void {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = '../../../assets/scripts/lista-expositores.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

}
