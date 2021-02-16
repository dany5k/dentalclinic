import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailNotVerifiedComponent } from './auth/email-not-verified/email-not-verified.component';
import { AutGuard } from './guards/aut.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { BusquedasComponent } from './pages/busquedas/busquedas.component';
import { ComentariosComponent } from './pages/comentarios/comentarios.component';
import { MenuComponent } from './pages/menu/menu.component';
import { MisdatosComponent } from './pages/misdatos/misdatos.component';
import { MyChartComponent } from './pages/my-chart/my-chart.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { SalaComponent } from './pages/sala/sala.component';
import { SiteStatusComponent } from './pages/site-status/site-status.component';
import { TurnoComponent } from './pages/turno/turno.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home', component: SalaComponent, data: {animation: 'Home'} },
  {path: 'login', component: MenuComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AutGuard]},
  {path: 'charts', component: MyChartComponent, canActivate: [AutGuard]},
  {path: 'busquedas', component: BusquedasComponent, canActivate: [AutGuard]},
  {path: 'registro', component: RegistroComponent, data: {animation: 'Registro'}},
  {path: 'turno', component: TurnoComponent, canActivate: [AutGuard]}, 
  {path: 'pacientes', component: PacientesComponent, canActivate: [AutGuard]}, 
  {path: 'perfil', component: PerfilComponent, canActivate: [AutGuard]},
  {path: 'comentarios', component: ComentariosComponent, canActivate: [AutGuard]},
  {path: 'misdatos', component: MisdatosComponent, canActivate: [AutGuard]},
  {path: 'closed', component: SiteStatusComponent},
  {path: 'emailnv', component: EmailNotVerifiedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
