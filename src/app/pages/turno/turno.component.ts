import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css']
})
export class TurnoComponent implements OnInit {
  isSubmitted: boolean;
  user_found: boolean;

  listadoEspecialidades = []; // All users speciality
  especialidadseleccionada;
  listadoEspecialistas = []; // Final Array
  aux = []; // For sorting and removing duplicated specialities
  auxEspecialistas = []; // For saving temporary all specialists only

  constructor(private firebaseService: FirebaseService, public userService: UserService) { 
    var userLog = this.userService.getTipo();
    if(userLog === 'Usuario') {
      console.log(userLog);
      this.CheckEmail('Usuario');
    }
  }

  
  ngOnInit(){
    this.auxEspecialistas = []; //Reseting
    var control1;
    control1 = this.firebaseService.getUsers()
    .subscribe(val => {
      
      for (let index = 0; index < val.length; index++) {
        var aux_val: any;
        aux_val = val;

        // Gets all speciality
        if(aux_val[index].especialidad != 'NA'){
          // Saving data of professionals only in an Array for future actions
          this.auxEspecialistas.push(aux_val[index]);

          for (let a = 0; a < aux_val[index].especialidad.length; a++) {
            
            
            // Saving speciality only
            this.aux.push(aux_val[index].especialidad[a]);
            
          }
          
        }
        for (let i = 0; i < this.aux.length; i++) {
          // To delete duplication of speciality
          if(this.listadoEspecialidades.indexOf(this.aux[i]) === -1){
            // Saving NO duplicated specialities
            this.listadoEspecialidades.push(this.aux[i]);
          }
        }
      }
      
      control1.unsubscribe();
    });

  }

  EspecialidadSeleccionada(especialidad){
    this.listadoEspecialistas = [];
    this.especialidadseleccionada = especialidad;
    for (let index = 0; index < this.auxEspecialistas.length; index++) {
      
      for (let i = 0; i < this.auxEspecialistas[index].especialidad.length; i++) {
        
        if(this.auxEspecialistas[index].especialidad[i] == this.especialidadseleccionada){
          this.listadoEspecialistas.push(this.auxEspecialistas[index]); // It saves all user data if especialidad is the same as choosen
        }
        // It will show for example Barsana: Dentista, Alvarez: Dentista if their speciality is same as choosen
      }
      
    }
  }

  CheckEmail(formValue) {
    this.isSubmitted = true;
    this.user_found = true;

    
  }

  

}
