import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from "@angular/forms"; // Para formularios y sus validaciones
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // For animations 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SalaComponent } from './pages/sala/sala.component';

/* For Firebase */
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { from } from 'rxjs';

// Servicios
import { UserService } from './services/user.service';
import { LogoComponent } from './pages/logo/logo.component';
import { AdviceComponent } from './pages/advice/advice.component';
import { SiteStatusComponent } from './pages/site-status/site-status.component';
import { MenuComponent } from './pages/menu/menu.component';
import { RegistroComponent } from './pages/registro/registro.component';

/* Importing recaptcha */
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { EmailNotVerifiedComponent } from './auth/email-not-verified/email-not-verified.component';
import { MisdatosComponent } from './pages/misdatos/misdatos.component';
import { MypipePipe } from './pipes/mypipe.pipe';
import { Mypipe2Pipe } from './pipes/mypipe2.pipe';
import { Mypipe3Pipe } from './pipes/mypipe3.pipe';
import { TurnoComponent } from './pages/turno/turno.component';
import { TablaEspecialidadesComponent } from './pages/tabla-especialidades/tabla-especialidades.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { OrderbyPipe } from './pipes/orderby.pipe';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ComentariosComponent } from './pages/comentarios/comentarios.component';
import { AdminComponent } from './pages/admin/admin.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import { CustomoneDirective } from './customone.directive';
import { CustomtwoDirective } from './customtwo.directive';
import { FooterComponent } from './pages/footer/footer.component';
import { MyChartComponent } from './pages/my-chart/my-chart.component';
import { BusquedasComponent } from './pages/busquedas/busquedas.component';





@NgModule({
  declarations: [
    AppComponent,
    SalaComponent,
    LogoComponent,
    AdviceComponent,
    SiteStatusComponent,
    MenuComponent,
    RegistroComponent,
    EmailNotVerifiedComponent,
    MisdatosComponent,
    MypipePipe,
    Mypipe2Pipe,
    Mypipe3Pipe,
    TurnoComponent,
    TablaEspecialidadesComponent,
    NavbarComponent,
    PacientesComponent,
    OrderbyPipe,
    PerfilComponent,
    ComentariosComponent,
    AdminComponent,
    EstadisticasComponent,
    CustomoneDirective,
    CustomtwoDirective,
    FooterComponent,
    MyChartComponent,
    BusquedasComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
