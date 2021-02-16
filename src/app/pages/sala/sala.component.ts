import { Component,OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import {UserService } from '../../services/user.service';

@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css']
})
export class SalaComponent implements OnInit {

  
  site_info;

  turno;
  /* Today date */
  today = new Date();
  semana = this.today.getDay(); // 0 - 1 - 2 - 3  /// 0 domingo
  dia = this.today.getDate(); // 1 - 2 - 3 - 4 - 5 etc
  mes = this.today.getMonth() + 1; // 1  - 2 - 3 - 4 - 5 - 6 - 7 - 8 - 9 - 10 - 11 - 12
  anio = this.today.getFullYear();

  fecha = this.dia+"-"+this.mes+"-"+this.anio;

  turnos = Array();

  sonar_flag = 0;

  constructor(private firebaseService: FirebaseService, public UserService: UserService) {
    this.fecha.toString();

    this.firebaseService.getTurnos()
      .subscribe(val=> {

        this.turnos = Array(); // I renew the Array because as it repeats, any database change will fill the array to infinite, this prevents it.
        // So the Array() will only be filled with data currently in database and avoiding adding the same data already added !

        for (let index = 0; index < val.length; index++) {
          
          var aux_val: any;
          aux_val = val;

          if(aux_val[index].fechaturno === this.fecha && aux_val[index].estado === 'activo' && aux_val[index].flag === 'true') {

            this.turnos.push(aux_val[index]);
            this.sonar_flag = 1;
          }
          
        }

        if(this.sonar_flag > 0) {
          this.Sonar();
        }

      });
  }
  
  ngOnInit() {

  }

  Info(dato) {
    this.site_info = dato;
  }

  Sonar() {
    var audio = new Audio("/assets/imagenes/next.wav");
    audio.play();
    this.sonar_flag = 0;
  }

}
