import { Component, EventEmitter } from '@angular/core';
import { StandReferencia } from '../models/StandReferencia';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DetalleExpositorService } from './detalle-expositor.service';
import { RenderDro } from '../models/RenderDro';
import { EvidenciaPorcetnajeArmado } from '../models/EvidenciaPorcentajeArmado';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/users/service/auth.service';
import { formatDate } from '@angular/common';
import { timer, interval } from 'rxjs';
import { DetalleContratoServicio } from '../models/DetalleContratoServicio';
import { EvidenciaServicio } from '../models/EvidenciaServicio';
import { Incidencia } from '../models/Incidencia';
import { IncidenciaReferenciada } from '../models/IncidenciaReferenciada';
import { reduce } from 'rxjs/operators';
import { DetalleUsuario } from '../models/DetalleUsuario';
import { User } from 'src/app/users/models/user';
declare var $: any;

@Component({
  selector: 'app-detalle-expositor',
  templateUrl: './detalle-expositor.component.html',
  styleUrls: ['./detalle-expositor.component.css'],
})
export class DetalleExpositorComponent {
  public incidenciaP: Incidencia = new Incidencia();

  public standRefe: StandReferencia = new StandReferencia();
  public renderDro: RenderDro[];
  public evidenciasArmado: EvidenciaPorcetnajeArmado[];
  public contratoServicio: DetalleContratoServicio[];
  public ShowFoto: any;
  public porcentaje;
  public url = this.standReferenciaService.urlEndPoint.concat('/showEvidenciaArmado');
  public urlServicios = this.standReferenciaService.urlEndPoint.concat('/showEvidenciaServicio');
  public newPhoto: string;
  public bubbleEvidenciaArmado: EvidenciaPorcetnajeArmado;
  public modalServicios: DetalleContratoServicio[] = [];
  public evidenciaServicios: EvidenciaServicio[] = [];
  public incidencia: IncidenciaReferenciada[];

  public colorBarra = "red";
  public dataServices: any;
  public Time: number = 0;
  public TimeStatusEvidencia = 0;
  public TimeIncidencia = 0;
  public totalServicios = 0;

  private fotoEvidencia: File;
  private fotoEvidenciaServicio: File;
  private emptyFile: File;
  private statusEvidenciaBubble: number = 0;
  private emptyEvidenciaServicio: boolean;
  private emptyEvidenciaArmado: boolean;
  public actual: string = "1";

  constructor(private ruta: HttpClient,
    private rutaActiva: ActivatedRoute,
    private standReferenciaService: DetalleExpositorService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.sliderAnimation();
    this.getDetalleExpositor();
    this.getIncidenciasReferenciadas();
  }

  getDetalleExpositor(): void {
    this.rutaActiva.params.subscribe(
      params => {
        let id = params['id']
        if (id) {
          this.standReferenciaService.getDetalleExpositor(id).subscribe(
            Respuesta => {
              this.standRefe = Respuesta.standReferencia;
              this.renderDro = Respuesta.renderDro;
              this.contratoServicio = Respuesta.detalleContratoServicios;
              this.dataServices = this.standReferenciaService.dataServices;
              this.totalServicios = this.standReferenciaService.totalServices;
              this.cambiarColorBarraPorcentaje(parseInt(this.standRefe.porcentajeArmado));

            }
          )
        }
      })
  }
  changeTimerIncidencia() {
    var time = interval(60000);
    time.subscribe((n) => {
      this.incidencia.forEach(resp => {
        let minuto = parseInt(resp.incidencia.registroMinuto);
        minuto = minuto + 1;
        if (minuto >= 60) {
          resp.incidencia.registroMinuto = '00';
          let hora = parseInt(resp.incidencia.registroHora);
          hora = hora + 1;
          if (hora == 24) {
            resp.incidencia.registroHora = '00'
            let dia = parseInt(resp.incidencia.registroDia);
            dia = dia + 1;
            resp.incidencia.registroDia = '' + (dia + 1);
            /////End if hora
          } else {
            if (hora < 10) {
              resp.incidencia.registroHora = '0' + hora;
            } else {
              resp.incidencia.registroHora = '' + hora;
            }
          }
          /////End if minuto
        } else {
          if (minuto < 10) {
            resp.incidencia.registroMinuto = '0' + minuto;
          } else {
            resp.incidencia.registroMinuto = '' + minuto;
          }
        }
      })
    })
  }

  getIncidenciasReferenciadas(): void {
    this.rutaActiva.params.subscribe(
      params => {
        let id = params['id']
        if (id) {
          this.standReferenciaService.getIncidenciasStand(id).subscribe(
            Respuesta => {
              this.incidencia = Respuesta;
              this.changeTimerIncidencia();
            }
          )
        }
      })
  }

