import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/users/service/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/users/models/user';
import { Incidencia } from '../models/Incidencia';
import { IncidenciaService } from '../service/incidencia.service';
import Swal from 'sweetalert2';
import { Salon } from '../models/salon';
import $ from 'jquery';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-menu-fm',
  templateUrl: './menu-fm.component.html',
  styleUrls: ['./menu-fm.component.css']

})
export class MenuFMComponent implements OnInit {

  public incidencia: Incidencia = new Incidencia();
  public salon: Salon = new Salon();
  public sub: string;
  public actual: string = "1";
  private fotoEvidencia: File;
  private emptyFile: File;
  public ShowFoto: any;


  constructor(private authService: AuthService, private router: Router, private spinner: NgxSpinnerService, private incidenciaService: IncidenciaService) {

    this.classMenu();
  }

  dataUser: User;

  ngOnInit(): void {
    this.incidencia= new Incidencia();
    this.dataUser = this.authService.user;
  }


  logout() {
    this.spinner.show();
    this.authService.logout();
    this.router.navigate(['/']);
    this.spinner.hide();
  }

  create(): void {
    console.log(this.incidencia);
    if (this.fotoEvidencia) {
      this.incidenciaService.create(this.incidencia).subscribe(Incidencia => {
        this.cerrarModal();
        Swal.fire('Nueva Incidencia', 'Incidencia creada con éxito.', 'success');
        this.incidenciaService.uploadFoto(this.fotoEvidencia, Incidencia.Incidencia.ticket).subscribe(Resp => {
        })
      }
      );
    } else {
      Swal.fire('Error', 'Debe de seleccionar una foto', 'error');
    }
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
          title: 'Subir evidencia e incidencia?',
          html: '<img src="' + this.ShowFoto + '" style="width: 300px;">',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',

          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar'
        }).then((result) => {
          if (result.value) {
            this.create();
            Swal.fire(
              'Incidencia creada!',
              '',
              'success'
            )
          }

        })
        /* $("#subir2").val("");*/
      }///End reader onload
    }
  }

  cerrarModal() {
    var x = document.getElementById("1mod");
    x.click();
  }



  cambiarColor() {
    if ($("#selectStatus").val() == 1) {
      $("#selectStatus").removeClass(" bg-success");
      $("#selectStatus").removeClass(" bg-warning");
      $("#selectStatus").addClass(" bg-danger");
    } else if ($("#selectStatus").val() == 2) {
      $("#selectStatus").removeClass(" bg-success");
      $("#selectStatus").removeClass(" bg-danger");
      $("#selectStatus").addClass(" bg-warning");
    } else if ($("#selectStatus").val() == 3) {
      $("#selectStatus").removeClass(" bg-danger");
      $("#selectStatus").removeClass(" bg-warning");
      $("#selectStatus").addClass(" bg-success");
    }
  }

  mostrarIncidentes(res) {
    document.getElementById(this.actual).style.display = 'none';
    document.getElementById(res).style.display = 'block';
    this.actual = res;
  }

  classMenu() {
    // document.body.style.background= "#FFF";
    document.body.classList.add('hold-transition');
    document.body.classList.add('sidebar-mini');
    document.body.classList.add('layout-navbar-fixed');
    document.body.classList.add('sidebar-closed');
    document.body.classList.add('sidebar-collapse');
  }

}
