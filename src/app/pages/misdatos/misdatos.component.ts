import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { FirebaseService } from '../../services/firebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

/* CSV */
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

/* PDF */
import * as jsPDF from "../../../assets/jspdf";
import '../../../assets/jspdf-autotable';


@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.css']
})
export class MisdatosComponent implements OnInit {

  cant_turnos_activos = true; // To show a messsage if there are no turnos for Recepcionista
  cant_turnos = 0;

  resenia;
  comentar = false;
  comment_data;

  email;

  turnos = Array();
  todos_los_turnos = Array();
  turnos_activos = Array();
  turnos_a_cancelar = Array();
  cancelado = false;

  enviado = false;

  isSubmitted: boolean;

  formTemplate = new FormGroup({
    
    clinica: new FormControl('',[Validators.required, Validators.max(10), Validators.minLength(1)]),
    especialista: new FormControl('',[Validators.required, Validators.max(10), Validators.minLength(1)]),
    mensaje: new FormControl('',[Validators.required, Validators.maxLength(66)]),

  })

  spinner: boolean;

  constructor(private firebaseService: FirebaseService, public userService: UserService) { 

    var control;
    this.spinner = true;
    control = this.firebaseService.getTurnos()
    .subscribe(val=> {

      this.cant_turnos_activos = true; // for update
      this.cant_turnos = 0;

      this.turnos = Array();
      this.turnos_activos = Array();
      
      for (let index = 0; index < val.length; index++) {
        
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].email === this.userService.LoggedUser() && aux_val[index].comentado !== 'si') {
          this.turnos.push(aux_val[index]);
          this.cant_turnos ++ ;
        }
        
        if(aux_val[index].estado === "activo") {
          this.turnos_activos.push(aux_val[index]);
        }
      }

      // control.unsubscribe();
      this.spinner = false;

    });

  }

  

  ngOnInit() {
  }

  genCSV() {
    var data = [];

    data.push({
      Fecha_turno: "Fecha_turno",
      Horario: "Horario",
      Nombre: "Nombre",
      Apellido: "Apellido",
      Especialista: "Especialista",
      Codigo_sala: "Codigo_sala",
      Estado: "Estado"
    },)

    for (let index = 0; index < this.turnos.length; index++) {

      if(this.turnos[index].email === this.userService.LoggedUser()) {
        data.push({
          fecha_turno: this.turnos[index].fechaturno,
          horario: this.turnos[index].horario,
          nombre: this.turnos[index].nombre,
          apellido: this.turnos[index].apellido,
          especialista: this.turnos[index].especialista,
          codigo_sala: this.turnos[index].codigosala,
          estado: this.turnos[index].estado
        },)
        
      }
      
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
        doc.text('Turnos', 240, 30);
        doc.autoTable({html: '#miTabla',

        headStyles: {minCellHeight: 15, halign: 'center'},
        bodyStyles: {minCellHeight: 15, halign: 'center', fillcolor: [0, 250, 0], textColor: [0, 20, 255]}
      
      });
      doc.save("File.pdf");
  }

  Comentar(item) {
    this.comment_data = item;
    this.comentar = true;
  }

  /* Comentario */
  onSubmit(formValue) {

    this.spinner = true;

    this.isSubmitted = true;

    if(this.formTemplate.valid) {
      
      this.firebaseService.comentar(this.comment_data.fechaturno,this.comment_data.horario,formValue.clinica,formValue.especialista,this.comment_data.especialista,formValue.mensaje,this.comment_data.email,this.comment_data.emailprofesional,this.comment_data.nombre,this.comment_data.apellido).then(()=> {

        this.firebaseService.updateTurnosUser(this.comment_data.fechaturno,this.comment_data.horario,this.comment_data.email,this.comment_data.emailprofesional);
        this.enviado = true;
        this.spinner = false;

      }).catch(e => {
        this.spinner = false;
        console.log(e);
      });
    }
    
  }

  /* Searching turno by email */
  BuscarTurno() {
    this.turnos_a_cancelar = Array(); // Avoiding saving already saved data
    this.spinner = true;
    var flag = 0;
    this.cant_turnos_activos = true;

    for (let index = 0; index < this.turnos_activos.length; index++) {
      
      if(this.turnos_activos[index].email === this.email) {
        this.turnos_a_cancelar.push(this.turnos_activos[index]);
        
        flag ++;
      }
      
    }
    
    if(flag == 0) {
      this.cant_turnos_activos = false;
    }
    this.spinner = false;
  }

  Cancelar(item) {
    this.firebaseService.cancelTurno(item.fechaturno,item.horario,item.email,item.especialista);
    this.cancelado = true;
  }

  Resenia(item) {
    this.resenia = item.resenia;
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

}
