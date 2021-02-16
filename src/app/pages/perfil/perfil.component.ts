import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  lunes = false;
  martes = false;
  miercoles = false;
  jueves = false;
  viernes = false;
  sabado = false;

  diasArray = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"]; // Dias de la semana
  horarioElegir = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"];
  horarioArray = [];

  disponibilidad = []; // Del profesional
  

  constructor(private firebaseService: FirebaseService, private userService: UserService) {

  }

  ngOnInit() {
    this.firebaseService.getUsers()
    .subscribe(val=> {
      
      this.disponibilidad = [];
      this.horarioArray = [];
      for (let index = 0; index < val.length; index++) {
        
        var aux_val: any;
        aux_val = val;
// this.userService.LoggedUser()
        if(aux_val[index].email === this.userService.LoggedUser()) {
          this.disponibilidad.push(aux_val[index].disponible);
          this.horarioArray.push(aux_val[index].horario);
        }
      }
    });
  }

  // To add days
  Select(key){

    var flag = 0;

    switch (key) {
      case "Lunes":

        for (let index = 0; index < this.disponibilidad[0].length; index++) {
        
          if(this.disponibilidad[0][index] === key) {
            flag = 1;
            break;
          }
          
        }
        if(flag == 0){this.firebaseService.UpdateUser(this.userService.LoggedUser(),key); // void
          this.ngOnInit();
        }
          
        break;

      case "Martes":

        for (let index = 0; index < this.disponibilidad[0].length; index++) {
        
          if(this.disponibilidad[0][index] === key) {
            flag = 1;
            break;
          }
          
        }
        if(flag == 0){this.firebaseService.UpdateUser(this.userService.LoggedUser(),key); // void
          this.ngOnInit();
        }

        break;

      case "Miercoles":

        for (let index = 0; index < this.disponibilidad[0].length; index++) {
        
          if(this.disponibilidad[0][index] === key) {
            flag = 1;
            break;
          }
          
        }
        if(flag == 0){this.firebaseService.UpdateUser(this.userService.LoggedUser(),key); // void
          this.ngOnInit();
        }

        break;

      case "Jueves":

        for (let index = 0; index < this.disponibilidad[0].length; index++) {
        
          if(this.disponibilidad[0][index] === key) {
            flag = 1;
            break;
          }
          
        }
        if(flag == 0){this.firebaseService.UpdateUser(this.userService.LoggedUser(),key); // void
          this.ngOnInit();
        }

        break;

      case "Viernes":

        for (let index = 0; index < this.disponibilidad[0].length; index++) {
        
          if(this.disponibilidad[0][index] === key) {
            flag = 1;
            break;
          }
          
        }
        if(flag == 0){this.firebaseService.UpdateUser(this.userService.LoggedUser(),key); // void
          this.ngOnInit();
        }

        break;

      case "Sabado": 

        for (let index = 0; index < this.disponibilidad[0].length; index++) {
        
          if(this.disponibilidad[0][index] === key) {
            flag = 1;
            break;
          }
          
        }
        if(flag == 0){this.firebaseService.UpdateUser(this.userService.LoggedUser(),key); // void
          this.ngOnInit();
        }

        break;

    }
    this.ngOnInit();

  }

  DeleteDay(key){

    var flag = 0;

    switch (key) {
      case "Lunes":

        for (let index = 0; index < this.disponibilidad[0].length; index++) {
        
          if(this.disponibilidad[0][index] === key) {
            this.firebaseService.DeleteDiaDisponible(this.userService.LoggedUser(),key); // void
            break;
          }
          
        }
        
        break;

      case "Martes":

        for (let index = 0; index < this.disponibilidad[0].length; index++) {
        
          if(this.disponibilidad[0][index] === key) {
            this.firebaseService.DeleteDiaDisponible(this.userService.LoggedUser(),key); // void
            break;
          }
          
        }
        
        break;

      case "Miercoles":

        for (let index = 0; index < this.disponibilidad[0].length; index++) {
        
          if(this.disponibilidad[0][index] === key) {
            this.firebaseService.DeleteDiaDisponible(this.userService.LoggedUser(),key); // void
            break;
          }
          
        }
        
        break;

      case "Jueves":

        for (let index = 0; index < this.disponibilidad[0].length; index++) {
        
          if(this.disponibilidad[0][index] === key) {
            this.firebaseService.DeleteDiaDisponible(this.userService.LoggedUser(),key); // void
            break;
          }
          
        }
        
        break;

      case "Viernes":

        for (let index = 0; index < this.disponibilidad[0].length; index++) {
        
          if(this.disponibilidad[0][index] === key) {
            this.firebaseService.DeleteDiaDisponible(this.userService.LoggedUser(),key); // void
            break;
          }
          
        }
        
        break;

      case "Sabado": 

        for (let index = 0; index < this.disponibilidad[0].length; index++) {
        
          if(this.disponibilidad[0][index] === key) {
            this.firebaseService.DeleteDiaDisponible(this.userService.LoggedUser(),key); // void
            break;
          }
          
        }
        
        break;

    }

    this.ngOnInit();

  }

  AddHours(time){

    var encontro = 0;
    for (let index = 0; index < this.horarioArray[0].length; index++) {
        
      if(this.horarioArray[0][index] === time) {
        encontro = 1;
        break;
      }
      
    }

    if(encontro == 0){
      this.firebaseService.UpdateUserHorario(this.userService.LoggedUser(),time);
    }

    this.ngOnInit();
  }

  DeleteHours(time){
    
    for (let index = 0; index < this.horarioArray[0].length; index++) {
        
      if(this.horarioArray[0][index] === time) {
        this.firebaseService.DeleteHours(this.userService.LoggedUser(),time);
        break;
      }
      
    }

    this.ngOnInit();
  }

}
