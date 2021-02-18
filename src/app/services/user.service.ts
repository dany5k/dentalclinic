import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  sitestatus;

  email_verified = false;

  user = false; // For authentication
  clu = null;
  user_photo = "/assets/imagenes/user.png";
  admin = false;
  specialist = false;
  reception = false;
  tipo; // For global check
  especialidad;
  user_to_register;

  atender_paciente;
  atendiendo = false;

  constructor(private router: Router, private firebaseService: FirebaseService) { 
    this.firebaseService.SiteStatus() 
      .subscribe(val => {
        for (let index = 0; index < val.length; index++) {
          var aux_val: any;
          aux_val = val;

          if(aux_val[index].status === 'closed') {
            this.sitestatus = 'closed';
          } else {
            this.sitestatus = 'open';
          }
        }
        if(this.sitestatus === 'closed') {
          this.killAllRights();
          this.user_photo = "/assets/imagenes/user.png";
          this.router.navigate(['/closed']);
        } else {
          this.router.navigate(['']);
        }
      });
  }

  isAuthenticated() {
    return this.user;
  }

  isAdmin() {
    return this.admin;
  }

  isSpecialist() {
    return this.specialist;
  }

  idReception() {
    return this.reception;
  }

  userPhoto() {
    return this.user_photo;
  }

  LoggedUser() {
    return this.clu;
  }

  getTipo() {
    return this.tipo;
  }

  getEspecialidad() {
    return this.especialidad;
  }

  getPaciente() {
    return this.atender_paciente;
  }
  
  killAllRights() {
    this.user = false;
    this.admin = false;
    this.specialist = false;
    this.reception = false;
    this.email_verified = false;
    localStorage.clear();
  }
}
