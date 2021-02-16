import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import {Chart} from 'node_modules/chart.js';

@Component({
  selector: 'app-my-chart',
  templateUrl: './my-chart.component.html',
  styleUrls: ['./my-chart.component.css']
})
export class MyChartComponent implements OnInit {

  spinner: boolean;

  empleados = Array();
  turnos = Array();

  /* Contadores de turnos */
  ortodoncista = 0;
  endodoncista = 0;
  cirujanooral = 0;
  imagenologia = 0;
  implantologo = 0;
  odontopediatra = 0;
  protesis = 0;

  recepcionista = 0;
  /* --------------------- */

  /* Contador de turnos por cada dia de la semana */
  TurnosLunes = 0;
  TurnosMartes = 0;
  TurnosMiercoles = 0;
  TurnosJueves = 0;
  TurnosViernes = 0;
  TurnosSabado = 0;

  cant_turnos_entre = 0;

/* Today date */
today = new Date();
semana = this.today.getDay(); // 0 - 1 - 2 - 3  /// 0 domingo
dia = this.today.getDate(); // 1 - 2 - 3 - 4 - 5 etc
mes = this.today.getMonth() + 1; // 1  - 2 - 3 - 4 - 5 - 6 - 7 - 8 - 9 - 10 - 11 - 12
anio = this.today.getFullYear();

fecha = this.dia+"-"+this.mes+"-"+this.anio;
fecha_hoy = this.fecha.split('-');
aux_hoy = this.fecha_hoy[0]+this.fecha_hoy[1]+this.fecha_hoy[2];
hoy = Number.parseInt(this.aux_hoy,10);


/* Turnos realizados de cada especialidad */
real_ortodoncista = Array();
real_endodoncista = Array();
real_cirujanooral = Array();
real_imagenologia = Array();
real_implantologo = Array();
real_odontopediatra = Array();
real_protesis = Array();

/* Turnos cancelados de cada especialidad */
cancel_ortodoncista = Array();
cancel_endodoncista = Array();
cancel_cirujanooral = Array();
cancel_imagenologia = Array();
cancel_implantologo = Array();
cancel_odontopediatra = Array();
cancel_protesis = Array();

/* Realizados por clientes */
por_clientes = Array();
/* Realizados por recepcionista */
por_recepcionista = Array();


fecha_uno;
fecha_dos;

/* Especialidad más usada y menos usada */

MenosUsada;
MasUsada;

/* Comments */
mejores = Array();
peores = Array();

/* Access */
estadisticas = Array();

/* Especialidades */
especialidades = Array();

  constructor(private firebaseService: FirebaseService) { 

  }

