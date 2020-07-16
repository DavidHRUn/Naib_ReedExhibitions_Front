import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './users/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './users/service/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ListaExpositoresComponent } from './floor_manager/lista-expositores/lista-expositores.component';
import { MenuFMComponent } from './floor_manager/menu-fm/menu-fm.component';
import { MenuAdminFMComponent } from './adminFM/menu-admin-fm/menu-admin-fm.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { MapaComponent } from './floor_manager/mapa/mapa.component';
import { IncidenciaEventoComponent } from './floor_manager/incidencia-evento/incidencia-evento.component';
import {MatSliderModule} from '@angular/material/slider';
import { DetalleExpositorComponent } from './floor_manager/detalle-expositor/detalle-expositor.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListaExpositoresComponent,
    MenuFMComponent,
    MenuAdminFMComponent,
    MapaComponent,
    IncidenciaEventoComponent,
    DetalleExpositorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxSpinnerModule,
    MatSliderModule,
    MatTabsModule,
    MatSelectModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
