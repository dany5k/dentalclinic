import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabla-especialidades',
  templateUrl: './tabla-especialidades.component.html',
  styleUrls: ['./tabla-especialidades.component.css']
})
export class TablaEspecialidadesComponent implements OnInit {

  @Input() listadoEspecialidades = [];
  @Input() listadoEspecialistas = [];
  @Output() emitirverespecialidad: EventEmitter<any> = new EventEmitter();

  turnosDisponibles= [];
  turnosEnBDFechas = [];
  turnosRealizados = []; // All turnos in BD Turnos
  horariosEspecialista = null;

  espec;
  aux_espec = null;

  no_turnos = false;
  spinner = false;
  codigo_sala;
  
  next_date: number;
  next_month: number;
  next_year:number;

  next_free_turno;

    fecha = new Date();
    dia = this.fecha.getDate(); // - I must to validate it 0-1-2-3-4-5-6
    mes = this.fecha.getMonth() + 1; // 1 - 2 - 3 - 4 etc
    anio = this.fecha.getFullYear(); // ok

    quant_days_in_month = 0;
    esBisiesto = false; // 28 days and true 29 days

    diaSemana; // Para guardar el dí elegido temporariamente
    semanaParaBase = ""; // Para guardar dia de la semana que eligió el usuario
  
