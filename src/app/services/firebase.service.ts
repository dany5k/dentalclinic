import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'; // Es el componente
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore, public au: AngularFireAuth, private router: Router) { }

  createUser(e_mail, password){
    return this.au.createUserWithEmailAndPassword(e_mail,password); // Esto crea al usuario a partir de email y password
  }

  login(email,pass) {
    return this.au.signInWithEmailAndPassword(email,pass); // Retorna una promesa tanto si se encontrò o no al usuario
  }

  createDBUsuarios(apell, pass, edad_, email_, espec, fecha_ing, imagen, nom, sexo_, tipo_, dispon) {

    var objUsuario;
    var Fechas = Array();
    var horas = [];
    Fechas.push(fecha_ing);

    if(tipo_ == 'Usuario') {
      
      objUsuario = {apellido:apell, clave:pass, edad:edad_, email:email_, especialidad:espec, fecha_ingreso:Fechas, foto:imagen, nombre:nom, sexo:sexo_, tipo:tipo_};
    }
    else {
      objUsuario = {apellido:apell, clave:pass, edad:edad_, email:email_, especialidad:espec, fecha_ingreso:Fechas, foto:imagen, nombre:nom, sexo:sexo_, tipo:tipo_, disponible:dispon, horario:horas};
    }
    
    return this.db.collection('users').doc("users/usuarios/"+ email_).set(objUsuario);
  }

  createDBUsuarios2(apell, pass, edad_, email_, espec, fecha_ing, imagen, nom, sexo_, tipo_, dispon, activo_) {

    var objUsuario;
    var Fechas = Array();
    var horas = [];
    Fechas.push(fecha_ing);

    if(tipo_ == 'Usuario') {
      
      objUsuario = {apellido:apell, clave:pass, edad:edad_, email:email_, especialidad:espec, fecha_ingreso:Fechas, foto:imagen, nombre:nom, sexo:sexo_, tipo:tipo_};
    }
    else {
      objUsuario = {apellido:apell, clave:pass, edad:edad_, email:email_, especialidad:espec, fecha_ingreso:Fechas, foto:imagen, nombre:nom, sexo:sexo_, tipo:tipo_, disponible:dispon, horario:horas, activo:activo_};
    }
    
    return this.db.collection('users').doc("users/usuarios/"+ email_).set(objUsuario);
  }

  createTurno(nom, apell, edad_, sexo_, email_, especialista_, horario_, fecha_, fechaturno_, semana_, registro, cod_sala,email_espec) {
    var objUsuario = {apellido:apell, edad:edad_, email:email_, emailprofesional:email_espec, especialista:especialista_, horario:horario_, fecha:fecha_, nombre:nom, sexo:sexo_, fechaturno:fechaturno_, semana:semana_, registrado:registro, estado:"activo", codigosala:cod_sala, comentado:'no', resenia:'NA', asistencia:'NA', flag:'false'};
    return this.db.collection('turnos').doc(fechaturno_+"_"+horario_+"_"+email_).set(objUsuario);
  }

  getUsers() {
    return this.db.collection('users/users/usuarios').valueChanges();
  }

  getTurnos() {
    return this.db.collection('turnos').valueChanges();
  }