  updateStatusIncidencias(status: number, idIncidencia: number): void {
    this.TimeIncidencia = this.TimeIncidencia + 1;
    var time = timer(2000);
    time.subscribe((n) => {
      if (n == 0) {
        this.TimeIncidencia = this.TimeIncidencia - 1;
        if (this.TimeIncidencia == 0) {
          this.TimeIncidencia = 1;
          this.standReferenciaService.updateStatusIncidencia(status, idIncidencia).subscribe(
            Respuesta => {
              if (Respuesta.type === HttpEventType.Response) this.TimeIncidencia = 0;
            }
          );
        }
      }
    })
  }

  updatePorcentajeArmado(porcentaje: number): void {
    this.Time = this.Time + 1;
    var time = timer(2000);
    time.subscribe((n) => {
      if (n == 0) {
        this.Time = this.Time - 1;
        if (this.Time == 0) {
          this.Time = 1;
          this.standReferenciaService.updatePorcentajeArmado(porcentaje, this.standRefe.id).subscribe(
            Respuesta => {
              if (Respuesta.type === HttpEventType.Response) this.Time = 0;
            }
          );
        }
      }
    })
  }



  updateStatusEvidencia(idContratoServicio: number, idServicio: number): void {
    $("#statusEvidencia-" + this.statusEvidenciaBubble).attr("style", "display:none");
    $("#statusEvidencia-" + idContratoServicio).attr("style", "");
    this.statusEvidenciaBubble = idContratoServicio;
    this.TimeStatusEvidencia = this.TimeStatusEvidencia + 1;
    var time = timer(2500);
    time.subscribe((n) => {
      if (n == 0) {
        this.TimeStatusEvidencia = this.TimeStatusEvidencia - 1;
        if (this.TimeStatusEvidencia == 0) {
          this.TimeStatusEvidencia = 1;
          var arrayId = [];
          var arrayStatus = [];
          $("input:checkbox").each(
            function () {
              arrayId.push($(this).attr("id").substring(12));
              if ($(this).prop('checked')) {
                arrayStatus.push("1");
              } else {
                arrayStatus.push("0");
              }
            }
          );
          this.standReferenciaService.updateStatusServicio(arrayId, arrayStatus).subscribe(
            Respuesta => {
              if (Respuesta.type === HttpEventType.Response) {
                let response: any = Respuesta.body;
                $("#statusEvidencia-" + idContratoServicio).attr("style", "display:none");
                this.TimeStatusEvidencia = 0;
                this.statusEvidenciaBubble = 0;
                var total = 0;
                var activados = 0;
                response.evidenciaServicio.forEach(element => {
                  if (element.status == "1") activados = activados + 1;
                  total = total + 1;
                });
                this.dataServices.forEach(element => {
                  if (element.idServicio == idServicio) {
                    element.total = total;
                    element.activados = activados;
                  }
                });
              }
            }
          );
        }
      }
    })
  }

  calcularPorcentaje(): void {
    let percent = $("#percentLabel").attr("style");
    if (this.standRefe.porcentajeArmado != percent.split(":")[1].slice(0, -1)) {
      this.standRefe.porcentajeArmado = percent.split(":")[1].slice(0, -1);
      this.cambiarColorBarraPorcentaje(parseInt(this.standRefe.porcentajeArmado));
      this.updatePorcentajeArmado(parseInt(this.standRefe.porcentajeArmado));
    }
  }

  cambiarColorBarraPorcentaje(porcentaje: number): void {
    //rojo
    if (porcentaje < 30) {
      if (porcentaje > 20) {
        this.colorBarra = "rgb(213," + (porcentaje - 20) * 22 + ",18)";
      } else {
        this.colorBarra = "#D53512";
      }
    } else if (porcentaje >= 30 && porcentaje < 70) {
      ///amarillo
      if (porcentaje > 60) {
        this.colorBarra = "rgb(" + (213 - ((porcentaje - 60) * 22)) + "," + (198 - ((porcentaje - 60) * 3)) + ",18)"
      } else {
        this.colorBarra = "rgb(213,198,18)";
      }
    }
    else if (porcentaje >= 70 && porcentaje <= 99) {
      ///verde
      if (porcentaje > 91) {
        this.colorBarra = "rgb(15," + (171 - ((porcentaje - 90) * 8)) + "," + (porcentaje - 90) * 23 + ")"
      } else {
        this.colorBarra = "rgb(15,171,18)";
      }
    } else {
      ///azul
      this.colorBarra = "#0F64D5";
    }
  }