  constructor(private firebaseService: FirebaseService, private userService: UserService, private router: Router) { 
    this.turnosEnBDFechas = [];
    this.firebaseService.getTurnos()
    .subscribe(val => {
      
      for (let index = 0; index < val.length; index++) {
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].email != 'NA'){
          this.turnosEnBDFechas.push(aux_val[index].fechaturno);
          this.turnosRealizados.push(aux_val[index]);
        }
      }
    });
  }

  ngOnInit() {
    
  }

  VerEspecialidad(especialidad) {
    this.emitirverespecialidad.emit(especialidad);
  }

  mostrarTurnos(especialista, semana){

    this.diaSemana = ""; // Semana elegida (para resetiar)
    this.semanaParaBase = semana;

    this.aux_espec = especialista;
    this.turnosDisponibles = []; // For reset
    
    var fecha: Date;
    fecha = new Date();
      
    var week = fecha.getDay(); // week  0 - 1 - 2 - 3 - 4 - 5 - 6  /// 0 Domingo
    var day = fecha.getDate(); // - I must to validate it
    var month = fecha.getMonth() + 1; // 1 - 2 - 3 - 4 etc
    var year = fecha.getFullYear(); // ok

    var aux_semana;
    var choosen_semana;

        switch (week) {
          case 0:
            aux_semana = "Domingo";
          break;
          
          case 1:
            aux_semana = "Lunes";
          break;

          case 2:
            aux_semana = "Martes";
          break;

          case 3:
            aux_semana = "Miercoles";
          break;

          case 4: 
            aux_semana = "Jueves";
          break;

          case 5:
            aux_semana = "Viernes";
          break;

          case 6:
            aux_semana = "Sabado";
          break;
        }

        switch (semana) {
          case 'Domingo':
            choosen_semana = 0;
          break;
          
          case 'Lunes':
            choosen_semana = 1;
          break;

          case 'Martes':
            choosen_semana = 2;
          break;

          case 'Miercoles':
            choosen_semana = 3;
          break;

          case 'Jueves': 
            choosen_semana = 4;
          break;

          case 'Viernes':
            choosen_semana = 5;
          break;

          case 'Sabado':
            choosen_semana = 6;
            this.diaSemana = "Sabado";
          break;
        }

        var contador_dias = 0; // Have to be no more than 15

        if(week < choosen_semana){ // So the week is from next to Sundey
          this.next_date = day + (choosen_semana - week);
          contador_dias = (choosen_semana - week);
        } else if(week > choosen_semana){ // So the week is greather than choosen for example if today is Saturday but Monday was choosen
          this.next_date = day + (7 - (week - choosen_semana));
          contador_dias = (7 - (week - choosen_semana));
        } else if(week == choosen_semana){ // If the same day of week is choosen, so it will be the nex weeks day (next 7 days)
          this.next_date = day + 7;
          contador_dias = 7;
        }

        this.next_month = month;
        this.next_year = year;

        if(this.checkYearforFebruary(year)){this.quant_days_in_month = 29; this.esBisiesto = true;} else {this.quant_days_in_month = 28;}

        switch (month) {
          case 1:
            this.quant_days_in_month = 31;
          break;
          case 2:
            // break, cuz is already checked
          break;
          case 3:
            this.quant_days_in_month = 30;
          break;
          case 4:
            this.quant_days_in_month = 31;
          break;
          case 5:
            this.quant_days_in_month = 30;
          break;
          case 6:
            this.quant_days_in_month = 31;
          break;
          case 7:
            this.quant_days_in_month = 30;
          break;
          case 8:
            this.quant_days_in_month = 31;
          break;
          case 9:
            this.quant_days_in_month = 30;
          break;
          case 10:
            this.quant_days_in_month = 31;
          break;
          case 11:
            this.quant_days_in_month = 30;
          break;
          case 12:
            this.quant_days_in_month = 31;
          break;
        }
        
        if(this.quant_days_in_month == 30 && this.next_date > 30){
          this.next_date = this.next_date - 30;
          this.next_month = month + 1;
          this.next_year = year;
        } else if(this.quant_days_in_month == 31 && this.next_date > 31){
          this.next_date = this.next_date - 31;
          this.next_month = month + 1;
          this.next_year = year;
        }
        // If February 29 days
        if(this.esBisiesto && this.quant_days_in_month == 29 && this.next_date > 29){
          this.next_date = this.next_date - 29;
          this.next_month = month + 1;
          this.next_year = year;
        } else if(this.esBisiesto == false && this.quant_days_in_month == 28 && this.next_date > 28){
          this.next_date = this.next_date - 28;
          this.next_month = month + 1;
          this.next_year = year;
        }

        // If the month choosen is from next year
        if(month == 12 && this.next_date > 31){
          this.next_year = year + 1;
        }

        // Creating next free turno
        this.next_free_turno = this.next_date + "-" + this.next_month + "-" + this.next_year;
        
        this.checkTurnosDB(this.next_free_turno,this.aux_espec,contador_dias,semana);
    
  }

  checkTurnosDB(free_turno, especialista, contador_dias:number, semana){
    this.espec = null;
    this.no_turnos = false;
    var control;

    control = this.firebaseService.getUsers()
    .subscribe(val => {
      
      for (let index = 0; index < val.length; index++) {
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].email == especialista.email){
          this.horariosEspecialista = aux_val[index].horario;
        }
      }

    var listadoHorarios = [];
        
        // If data base has at least one turno
        if(this.turnosEnBDFechas.length > 0){
          for (let i = 0; i < this.turnosRealizados.length; i++) {
            if(free_turno == this.turnosRealizados[i].fechaturno && especialista.email == this.turnosRealizados[i].emailprofesional){
              listadoHorarios.push(this.turnosRealizados[i].horario); // Saving all hours from date
            }
          }
        } else {
          // If the data base is empty, so I let write turnos regardless to the quantity of turnos for a specific day
          console.log("DATA BASE OF TURNOS IS EMPTY !"); // Obviosly this else is for checking purpous only and can be safely deleted
        }


      var horariosDisponibles = [];


      
    if(listadoHorarios.length == 0){
      // So there are no turnos with the date choosen and I let write new turno
      // If turno does not exist with the profesional choosen. I have to show next available turno

      for (let i = 0; i < this.horariosEspecialista.length; i++) {
        horariosDisponibles.push(this.horariosEspecialista[i]); // writing all disponible hours
      }

    } else {
      
      // But if the day is found, I will check available hours
      for (let i = 0; i < listadoHorarios.length; i++) {
        
        for (let j = 0; j < this.horariosEspecialista.length; j++) {
          
          if(listadoHorarios[i] == this.horariosEspecialista[j]){
            this.horariosEspecialista.splice(j,1); // If It finds hours that are taken, so it eliminate them
          }
          
        }
        
      }

      /* This methods are for a turnos already in DB, so the user choose a specific day */

      if(this.horariosEspecialista.length == 0){
        // So there are no more hours for that day and we have to move the choosen day 1 week later
        if((contador_dias + 7) <= 15){
          contador_dias = contador_dias + 7;
          
          this.next_date = this.next_date + 7;

          if(this.quant_days_in_month == 30 && this.next_date > 30){
            this.next_date = this.next_date - 30;
            this.next_month = this.next_month + 1; // Next month
            this.next_year = this.anio;
          } else if(this.quant_days_in_month == 31 && this.next_date > 31){
            this.next_date = this.next_date - 31;
            this.next_month = this.next_month + 1;
            this.next_year = this.anio;
          }
  
          // If the month choosen is from next year
          if(this.next_month == 12 && this.next_date > 31){
            this.next_year = this.next_year + 1;
          }

          // Making next_free_turno
          this.next_free_turno = this.next_date + "-" + this.next_month + "-" + this.next_year;
          
          // Returning to CheckTurno() to check date again
          this.checkTurnosDB(this.next_free_turno,this.aux_espec,contador_dias,semana);

        } else if((contador_dias + 7) > 15 && this.horariosEspecialista.length == 0) {
          // If there are no turnos for each week choosen, so I show message that the user have to choose anoter weekday
          this.no_turnos = true;
        }


      } else if(this.horariosEspecialista.length > 0){
        // Showing next available hours
        horariosDisponibles = this.horariosEspecialista;
      }


    } // end IF the date choosen exists in DB

    /* Now I should create a complete date for turno */
    // Filling TurnosDisponibles
    for (let index = 0; index < horariosDisponibles.length; index++) {

      var horas = horariosDisponibles[index].split(':');
      
      // If saturday, save only if hours are less than 14:00
      if(this.diaSemana == "Sabado"){

        if(horas[0] < '14'){
          var turno = this.next_free_turno + " "+horariosDisponibles[index];
          this.turnosDisponibles.push(turno);
        }
      }
      else{ // And if is not saturday so save it regardless hours
        var turno = this.next_free_turno + " "+horariosDisponibles[index];
        this.turnosDisponibles.push(turno);
      }
      
    }

    this.espec = especialista;

      control.unsubscribe();

    });

    

  }

  guardarTurno(turno){
    this.spinner = true;
    // There I will save turno to Firebase and redirect to another location, or Empty Arrays of Especialistas and Turnos to actualize data
    
    this.listadoEspecialistas = []; // Erasing data
    this.turnosDisponibles = []; // Erasing data

    var control2;
    var hora = turno.split(" ");
    var fecha_turno = hora[0];
    var horario = hora[1];

    if(this.userService.getTipo() === "Usuario") {

      control2 = this.firebaseService.getUsers()
      .subscribe(val=> {
      
        for (let index = 0; index < val.length; index++) {
          var aux_val: any;
          aux_val = val;
          if(this.userService.LoggedUser() === aux_val[index].email) {
            this.codigo_sala = this.dia+this.mes+this.anio;

            
            this.firebaseService.createTurno(aux_val[index].nombre, aux_val[index].apellido, aux_val[index].edad, aux_val[index].sexo, aux_val[index].email, this.espec.especialidad, horario, this.dia+"-"+this.mes+"-"+this.anio, fecha_turno, this.semanaParaBase, aux_val[index].tipo, this.codigo_sala, this.espec.email);
            
            control2.unsubscribe();
          }
        }
        this.spinner = false;
      });
        // If User
        this.router.navigate(['/home']);
    }

    this.ngOnInit(); // To refresh Arrays
  }

  checkYearforFebruary(y){
    return y % 100 === 0 ? y % 400 === 0 : y % 4 === 0;
  }

}
