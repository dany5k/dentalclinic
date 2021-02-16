import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from "../../services/user.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  logout = false; // To hide login form and button
  spinner = false;
  
  user_error: boolean;
  userfound = false;
  email_verified = true;

  activado = true;

  isSubmitted: boolean;
  usuarios; // Array();

  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  formTemplate = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
    password: new FormControl('',Validators.required)
  })

  constructor(private firebaseService: FirebaseService, private db: AngularFirestore, public userService: UserService, private router: Router) { }

  foto = this.userService.userPhoto();

  ngOnInit(): void {
  }

  onSubmit(formValue) {

    this.isSubmitted = true;

    if(this.formTemplate.valid) {

      this.Login(formValue.email, formValue.password);

    }
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  Login(email, password):void {
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();

    var fecha_ingr = dia+"-"+mes+"-"+anio+"  "+hora+":"+minutos;

    var isWorker = false;

    var subs_event;

    this.spinner = true;

    /* Checking if user is logging in or logging out */
    this.firebaseService.login(email, password).then(
        datos => {

          this.spinner = false;

          /* Assigning the observable to a variable */
          subs_event = this.firebaseService.getUsers()
          .subscribe(val => {
            for (let index = 0; index < val.length; index++) {
              var aux_val: any;
              aux_val = val;
              // && datos.user.emailVerified  -- delete this line for testing without email verification
              if(aux_val[index].email === datos.user.email && datos.user.emailVerified) {

                this.userService.email_verified = true;
                this.email_verified = this.userService.email_verified;

                if(aux_val[index].tipo == 'Especialista'){
                  
                  if(aux_val[index].activado == 'false'){
                    
                    this.activado = false;
                  } 
                  else if(aux_val[index].activado == 'true') {
                    console.clear();

                    /* Is Authenticated */
                    this.userService.user = true;

                    this.userfound = true;
      
                    this.user_error = false;
        
                    this.logout = true; // To hide the registration button

                    this.userService.user_photo = aux_val[index].foto;
                    this.foto = aux_val[index].foto;

                    /* Setting clu - current logged user */
                    this.userService.clu = datos.user.email;

                    /* Setting especialidad if applicable */
                    this.userService.especialidad = aux_val[index].especialidad;

                    /* If is a worker */
                    if(aux_val[index].tipo !== "Usuario" && aux_val[index].tipo !== "Admin") {

                      isWorker = true;

                      /* Checking if the worker does not work in reseption */
                      if(aux_val[index].tipo === "Especialista") {
                        this.userService.specialist = true; // To activate "Pacientes" area
                        this.userService.tipo = "Especialista";
                      }

                      if(aux_val[index].tipo === "Recepcionista") {
                        this.userService.reception = true; // To activate "Pacientes" area
                        this.userService.tipo = "Recepcionista";
                      }

                    } else { // If is Admin or Usuario
                      if(aux_val[index].tipo === "Admin") {
                        isWorker = true; // Just for security, inserting access date()
                        this.userService.admin = true; // To enable admin area
                        this.userService.tipo = "Admin";
                      } else {
                        this.userService.tipo = "Usuario";
                      }
                      isWorker = true; // For users date()
                    }
                  }
                  
                } // If non Especialista
                else if(aux_val[index].tipo !== 'Especialista'){
                  console.clear();

                  /* Is Authenticated */
                  this.userService.user = true;

                  this.userfound = true;
    
                  this.user_error = false;
      
                  this.logout = true; // To hide the registration button

                  this.userService.user_photo = aux_val[index].foto;
                  this.foto = aux_val[index].foto;

                  /* Setting clu - current logged user */
                  this.userService.clu = datos.user.email;

                  /* Setting especialidad if applicable */
                  this.userService.especialidad = aux_val[index].especialidad;

                  /* If is a worker */
                  if(aux_val[index].tipo !== "Usuario" && aux_val[index].tipo !== "Admin") {

                    isWorker = true;

                    /* Checking if the worker does not work in reseption */
                    if(aux_val[index].tipo === "Especialista") {
                      this.userService.specialist = true; // To activate "Pacientes" area
                      this.userService.tipo = "Especialista";
                    }

                    if(aux_val[index].tipo === "Recepcionista") {
                      this.userService.reception = true; // To activate "Pacientes" area
                      this.userService.tipo = "Recepcionista";
                    }

                  } else { // If is Admin or Usuario
                    if(aux_val[index].tipo === "Admin") {
                      isWorker = true; // Just for security, inserting access date()
                      this.userService.admin = true; // To enable admin area
                      this.userService.tipo = "Admin";
                    } else {
                      this.userService.tipo = "Usuario";
                    }
                    isWorker = true; // For users date()
                  }
                }
                
              } else { // If email is ok but is not verified 
                this.email_verified = this.userService.email_verified;
              }
            }
  
            if(isWorker == true) {
              this.UserFecha(email, fecha_ingr);

  
              /* ATTENTION: Explication of the function: */
              /* *** Each time the user logs in we have to insert the login dateTime, but the problem is that this function subscribes
              an event that works like a for() and creates a loop, so the dateTime will be written several times what we DO NOT NEED.
              To prevent this we have to KILL the loop (unsubscribe the function) so it will no longer listen from firebase.
              *** */

              // So we assign the method to a variable, then we call that variable and execute the unsubscribe method here. 
              subs_event.unsubscribe(); // So it works one time only. Each time the user logs in.
            }
          });
        }
      ).catch(Error => {
        this.spinner = false;
        this.user_error = true;
      });
  }

  UserFecha(email, fecha_ingr) {
    this.firebaseService.addUserFecha(email,fecha_ingr); // void
    this.router.navigate(['/home']);
  }

  ClearForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      email: '',
      password: ''
    });
  }

}