/* It adds dateTime to a specific user */
  addUserFecha(user, fecha_ing) {
    var fechas;
    
    this.db.doc("users/users/usuarios/"+user).get().subscribe(value => {
      fechas = value.data().fecha_ingreso;
      fechas.push(fecha_ing);
      var usuario = {fecha_ingreso:fechas};
      this.db.doc("users/users/usuarios/"+user).update(usuario);
      
    });
  }

  getComments() {
    return this.db.collection('comentarios').valueChanges();
  }

  cancelTurno(fecha_turno, horario_, email_turno, espec) {

    var control;

    control = this.getTurnos()
    .subscribe(val => {

      for (let index = 0; index < val.length; index++) {
        
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].fechaturno === fecha_turno && aux_val[index].horario === horario_ && aux_val[index].email === email_turno && aux_val[index].emailprofesional === espec) {
          var usuario = {apellido:aux_val[index].apellido, edad:aux_val[index].edad, email:aux_val[index].email, especialista:aux_val[index].especialista, horario:aux_val[index].horario, fecha:aux_val[index].fecha, nombre:aux_val[index].nombre, sexo:aux_val[index].sexo, fechaturno:aux_val[index].fechaturno, registrado:aux_val[index].registrado, estado:"cancelado", codigosala:aux_val[index].codigosala};
          this.db.doc("turnos/"+fecha_turno+"_"+horario_+"_"+email_turno).update(usuario);

          break;
        }
      }
      control.unsubscribe();
    });
  }

  rechazarTurno(fecha_turno, horario_, email_turno, espec) {
    var control;

    control = this.getTurnos()
    .subscribe(val => {

      for (let index = 0; index < val.length; index++) {
        
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].fechaturno === fecha_turno && aux_val[index].horario === horario_ && aux_val[index].email === email_turno && aux_val[index].emailprofesional === espec) {
          var usuario = {apellido:aux_val[index].apellido, edad:aux_val[index].edad, email:aux_val[index].email, especialista:aux_val[index].especialista, horario:aux_val[index].horario, fecha:aux_val[index].fecha, nombre:aux_val[index].nombre, sexo:aux_val[index].sexo, fechaturno:aux_val[index].fechaturno, registrado:aux_val[index].registrado, estado:"rechazado", codigosala:aux_val[index].codigosala};
          this.db.doc("turnos/"+fecha_turno+"_"+horario_+"_"+email_turno).update(usuario);

          break;
        }
      }
      control.unsubscribe();
    });
  }

  comentar(fecha_turno, horario_, clinica_, especialista_, especialidad_, texto_, usuario_,email_espec_,nom,apell) {

    var obj = {fechaturno:fecha_turno, horario:horario_, clinica:clinica_, especialista:especialista_, especialidad:especialidad_, texto:texto_, usuario:usuario_,visto:"false",emailespecialista:email_espec_,nombre:nom,apellido:apell};
  
    return this.db.collection('comentarios/').doc(fecha_turno+"_"+horario_+"_"+usuario_).set(obj);

  }

  leercomentario(fecha_turno, horario_, clinica_, especialista_, especialidad_, texto_, usuario_,email_espec) {
    var obj = {fechaturno:fecha_turno, horario:horario_, clinica:clinica_, especialista:especialista_, especialidad:especialidad_, texto:texto_, usuario:usuario_,visto:"true",emailespecialista:email_espec};
  
    return this.db.collection('comentarios/').doc(fecha_turno+"_"+horario_+"_"+usuario_).set(obj);

  }

  /* This method will hide commented turnos */
  updateTurnosUser(fecha_turno, horario_, email_turno, email_prof) {
    var control;

    control = this.getTurnos()
    .subscribe(val => {

      for (let index = 0; index < val.length; index++) {
        
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].fechaturno === fecha_turno && aux_val[index].horario === horario_ && aux_val[index].email === email_turno && aux_val[index].emailprofesional === email_prof) {
          var usuario = {apellido:aux_val[index].apellido, edad:aux_val[index].edad, email:aux_val[index].email, especialista:aux_val[index].especialista, horario:aux_val[index].horario, fecha:aux_val[index].fecha, nombre:aux_val[index].nombre, sexo:aux_val[index].sexo, fechaturno:aux_val[index].fechaturno, registrado:aux_val[index].registrado, estado:aux_val[index].estado, codigosala:aux_val[index].codigosala, comentado:'si'};
          this.db.doc("turnos/"+fecha_turno+"_"+horario_+"_"+email_turno).update(usuario);

          break;
        }
      }
      control.unsubscribe();
    });
  }

  /* This method will end active Especialist's turnos and update turnos data */
  endTurno(fecha_turno, horario_, email_turno, email_espec, resenia_, asistencia_) {
    var control;

    control = this.getTurnos()
    .subscribe(val => {

      for (let index = 0; index < val.length; index++) {
        
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].fechaturno === fecha_turno && aux_val[index].horario === horario_ && aux_val[index].email === email_turno && aux_val[index].emailprofesional === email_espec) {
          var usuario = {apellido:aux_val[index].apellido, edad:aux_val[index].edad, email:aux_val[index].email, especialista:aux_val[index].especialista, horario:aux_val[index].horario, fecha:aux_val[index].fecha, nombre:aux_val[index].nombre, sexo:aux_val[index].sexo, fechaturno:aux_val[index].fechaturno, registrado:aux_val[index].registrado, estado:'terminado', codigosala:aux_val[index].codigosala, comentado:'no', resenia:resenia_, asistencia:asistencia_, flag:'false'};
          this.db.doc("turnos/"+fecha_turno+"_"+horario_+"_"+email_turno).update(usuario);

          break;
        }
      }
      control.unsubscribe();
    });
  }

  atenderPaciente(fecha_turno, horario_, email_turno, email_prof) {
    var control;

    control = this.getTurnos()
    .subscribe(val => {

      for (let index = 0; index < val.length; index++) {
        
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].fechaturno === fecha_turno && aux_val[index].horario === horario_ && aux_val[index].email === email_turno && aux_val[index].emailprofesional === email_prof) {
          var usuario = {apellido:aux_val[index].apellido, edad:aux_val[index].edad, email:aux_val[index].email, especialista:aux_val[index].especialista, horario:aux_val[index].horario, fecha:aux_val[index].fecha, nombre:aux_val[index].nombre, sexo:aux_val[index].sexo, fechaturno:aux_val[index].fechaturno, registrado:aux_val[index].registrado, estado:aux_val[index].estado, codigosala:aux_val[index].codigosala, comentado:'no',flag:'true'};
          this.db.doc("turnos/"+fecha_turno+"_"+horario_+"_"+email_turno).update(usuario);

          break;
        }
      }
      control.unsubscribe();
    });
  }

