import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-busquedas',
  templateUrl: './busquedas.component.html',
  styleUrls: ['./busquedas.component.css']
})
export class BusquedasComponent implements OnInit {

  formTemplate = new FormGroup({
    nombrepaciente: new FormControl(''),
    nombremedico: new FormControl(''),
    especialidad: new FormControl(''),
    estado: new FormControl('')
    
  })

  usuarios = Array();
  turnos = Array();

  datos = Array();

  flag_encontrado = true;


  spiner = false;

  constructor(private firebaseService: FirebaseService) {

    this.firebaseService.getUsers()
    .subscribe(val=> {

      this.usuarios = Array();


      for (let index = 0; index < val.length; index++) {
        
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].tipo !== 'Admin') {
          this.usuarios.push(aux_val[index]);
        }
        
      }

    });
    this.firebaseService.getTurnos()
    .subscribe(val=> {

      this.turnos = Array();

      for (let index = 0; index < val.length; index++) {

        
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].email !== 'NA') {

          this.turnos.push(val[index]);

        }
        
        
      } // End for
      
    });

  }

  ngOnInit(): void {
  }

  search(formValue){

    this.spiner = true;

    this.datos = Array();

    /* 1 caso */

    if(formValue.nombrepaciente !== ""){
      
      for (let i = 0; i < this.usuarios.length; i++) {
        
        if(formValue.nombrepaciente == this.usuarios[i].nombre && this.usuarios[i].tipo == "Usuario"){

          for (let j = 0; j < this.turnos.length; j++) {
            
            // del paciente
            if(this.usuarios[i].email == this.turnos[j].email){

              for (let k = 0; k < this.usuarios.length; k++) {
                // del medico
                if(this.turnos[j].emailprofesional == this.usuarios[k].email){

                  var obj = {"fechaturno":this.turnos[j].fechaturno,"nombrepaciente":this.turnos[j].nombre,"apellidopaciente":this.turnos[j].apellido,"edad":this.turnos[j].edad,
                  "sexo":this.turnos[j].sexo,"email":this.turnos[j].email,"resenia":this.turnos[j].resenia,"fotopaciente":this.usuarios[i].foto,"nombremedico":this.usuarios[k].nombre,
                  "especialidad":this.usuarios[k].especialidad,"edadprofesional":this.usuarios[k].edad,"sexoprofesional":this.usuarios[k].sexo,"emailprofesional":this.usuarios[k].email,
                  "fotoprofesional":this.usuarios[k].foto
                  };
                  this.datos.push(obj);

                }
                
              }

            }
            
          }

        }
        
      }
    }

    /* 2 caso */
    if(formValue.nombremedico !== ""){
      
      for (let i = 0; i < this.usuarios.length; i++) {
        
        if(formValue.nombremedico == this.usuarios[i].nombre && this.usuarios[i].tipo == "Especialista"){

          for (let j = 0; j < this.turnos.length; j++) {
            
            // del profesional
            if(this.usuarios[i].email == this.turnos[j].emailprofesional){

              for (let k = 0; k < this.usuarios.length; k++) {
                // del paciente
                if(this.turnos[j].email == this.usuarios[k].email){

                  var obj = {"fechaturno":this.turnos[j].fechaturno,"nombrepaciente":this.turnos[j].nombre,"apellidopaciente":this.turnos[j].apellido,"edad":this.turnos[j].edad,
                  "sexo":this.turnos[j].sexo,"email":this.turnos[j].email,"resenia":this.turnos[j].resenia,"fotopaciente":this.usuarios[k].foto,"nombremedico":this.usuarios[i].nombre,
                  "especialidad":this.usuarios[i].especialidad,"edadprofesional":this.usuarios[i].edad,"sexoprofesional":this.usuarios[i].sexo,"emailprofesional":this.usuarios[i].email,
                  "fotoprofesional":this.usuarios[i].foto
                  };
                  this.datos.push(obj);

                }
                
              }

            }
            
          }

        }
        
      }
    } 

    /* 3 caso */
    if(formValue.especialidad !== ""){
      
      for (let i = 0; i < this.usuarios.length; i++) {
        
        if(formValue.especialidad == this.usuarios[i].especialidad[0] && this.usuarios[i].tipo == "Especialista"){

          for (let j = 0; j < this.turnos.length; j++) {
            
            // del profesional
            if(this.usuarios[i].email == this.turnos[j].emailprofesional){

              for (let k = 0; k < this.usuarios.length; k++) {
                // del paciente
                if(this.turnos[j].email == this.usuarios[k].email){

                  var obj = {"fechaturno":this.turnos[j].fechaturno,"nombrepaciente":this.turnos[j].nombre,"apellidopaciente":this.turnos[j].apellido,"edad":this.turnos[j].edad,
                  "sexo":this.turnos[j].sexo,"email":this.turnos[j].email,"resenia":this.turnos[j].resenia,"fotopaciente":this.usuarios[k].foto,"nombremedico":this.usuarios[i].nombre,
                  "especialidad":this.usuarios[i].especialidad,"edadprofesional":this.usuarios[i].edad,"sexoprofesional":this.usuarios[i].sexo,"emailprofesional":this.usuarios[i].email,
                  "fotoprofesional":this.usuarios[i].foto
                  };
                  this.datos.push(obj);

                }
                
              }

            }
            
          }

        }
        
      }
    }

     /* 4 caso */
    if(formValue.estado !== ""){
      
      for (let i = 0; i < this.turnos.length; i++) {
        
        if(formValue.estado == this.turnos[i].estado){ // si se encontró turno con estado seleccionado
          
          for (let j = 0; j < this.usuarios.length; j++) {
            
            // del profesional
            if(this.turnos[i].emailprofesional == this.usuarios[j].email && this.usuarios[j].tipo == "Especialista"){
              
              for (let k = 0; k < this.usuarios.length; k++) {
                // del paciente
                if(this.turnos[i].email == this.usuarios[k].email){

                  var obj = {"fechaturno":this.turnos[i].fechaturno,"nombrepaciente":this.turnos[i].nombre,"apellidopaciente":this.turnos[i].apellido,"edad":this.turnos[i].edad,
                  "sexo":this.turnos[i].sexo,"email":this.turnos[i].email,"resenia":this.turnos[i].resenia,"fotopaciente":this.usuarios[k].foto,"nombremedico":this.usuarios[j].nombre,
                  "especialidad":this.usuarios[j].especialidad,"edadprofesional":this.usuarios[j].edad,"sexoprofesional":this.usuarios[j].sexo,"emailprofesional":this.usuarios[j].email,
                  "fotoprofesional":this.usuarios[j].foto
                  };
                  this.datos.push(obj);

                }
                
              }

            }
            
          }

        }
        
      }
    }
    
    if(this.datos[0] == undefined){
      this.flag_encontrado = false;
    } else if(this.datos[0] !== undefined) {this.flag_encontrado = true;}

    this.spiner = false;

  }

  get formControls() {
    return this.formTemplate['controls'];
  }

}
