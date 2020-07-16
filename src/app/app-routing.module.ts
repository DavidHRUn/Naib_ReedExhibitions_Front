import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './users/login.component';
import { ListaExpositoresComponent } from './floor_manager/lista-expositores/lista-expositores.component';
import { MenuAdminFMComponent } from './adminFM/menu-admin-fm/menu-admin-fm.component';
import { DetalleExpositorComponent } from './floor_manager/detalle-expositor/detalle-expositor.component';
import { RolGuard } from './users/guards/rol.guard';


const routes: Routes = [
  {path : '', component: LoginComponent},
  {path : 'login', component: LoginComponent},
  {path: 'listaExpositores', component: ListaExpositoresComponent,canActivate: [RolGuard], data:{rol:'ROLE_FM'}},
  {path: 'adminFM', component: MenuAdminFMComponent},
  {path: 'detalleExpositor', component:DetalleExpositorComponent},
  {path: 'detalleExpositor/:id', component:DetalleExpositorComponent,  canActivate: [RolGuard], data:{rol: 'ROLE_FM'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