  ngOnInit(): void {


    this.spinner = true;
    this.firebaseService.getUsers()
    .subscribe(val=> {

      this.empleados = Array();


      for (let index = 0; index < val.length; index++) {
        
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].tipo !== 'Usuario' && aux_val[index].tipo !== 'Admin' && aux_val[index].tipo !== 'Recepcionista') {
          this.empleados.push(aux_val[index]);
        }
        
      }

      this.spinner = false;

      this.estadisticas = Array(); //horas
      this.especialidades = Array();
      

      for (let index = 0; index < this.empleados.length; index++) {
        
        for (let i = 0; i < this.empleados[index].fecha_ingreso.length; i++) {
          
          if(this.empleados[index].fecha_ingreso[i] !== 'NA'){

            var datos = this.empleados[index].fecha_ingreso[i].split(' ');
            var horas = datos[2].split(':');
            var entero = parseInt(horas[0],10);
            this.estadisticas.push(entero);
            this.especialidades.push(this.empleados[index].especialidad);
          }
          
        }

      }

        /* CHARTS */
    
      var myChart = new Chart("myChart", {
        type: 'line',
        data: {
            labels: this.especialidades,
            datasets: [{
                label: 'Horas de ingreso',
                data: this.estadisticas,
                backgroundColor: [
                    'rgba(218,229,38, 0.2)'
                ],
                borderColor: [
                    'rgba(251,224,37, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
      });

      

      });


    this.spinner = true;
    this.firebaseService.getTurnos()
    .subscribe(val=> {

      /* Contador de turnos por cada dia de la semana */
      this.TurnosLunes = 0;
      this.TurnosMartes = 0;
      this.TurnosMiercoles = 0;
      this.TurnosJueves = 0;
      this.TurnosViernes = 0;
      this.TurnosSabado = 0;

      this.turnos = Array();

      /* Realizados */
      this.real_ortodoncista = Array();
      this.real_endodoncista = Array();
      this.real_cirujanooral = Array();
      this.real_imagenologia = Array();
      this.real_implantologo = Array();
      this.real_odontopediatra = Array();
      this.real_protesis = Array();

      /* Cancelados */
      this.cancel_ortodoncista = Array();
      this.cancel_endodoncista = Array();
      this.cancel_cirujanooral = Array();
      this.cancel_imagenologia = Array();
      this.cancel_implantologo = Array();
      this.cancel_odontopediatra = Array();
      this.cancel_protesis = Array();

      /* Realizados por cliente */
      this.por_clientes = Array();
      /* Realizados por recepcionista */
      this.por_recepcionista = Array();


      this.ortodoncista = 0;
      this.endodoncista = 0;
      this.cirujanooral = 0;
      this.imagenologia = 0;
      this.implantologo = 0;
      this.odontopediatra = 0;
      this.protesis = 0;

      this.recepcionista = 0;

      this.cant_turnos_entre = 0;

      for (let index = 0; index < val.length; index++) {

        
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].email !== 'NA') {
          this.turnos.push(val[index]);

          switch (aux_val[index].semana) {
            case "Lunes":
              this.TurnosLunes ++;
              break;
          
            case "Martes":
              this.TurnosMartes ++;
              break;

            case "Miercoles":
              this.TurnosMiercoles ++;
              break;

            case "Jueves":
              this.TurnosJueves ++;
              break;

            case "Viernes":
              this.TurnosViernes ++;
              break;

            case "Sabado":
              this.TurnosSabado ++;
              break;
          }

          for (let j = 0; j < aux_val[index].especialista.length; j++) {
          
            switch (aux_val[index].especialista[j]) {
              case 'Ortodoncista':
                this.ortodoncista ++;
                
                if(aux_val[index].estado === 'terminado') {
                  this.real_ortodoncista.push(aux_val[index]);
                } else {
                  if(aux_val[index].estado === 'cancelado') {
                    this.cancel_ortodoncista.push(aux_val[index]);
                  }
                }
                break;
                
              case 'Endodoncista':
                this.endodoncista ++;
                
                if(aux_val[index].estado === 'terminado') {
                  this.real_endodoncista.push(aux_val[index]);
                } else {
                  if(aux_val[index].estado === 'cancelado') {
                    this.cancel_endodoncista.push(aux_val[index]);
                  }
                }
                break;
    
              case 'Cirujano oral':
                this.cirujanooral ++;
                if(aux_val[index].estado === 'terminado') {
                  this.real_cirujanooral.push(aux_val[index]);
                } else {
                  if(aux_val[index].estado === 'cancelado') {
                    this.cancel_cirujanooral.push(aux_val[index]);
                  }
                }
              break;
    
              case 'Imagenologia':
                this.imagenologia ++;
                if(aux_val[index].estado === 'terminado') {
                  this.real_imagenologia.push(aux_val[index]);
                } else {
                  if(aux_val[index].estado === 'cancelado') {
                    this.cancel_imagenologia.push(aux_val[index]);
                  }
                }
              break;
    
              case 'Implantologo':
                this.implantologo ++;
                if(aux_val[index].estado === 'terminado') {
                  this.real_implantologo.push(aux_val[index]);
                } else {
                  if(aux_val[index].estado === 'cancelado') {
                    this.cancel_implantologo.push(aux_val[index]);
                  }
                }
              break;
    
              case 'Odontopediatra': 
                this.odontopediatra ++;
                if(aux_val[index].estado === 'terminado') {
                  this.real_odontopediatra.push(aux_val[index]);
                } else {
                  if(aux_val[index].estado === 'cancelado') {
                    this.cancel_odontopediatra.push(aux_val[index]);
                  }
                }
              break;
    
              case 'Protesis':
                this.protesis ++;
                if(aux_val[index].estado === 'terminado') {
                  this.real_protesis.push(aux_val[index]);
                } else {
                  if(aux_val[index].estado === 'cancelado') {
                    this.cancel_protesis.push(aux_val[index]);
                  }
                }
              break;
              /* --------------------- */
            }
            
          } // End for

          /* Turnos realizados por Cliente / Recepcionista */

          if(aux_val[index].registrado === 'Usuario') {
            this.por_clientes.push(aux_val[index]);
          }
          if(aux_val[index].registrado === 'Recepcionista') {
            this.por_recepcionista.push(aux_val[index]);
          }

        } // End if email !== 'NA'
        
        
      } // End for
      
      var doctores = Array(this.ortodoncista,this.endodoncista,this.cirujanooral,this.imagenologia,this.implantologo,this.odontopediatra,this.protesis); // 6 indexes
      var minimo = 0;
      var maximo = 0;
      var indice; // For less usde
      var indice2; // For max use
      var control = 0;
      var control2 = 0; // For max use
      var mensaje = "NA"; // For less use
      var mensaje2 = "NA"; // For max use

      /* Getting usage */

      for (let index = 0; index < doctores.length; index++) {
        
        if(control == 0 || minimo > doctores[index]) {
          minimo = doctores[index]; 
          indice = index; 
          control = 1;
        }

        if(control2 == 0 || maximo < doctores[index]) {
          maximo = doctores[index];
          indice2 = index;
          control2 = 1;
        }
        
      }

      for (let index = 0; index < doctores.length; index++) {
        
        if(index !== indice) {
          if(doctores[index] == minimo) {
            mensaje = "Más de una especialidad en poco uso!";
          }
        }

        if(index !== indice2) {
          if(doctores[index] == maximo) {
            mensaje2 = "Más de una especialidad en mayor uso!";
          }
        }
        
      }

      /* Retrieving names of Especialidad (menos usada) */
      switch (indice) {
        case 0:
          this.MenosUsada = "Ortodoncista";
          break;
      
        case 1:
          this.MenosUsada = "Endodoncista";
          break;

        case 2:
          this.MenosUsada = "Cirujano oral";
          break;

        case 3:
          this.MenosUsada = "Imagenologia";
          break;

        case 4:
          this.MenosUsada = "Implantologo";
          break;

        case 5:
          this.MenosUsada = "Odontopediatra";
          break;

        case 6:
          this.MenosUsada = "Protesis";
          break;
      }

      /* Retrieving names of Especialidad (más usada) */
      switch (indice2) {
        case 0:
          this.MasUsada = "Ortodoncista";
          break;
      
        case 1:
          this.MasUsada = "Endodoncista";
          break;

        case 2:
          this.MasUsada = "Cirujano oral";
          break;

        case 3:
          this.MasUsada = "Imagenologia";
          break;

        case 4:
          this.MasUsada = "Implantologo";
          break;

        case 5:
          this.MasUsada = "Odontopediatra";
          break;

        case 6:
          this.MasUsada = "Protesis";
          break;
      }

      if(mensaje !== 'NA') {
        this.MenosUsada = mensaje;
      }

      if(mensaje2 !== 'NA') {
        this.MasUsada = mensaje2;
      }

      /* ----------- End getting usage --------------- */

      
      this.spinner = false;


        /* CHART 2 */

      var myChart = new Chart("myChart2", {
        type: 'radar',
        data: {
            labels: ["Ortodoncista","Endodoncista","Cirujano oral","Imajenología","Implantólogo","Odontopediatra","Protesis"],
            datasets: [{
                label: 'Cantidad de Turnos',
                
                data: [this.ortodoncista,this.endodoncista,this.cirujanooral,this.imagenologia,this.implantologo,this.odontopediatra,this.protesis],
                backgroundColor: [
                    'rgba(0,98,135, 0.2)'
                ],
                borderColor: [
                    ' rgba(172,1,234, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
      });


       /* CHART 3 */

        var myChart = new Chart("myChart3", {
        type: 'doughnut',
        data: {
            labels: ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"],
            datasets: [{
                label: 'Cantidad de Turnos por Dia de la Semana',
                
                data: [this.TurnosLunes,this.TurnosMartes,this.TurnosMiercoles,this.TurnosJueves,this.TurnosViernes,this.TurnosSabado],
                backgroundColor: [
                    'rgba(245,8,8, 0.4)',
                    'rgba(255,194,33, 0.4)',
                    'rgba(255,252,28, 0.4)',
                    'rgba(0,244,27, 0.4)',
                    'rgba(0,135,214, 0.4)',
                    'rgba(153,0,145, 0.4)'

                ],
                borderColor: [
                    'rgba(130,0,45, 1)',
                    'rgba(216,148,0, 1)',
                    'rgba(196,227,1, 1)',
                    'rgba(0,172,42, 1)',
                    'rgba(0,124,151, 1)',
                    'rgba(121,0,94, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
      });

      
    });

    /* Comments */
    this.firebaseService.getComments() 
    .subscribe(val=> {

      this.mejores = Array();
      this.peores = Array();

      for (let index = 0; index < val.length; index++) {
        
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].usuario !== 'NA') {

          if(aux_val[index].clinica >= 7 && aux_val[index].especialista >= 7) {
            this.mejores.push(aux_val[index]);
          }
          
          if((aux_val[index].clinica <= 6 && aux_val[index].especialista <= 6) || (aux_val[index].clinica >= 7 && aux_val[index].especialista <= 6) || (aux_val[index].clinica <= 6 && aux_val[index].especialista >= 7)) {
            this.peores.push(aux_val[index]);
          }

        }
        
      }

    });


    

  }

}
