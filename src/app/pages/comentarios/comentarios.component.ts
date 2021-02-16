import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

  comentarios = [];

  constructor(private firebase:FirebaseService, private user:UserService) {

    this.firebase.getComments()
    .subscribe(val => {

      this.comentarios = [];
      
      for (let index = 0; index < val.length; index++) {
        var aux_val: any;
        aux_val = val;

        if(aux_val[index].usuario !== 'NA' && aux_val[index].emailespecialista == this.user.LoggedUser() && aux_val[index].visto == 'false'){
          this.comentarios.push(aux_val[index]);
        }
      }
    });
  }

  ngOnInit() {
  }

  Visto(com){
    this.firebase.leercomentario(com.fechaturno,com.horario,com.clinica,com.especialista,com.especialidad,com.texto,com.usuario,com.emailespecialista);
  }

}
