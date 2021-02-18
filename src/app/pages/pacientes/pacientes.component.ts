import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { UserService } from "../../services/user.service"; // I add it for security
import { FormGroup, FormControl, Validators } from '@angular/forms';


/* CSV */
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

/* PDF */
import * as jsPDF from "../../../assets/jspdf";
import '../../../assets/jspdf-autotable';


@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})


export class PacientesComponent implements OnInit {

  atendiendo = false;

  turnos = Array();
  datos;

  /* Today date */
  today = new Date();
  semana = this.today.getDay(); // 0 - 1 - 2 - 3  /// 0 domingo
  dia = this.today.getDate(); // 1 - 2 - 3 - 4 - 5 etc
  mes = this.today.getMonth() + 1; // 1  - 2 - 3 - 4 - 5 - 6 - 7 - 8 - 9 - 10 - 11 - 12
  anio = this.today.getFullYear();

  fecha = this.dia+"-"+this.mes+"-"+this.anio;

  asistencia;
  cant_turnos_activos = true;

  terminado = false;
  cancelado = false;
  rechazado = false;

  isSubmitted: boolean;


  formTemplate = new FormGroup({
    mensaje: new FormControl('',[Validators.required])
  })

  spinner: boolean;

  constructor(private firebaseService: FirebaseService, private userService: UserService) { }

  ngOnInit() {
    this.spinner = true;
    var control;
    
    this.fecha.toString();

    control = this.firebaseService.getTurnos()
      .subscribe(val=> {

        var flag = 0;
        this.cant_turnos_activos = true;

        this.turnos = Array(); // I renew the Array because as it repeats, any database change will fill the array to infinite, this prevents it.
        // So the Array() will only be filled with data currently in database and avoiding adding the same data already added !

        for (let index = 0; index < val.length; index++) {
          
          var aux_val: any;
          aux_val = val;

          
          if(aux_val[index].fechaturno === this.fecha && aux_val[index].estado === 'activo' && this.userService.isSpecialist() && this.userService.LoggedUser() === aux_val[index].emailprofesional) {
            this.turnos.push(aux_val[index]);
            flag ++;
          }
          
        }

        if(flag == 0) {
          this.cant_turnos_activos = false;
        }
        // control.unsubscribe();
        this.spinner = false;

      });
    
  }

  genCSV() {
    var data = [];

    data.push({
      Fecha_turno: "Fecha_turno",
      Nombre: "Nombre",
      Apellido: "Apellido",
      Codigo_sala: "Codigo_sala"
    },)

    for (let index = 0; index < this.turnos.length; index++) {

        data.push({
          fecha_turno: this.turnos[index].fechaturno,
          nombre: this.turnos[index].nombre,
          apellido: this.turnos[index].apellido,
          codigo_sala: this.turnos[index].codigosala
        },)
      
    }
    new AngularCsv(data, 'My Report');
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
        doc.text('Pacientes', 240, 30);
        doc.autoTable({html: '#miTabla',

        headStyles: {minCellHeight: 15, halign: 'center'},
        bodyStyles: {minCellHeight: 15, halign: 'center', fillcolor: [0, 250, 0], textColor: [0, 20, 255]}
      
      });
      doc.save("File.pdf");
  }

  // Si oprimo terminar
  Comentar(item) {

    if(this.asistencia == null || this.asistencia == '') {
      alert("NO SE SELECCIONÓ ASISTENCIA !");
    } else {
      this.datos = item;
      this.terminado = true; // It shows the reseña form
      // 

    }

  }

  Atender(item) {
    this.firebaseService.atenderPaciente(item.fechaturno,item.horario,item.email,item.emailprofesional);
    this.atendiendo = true;
  }

  CancelarTurno(item) {

    if(this.asistencia == null || this.asistencia == '') {
      alert("NO SE SELECCIONÓ ASISTENCIA !");
    } else {
      this.datos = item;
      this.terminado = true; // It shows the reseña form
      // Setting flag
      this.cancelado = true;

    }
  }

  RechazarTurno(item) {
    if(this.asistencia == null || this.asistencia == '') {
      alert("NO SE SELECCIONÓ ASISTENCIA !");
    } else {
      this.datos = item;
      this.terminado = true; // It shows the reseña form
      // Setting flag
      this.rechazado = true;

    }
  }

  onSubmit(formValue) {
    this.spinner = true;

    this.isSubmitted = true;

    if(this.formTemplate.valid) {
      this.firebaseService.endTurno(this.datos.fechaturno,this.datos.horario,this.datos.email,this.datos.emailprofesional, formValue.mensaje, this.asistencia);
      this.terminado = false;
      this.atendiendo = false;
    } // If is set as Cancelado, so first it will set is as terminado and then update the status to  cancelado
    if(this.formTemplate.valid && this.cancelado == true) {
      this.firebaseService.cancelTurno(this.datos.fechaturno,this.datos.horario,this.datos.email,this.datos.emailprofesional);
      this.cancelado = false;
    }
    if(this.formTemplate.valid && this.rechazado == true) {
      this.firebaseService.rechazarTurno(this.datos.fechaturno,this.datos.horario,this.datos.email,this.datos.emailprofesional);
      this.rechazado = false;
    }
    this.spinner = false;
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

}
