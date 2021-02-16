import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

/* PDF */
import * as jsPDF from "../../../assets/jspdf";
import 'jspdf-autotable';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

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

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.spinner = true;
    this.firebaseService.getUsers()
    .subscribe(val=> {

      this.empleados = Array();


      for (let index = 0; index < val.length; index++) {
        
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].tipo !== 'Usuario' && aux_val[index].tipo !== 'Admin') {
          this.empleados.push(aux_val[index]);
        }
        
      }

      this.spinner = false;

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

  genPDF() {
    /* html2canvas.default(document.getElementById('registro')).then((canvas)=>{
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      var img = canvas.toDataURL('image/png'); */
      
      const doc = new jsPDF('p', 'mm', 'a4');
      var position = 0;
        doc.setFontSize(22);
        doc.text('Empleados', 240, 30);
        doc.autoTable({html: '#miTabla',

        headStyles: {minCellHeight: 15, halign: 'center'},
        bodyStyles: {minCellHeight: 15, halign: 'center', fillcolor: [0, 250, 0], textColor: [0, 20, 255]}
      
      });
      doc.save("File.pdf");
  }

  Turnos_fecha() {

    this.cant_turnos_entre = 0;
    this.spinner = true;

    for (let index = 0; index < this.turnos.length; index++) {
      
      var f: string;
      f = this.turnos[index].fechaturno;
        if(this.turnos[index].email !== 'NA') {
          var aux_fecha = f.split('-');
        
        
          var fecha_media = aux_fecha[0];
          
          switch (aux_fecha[1]) {
            case '1':
              fecha_media += '0'+aux_fecha[1]+aux_fecha[2]; // 01
              break;
          
            case '2':
              fecha_media += '0'+aux_fecha[1]+aux_fecha[2];
              break;

            case '3':
              fecha_media += '0'+aux_fecha[1]+aux_fecha[2];
              break;

            case '4':
              fecha_media += '0'+aux_fecha[1]+aux_fecha[2];
              break;

            case '5':
              fecha_media += '0'+aux_fecha[1]+aux_fecha[2];
              break;

            case '6':
              fecha_media += '0'+aux_fecha[1]+aux_fecha[2];
              break;

            case '7':
              fecha_media += '0'+aux_fecha[1]+aux_fecha[2];
              break;

            case '8':
              fecha_media += '0'+aux_fecha[1]+aux_fecha[2];
              break;

            case '9': 
              fecha_media += '0'+aux_fecha[1]+aux_fecha[2];
              break;

            default:
              fecha_media += aux_fecha[1]+aux_fecha[2];
              break;
          }

          var f_media = Number.parseInt(fecha_media,10);

          var aux_f_uno = this.fecha_uno.split('-');
          var f_uno = aux_f_uno[2]+aux_f_uno[1]+aux_f_uno[0];
          var fech_uno = Number.parseInt(f_uno,10);

          var aux_f_dos = this.fecha_dos.split('-');
          var f_dos = aux_f_dos[2]+aux_f_dos[1]+aux_f_dos[0];
          var fech_dos = Number.parseInt(f_dos,10);
          
          if((fech_uno <= f_media) && (f_media <= fech_dos)) {
            
            this.cant_turnos_entre ++;
          }
        }
    }
    this.spinner = false;
  }

  Mostrar(value) {
    this.estadisticas = Array();
    var comentario = value.apellido + " " + value.nombre + " >> " + value.texto;
    this.estadisticas.push(comentario);
  }

  Estadisticas(item) {

    this.estadisticas = Array();

    for (let index = 0; index < item.fecha_ingreso.length; index++) {
      this.estadisticas.push(item.fecha_ingreso[index]);
    }

  }

  CloseSite() {
    this.firebaseService.CloseSite();
  }

}