  getEvidenciasStand(id: number): void {
    this.emptyEvidenciaArmado = false;
    this.standReferenciaService.getEvidenciasStand(id).subscribe(
      objeto => {
        this.evidenciasArmado = objeto
        if (this.evidenciasArmado.length == 0) {
          this.emptyEvidenciaArmado = true;
        }
      }
    );
  }

  openModalServicios(idServicio: number): void {
    this.modalServicios = [];
    this.evidenciaServicios = [];
    this.emptyEvidenciaServicio = false;
    this.contratoServicio.forEach(result => {
      if (result.tipoServicio.servicio.id == idServicio) {
        this.modalServicios.push(result);
      }
    })
    this.standReferenciaService.getEvidenciaServicios(this.standRefe.id).subscribe(
      objeto => {
        objeto.forEach(result => {
          if (result.detalleContratoServicio.tipoServicio.servicio.id == idServicio) {
            this.evidenciaServicios.push(result);
          }
        })
        if (this.evidenciaServicios.length == 0) {
          this.emptyEvidenciaServicio = true;
          this.evidenciaServicios = [];
        }
      }
    );
  }

  seleccionarFoto(event) {
    this.fotoEvidencia = event.target.files[0];
    if (this.fotoEvidencia.type.indexOf('image') < 0) {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
      this.fotoEvidencia = this.emptyFile;
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(this.fotoEvidencia);
      reader.onload = (e) => {
        this.ShowFoto = reader.result;
        Swal.fire({
          title: 'Subir evidencia',
          html: '<center>con un avance del <b>' + this.standRefe.porcentajeArmado + '% ?</b></center>' +
            '<br><img src="' + this.ShowFoto + '" style="width: 300px;">',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',

          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.subirFoto();
            Swal.fire(
              '!Evidencia agregada!',
              '',
              'success'
            )
          }

        })
        $("#subir2").val("");
      }///End reader onload
    }
  }


  subirFoto() {
    if (this.fotoEvidencia) {
      this.standReferenciaService.uploadEvidencia(this.fotoEvidencia, this.standRefe.id, this.authService.user.id, this.standRefe.porcentajeArmado).subscribe(
        Respuesta => {
          if (Respuesta.type === HttpEventType.Response) {
            let response: any = Respuesta.body;
            response.evidencia.horaRegistro = formatDate(response.evidencia.registro, 'HH:mm', 'en-US');
            response.evidencia.registro = formatDate(response.evidencia.registro, 'dd/MM/yyyy', 'en-US');
            let preview;
            if (this.emptyEvidenciaArmado) {
              preview = "";
              this.emptyEvidenciaArmado = false;
            } else {
              preview = $("#newPhotos").html();
            }
            var porcentajeCero = "";
            if (response.porcentajeArmado == 0) {
              porcentajeCero == "&nbsp;&nbsp;";
            }
            $("#newPhotos").html(preview +
              '<div class="col-lg-6 p-2">' +
              '<img src="' + this.url + '/' + response.evidencia.img + '" style="width: 300px; height: 200px;">' +
              '<b class="text-danger"><label *ngIf="item.porcentajeArmado==0">' + porcentajeCero + '</label>' + response.evidencia.porcentajeArmado + '% </b>' +
              '<font>' + response.evidencia.registro + ' </font>' +
              '<font class="text-info">' + response.evidencia.horaRegistro + 'h</font>' +
              '<font class="text-success pl-4"><i class="fas fa-user-circle"></i>' + this.authService.user.nombre + ' ' + this.authService.user.aPaterno + '</font>' +
              '</div>');
          }
        }
      );
    } else {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
      return false;
    }
  }


  seleccionarFotoServicio(event, idServicio: number) {
    this.fotoEvidenciaServicio = event.target.files[0];
    if (this.fotoEvidenciaServicio.type.indexOf('image') < 0) {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
      this.fotoEvidenciaServicio = this.emptyFile;
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(this.fotoEvidenciaServicio);
      reader.onload = (e) => {
        this.ShowFoto = reader.result;
        Swal.fire({
          title: 'Subir evidencia de Servicio?',
          html: '<br><img src="' + this.ShowFoto + '" style="width: 300px;">',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.subirFotoServicios(idServicio);
            Swal.fire(
              '!Evidencia de servicio agregada!',
              '',
              'success'
            )
          }

        })
        $("#subir" + idServicio).val("");
      }///End reader onload
    }
  }


  subirFotoServicios(idServicio: number) {
    if (this.fotoEvidenciaServicio) {
      var estatus: String = "0";
      this.modalServicios.forEach(result => {
        if (result.id == idServicio) {
          estatus = result.status;
        }
      });
      this.standReferenciaService.uploadEvidenciaServicio(this.fotoEvidenciaServicio, idServicio, this.authService.user.id, estatus).subscribe(
        Respuesta => {
          if (Respuesta.type === HttpEventType.Response) {
            let response: any = Respuesta.body;
            response.evidencia.horaRegistro = formatDate(response.evidencia.registro, 'HH:mm', 'en-US');
            response.evidencia.registro = formatDate(response.evidencia.registro, 'dd/MM/yyyy', 'en-US');
            let objEvidencia: EvidenciaServicio = response.evidencia;
            objEvidencia.detalleUsuario = new DetalleUsuario();
            objEvidencia.detalleUsuario.usuario = new User();
            objEvidencia.detalleUsuario.usuario.nombre = this.authService.user.nombre;
            objEvidencia.detalleUsuario.usuario.aPaterno = this.authService.user.aPaterno
            console.log(objEvidencia);
            this.evidenciaServicios.push(objEvidencia);
          }
        }
      );
    } else {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
      return false;
    }

  }


  dataValidation(dato: String): boolean {
    if (dato == "") return false;
    return true;
  }

  byteValidation(dato: String): boolean {
    if (dato == "0") return false;
    return true;
  }

  emptyArray(array: any): boolean {
    if (array == 0) return true;
    return false;
  }

  cambiarColores(id: number) {
    var seleccionado = $('select[id=estatusIncidencia' + id + ']').val();
    this.updateStatusIncidencias(seleccionado, id);
    if (seleccionado == 0) {
      if ($(event.target).hasClass('bg-warning') || $(event.target).hasClass('bg-success')) {
        $("#estatusIncidencia" + id).removeClass("bg-warning");
        $("#estatusIncidencia" + id).removeClass("bg-success");
        $("#estatusIncidencia" + id).addClass("bg-danger");
      }
    } else if (seleccionado == 1) {
      if ($(event.target).hasClass('bg-danger') || $(event.target).hasClass('bg-success')) {
        $("#estatusIncidencia" + id).removeClass("bg-danger");
        $("#estatusIncidencia" + id).removeClass("bg-success");
        $("#estatusIncidencia" + id).addClass("bg-warning");
      }
    } else {
      $("#estatusIncidencia" + id).removeClass("bg-danger");
      $("#estatusIncidencia" + id).removeClass("bg-warning");
      $("#estatusIncidencia" + id).addClass("bg-success");
    }
  }

  private sliderAnimation(): void {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = '../../../assets/scripts/detalle-expositor.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);


  }


  seleccionarFotoR(event) {
    this.fotoEvidencia = event.target.files[0];
    if (this.fotoEvidencia.type.indexOf('image') < 0) {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
      this.fotoEvidencia = this.emptyFile;
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(this.fotoEvidencia);
      reader.onload = (e) => {
        this.ShowFoto = reader.result;
        Swal.fire({
          title: 'Subir evidencia e incidencia?',
          html: '<img src="' + this.ShowFoto + '" style="width: 300px;">',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',

          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar'
        }).then((result) => {
          if (result.value) {
            this.createR();
            Swal.fire(
              'Incidencia referenciada creada!',
              '',
              'success'
            )
          }

        })
      }
    }
  }

  createR(): void {
    console.log(this.incidenciaP);
    if (this.fotoEvidencia) {
      this.standReferenciaService.createR(this.incidenciaP, this.standRefe.id).subscribe(IncidenciaP => {
        this.cerrarModalR();
        Swal.fire('Nueva Incidencia Referenciada', 'Incidencia creada con éxito.', 'success');
        this.standReferenciaService.uploadFotoR(this.fotoEvidencia, IncidenciaP.Incidencia.ticket).subscribe(Resp => {
        })
      }
      );
    } else {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
    }
  }

  cerrarModalR() {
    var x = document.getElementById("1modR");
    x.click();
  }

  cambiarColorR() {

    if ($("#selectStatus2").val() == 1) {
      $("#selectStatus2").removeClass(" bg-success");
      $("#selectStatus2").removeClass(" bg-warning");
      $("#selectStatus2").addClass(" bg-danger");
    } else if ($("#selectStatus2").val() == 2) {
      $("#selectStatus2").removeClass(" bg-success");
      $("#selectStatus2").removeClass(" bg-danger");
      $("#selectStatus2").addClass(" bg-warning");
    } else if ($("#selectStatus2").val() == 3) {
      $("#selectStatus2").removeClass(" bg-danger");
      $("#selectStatus2").removeClass(" bg-warning");
      $("#selectStatus2").addClass(" bg-success");
    } 
  }

  mostrarIncidentes(res) {
    document.getElementById(this.actual).style.display = 'none';
    document.getElementById(res).style.display = 'block';
    this.actual = res;
  }

}