UpdateUser(email_,disp){
  var dispon;
    
    this.db.doc("users/users/usuarios/"+email_).get().subscribe(value => {
      dispon = value.data().disponible;
      dispon.push(disp);
      var usuario = {disponible:dispon};
      this.db.doc("users/users/usuarios/"+email_).update(usuario);
      
    });
}

UpdateUserHorario(email_,horas_){
  var horas;

  this.db.doc("users/users/usuarios/"+email_).get().subscribe(value => {
    horas = value.data().horario;
    horas.push(horas_);
    var usuario = {horario:horas};
    this.db.doc("users/users/usuarios/"+email_).update(usuario);
    
  });
}

DeleteDiaDisponible(email_,disp){
  var dispon = [];
  var aux;
    
    this.db.doc("users/users/usuarios/"+email_).get().subscribe(value => {
    aux = value.data().disponible;

  for (let index = 0; index < aux.length; index++) {
    
    if(aux[index] !== disp){
      dispon.push(aux[index]);
    }
    
  }
    var usuario = {disponible:dispon};
    this.db.doc("users/users/usuarios/"+email_).update(usuario);
  });
}

DeleteHours(email_,hora_) {
  var horas = [];
  var aux;
    
    this.db.doc("users/users/usuarios/"+email_).get().subscribe(value => {
    aux = value.data().horario;

  for (let index = 0; index < aux.length; index++) {
    
    if(aux[index] !== hora_){
      horas.push(aux[index]);
    }
    
  }
    var usuario = {horario:horas};
    this.db.doc("users/users/usuarios/"+email_).update(usuario);
  });
}

  SiteStatus() {
    return this.db.collection('site').valueChanges();
  }

  OpenSite() {
    var opensite = {status:'open'};
    this.db.doc("site/site").update(opensite);
    this.router.navigate(['/home']);
  }

  CloseSite() {
    var closesite = {status:'closed'};
    this.db.doc("site/site").update(closesite);
    this.router.navigate(['/closed']);
  }
}
